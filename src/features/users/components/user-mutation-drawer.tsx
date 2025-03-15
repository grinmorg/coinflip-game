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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  User,
  userRoleEnumSchema,
} from "../data/schema";
import {
  UserMutation,
  userMutationSchema,
} from "../data/schema-mutation";
import { userServices } from "../api/services";
import { queryKeys } from "@/lib/api/query-keys";
import { toast } from "sonner";
import { PasswordInput } from "@/components/forms/password-input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: User;
}

export function UserMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient();
  const isUpdate = !!currentRow;

  const form = useForm<UserMutation>({
    resolver: zodResolver(
      userMutationSchema
    ),
    defaultValues: currentRow
      ? {
          ...currentRow,
          password: "",
          isEdit: isUpdate,
        }
      : {
          email: "",
          balance: "0",
          role: userRoleEnumSchema.Enum
            .USER,
          password: "",
          confirmPassword: "",
          isEdit: isUpdate,
        },
  });

  // Create
  const {
    mutate: mutateCreate,
    isPending,
  } = useMutation({
    mutationFn: async (
      data: UserMutation
    ) => {
      await userServices.create({
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
        refetchType: "all",
      });
      form.reset();
      toast.success(
        "Пользователь успешно создан"
      );
      onOpenChange(false);
    },
  });

  // Update
  const { mutate: mutateEdit } =
    useMutation({
      mutationFn: async (
        data: UserMutation
      ) => {
        if (!currentRow) return;

        await userServices.update(
          currentRow.id,
          {
            ...data,
          }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.all,
          refetchType: "all",
        });
        form.reset();
        toast.success(
          "Пользователь успешно обновлён"
        );
        onOpenChange(false);
      },
    });

  const onSubmit = (
    data: UserMutation
  ) => {
    if (isUpdate) {
      mutateEdit(data);
    } else {
      mutateCreate(data);
    }
  };

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
            {isUpdate
              ? "Изменить пользователя"
              : "Создать пользователя"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className='flex-1'>
            <ScrollArea className='h-[calc(100vh-230px)] pr-4'>
              <div className='space-y-3 px-2 flex-1'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({
                    field,
                  }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>
                        Почта
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='user@example.com'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({
                    field,
                  }) => (
                    <FormItem className='space-y-3 relative'>
                      <FormLabel>
                        Роль
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={
                            field.onChange
                          }
                          defaultValue={
                            field.value
                          }
                          className='flex flex-col space-y-1'>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem
                                value={
                                  userRoleEnumSchema
                                    .Enum
                                    .USER
                                }
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Пользователь
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem
                                value={
                                  userRoleEnumSchema
                                    .Enum
                                    .ADMIN
                                }
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Админ
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='balance'
                  render={({
                    field,
                  }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>
                        Баланс
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({
                    field,
                  }) => (
                    <FormItem className='grid grid-cols-6 col-span-2 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 sm:text-left text-right'>
                        Пароль
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='e.g., S3cur3P@ssw0rd'
                          className='col-span-4'
                          isShowGenerationButton
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({
                    field,
                  }) => (
                    <FormItem className='grid grid-cols-6 col-span-2 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 sm:text-left text-right'>
                        Подтверждение
                        пароля
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='S3cur3P@ssw0rd'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
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
            form='user-form'
            type='submit'>
            Готово
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
