import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { queryKeys } from "@/lib/api/query-keys";
import { toast } from "sonner";
import { Setting } from "../data/schema";
import { z } from "zod";
import { settingsServices } from "../api/services";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Setting;
}

const VALID_ERRORS = {
  required: "Поле обязательно",
};

export const settingMutationSchema =
  z.object({
    value: z
      .string()
      .min(1, VALID_ERRORS.required),
    description: z.string().optional(),
  });

export type FormData = z.infer<
  typeof settingMutationSchema
>;

export function SettingUpdateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(
      settingMutationSchema
    ),
    defaultValues: {
      ...currentRow,
    },
  });

  // Update
  const {
    mutate: mutateEdit,
    isPending,
  } = useMutation({
    mutationFn: async (
      data: FormData
    ) => {
      if (!currentRow) return;

      await settingsServices.update(
        currentRow.id,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.settings.all,
        refetchType: "all",
      });
      form.reset();
      toast.success(
        "Переменная успешно обновлена"
      );
      onOpenChange(false);
    },
  });

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            Изменить переменную
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='setting-form'
            onSubmit={form.handleSubmit(
              (data) => mutateEdit(data)
            )}
            className='flex-1'>
            <ScrollArea className='h-[calc(100vh-230px)] pr-4'>
              <div className='space-y-3 px-2 flex-1'>
                <FormField
                  control={form.control}
                  name='value'
                  render={({
                    field,
                  }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>
                        Значение
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='101'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({
                    field,
                  }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>
                        Описание
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Предназначение переменной'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button
              size='sm'
              variant='outline'>
              Закрыть
            </Button>
          </SheetClose>
          <Button
            disabled={isPending}
            size='sm'
            form='setting-form'
            type='submit'>
            Готово
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
