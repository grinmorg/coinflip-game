"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Keyword } from "../data/schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Keyword;
}

const formSchema = z.object({
  text: z.string({
    message: "Обязательное поле",
  }), // Текст ключевого слова
  region: z.string({
    message: "Обязательное поле",
  }), // Регион
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
    }), // Строка в формате "Xd" (например, "7d")
});

type EditKeywordForm = z.infer<
  typeof formSchema
>;

export function EditKeywordDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<EditKeywordForm>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        ...currentRow,
      },
    }
  );

  const { mutate: mutateCreate } =
    useMutation({
      mutationFn: async (
        data: EditKeywordForm
      ) => {
        const response =
          await siteServices.updateKeyword(
            currentRow.id,
            data
          );

        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sites.all,
          refetchType: "all",
        });
        form.reset();
        toast.success(
          "Ключевое слово изменено"
        );
        onOpenChange(false);
      },
    });

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
            Изменение ключевого слова
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-[26.25rem] w-full pr-4 -mr-4 py-1'>
          <Form {...form}>
            <form
              id='edit-keyword-form'
              onSubmit={form.handleSubmit(
                (values) =>
                  mutateCreate(values)
              )}
              className='flex flex-col gap-2 p-0.5'>
              {/* Form Fields */}
              <FormField
                control={form.control}
                name='text'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Текст ключевого
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
                control={form.control}
                name='region'
                render={({ field }) => (
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
                control={form.control}
                name='maxClicks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Количество кликов:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='100'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='resetDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Период сброса
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
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type='submit'
            form='edit-keyword-form'>
            Готово
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
