"use client";

import { z } from "zod";
import {
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/api/query-keys";
import { siteServices } from "../api/services";
import { toast } from "sonner";
import { Site } from "../data/schema";

// Фиксим схему для корректной работы с типами
const keywordSchema = z.object({
  text: z.string({
    message: "Обязательное поле",
  }),
  region: z.string({
    message: "Обязательное поле",
  }),
  maxClicks: z.coerce
    .string() // Автоматическое преобразование в число
    .refine(
      (val) => parseInt(val) > 0,
      "Должно быть положительным числом"
    ),
  resetDays: z
    .string()
    .regex(/^\d+d$/, {
      message: "Неверный формат",
    }),
  id: z.string().optional(),
});

const formSchema = z.object({
  url: z.string().url({
    message: "Некорректная ссылка",
  }),
  keywords: z
    .array(keywordSchema)
    .optional(),
  isEdit: z.boolean().default(false),
});

type AddSiteForm = z.infer<
  typeof formSchema
>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Site;
}

export function MutateSiteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient();
  const isUpdate = !!currentRow;

  const form = useForm<AddSiteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      keywords: [],
      isEdit: isUpdate,
      ...(currentRow && {
        url: currentRow.url,
        keywords:
          currentRow.keywords.map(
            (k) => ({
              // Явно перечисляем только нужные поля
              text: k.text,
              region: k.region,
              maxClicks:
                k.maxClicks.toString(), // Преобразуем number в string для формы
              resetDays: k.resetDays,
              id: k.id,
            })
          ),
      }),
    },
  });

  const { fields, append, remove } =
    useFieldArray({
      control: form.control,
      name: "keywords",
    });

  const {
    mutate: mutateCreate,
    isPending: isPendingCreate,
  } = useMutation({
    mutationFn: (data: AddSiteForm) =>
      siteServices.createSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sites.all,
      });
      form.reset();
      toast.success("Сайт добавлен");
      onOpenChange(false);
    },
  });

  const {
    mutate: mutateEdit,
    isPending: isPendingEdit,
  } = useMutation({
    mutationFn: (data: AddSiteForm) => {
      if (!currentRow)
        return Promise.reject();
      return siteServices.updateSite(
        currentRow.id,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sites.all,
      });
      form.reset();
      toast.success("Сайт обновлён");
      onOpenChange(false);
    },
  });

  const onSubmit = (
    data: AddSiteForm
  ) => {
    if (isUpdate) mutateEdit(data);
    else mutateCreate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isUpdate
              ? "Редактирование сайта"
              : "Добавление нового сайта"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-[26.25rem] w-full pr-4 -mr-4 py-1'>
          <Form {...form}>
            <form
              id='add-site-form'
              onSubmit={form.handleSubmit(
                onSubmit
              )}
              className='flex flex-col gap-2 p-0.5'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right sm:text-left'>
                      URL сайта:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {fields.map(
                (field, index) => (
                  <div
                    key={field.id}
                    className='space-y-2 border p-4 rounded'>
                    <FormField
                      control={
                        form.control
                      }
                      name={`keywords.${index}.text`}
                      render={({
                        field,
                      }) => (
                        <FormItem>
                          <FormLabel>
                            Текст
                            ключевого
                            слова:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='купить ноутбук'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        form.control
                      }
                      name={`keywords.${index}.region`}
                      render={({
                        field,
                      }) => (
                        <FormItem>
                          <FormLabel>
                            Регион:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Москва'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        form.control
                      }
                      name={`keywords.${index}.maxClicks`}
                      render={({
                        field,
                      }) => (
                        <FormItem>
                          <FormLabel>
                            Количество
                            кликов:
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='100'
                              {...field}
                              onChange={(
                                e
                              ) =>
                                field.onChange(
                                  e
                                    .target
                                    .value
                                )
                              } // Явное преобразование
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        form.control
                      }
                      name={`keywords.${index}.resetDays`}
                      render={({
                        field,
                      }) => (
                        <FormItem>
                          <FormLabel>
                            Период
                            сброса
                            кликов:
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className='w-full p-2 border rounded'>
                              <option value='1d'>
                                День
                              </option>
                              <option value='7d'>
                                Неделя
                              </option>
                              <option value='30d'>
                                Месяц
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() =>
                        remove(index)
                      }>
                      Удалить
                    </Button>
                  </div>
                )
              )}

              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  append({
                    text: "",
                    region: "",
                    maxClicks: "0",
                    resetDays: "1d",
                  })
                }>
                Добавить ключевое слово
              </Button>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            disabled={
              isPendingCreate ||
              isPendingEdit
            }
            type='submit'
            form='add-site-form'>
            {isUpdate
              ? "Сохранить"
              : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
