"use client";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import ProgressAnimation from "@/components/shared/progress-animation";
import {
  User,
  userRoleEnumSchema,
} from "@/features/users/data/schema";
import { authServices } from "@/lib/api/auth/services";
import { queryKeys } from "@/lib/api/query-keys";
import { ROUTES } from "@/lib/constants/routes";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import useDialogState from "@/lib/hooks/use-dialog-state";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  loading: boolean;
  currentUser?: User;
  openLogoutDialog: () => void;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

export function AuthContextProvider({
  children,
  onlyAdmin = false,
}: {
  children: ReactNode;
  onlyAdmin?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isReady, setIsReady] =
    useState(false); // Состояние готовности

  const [
    isOpenLogout,
    setIsOpenLogout,
  ] = useDialogState<boolean>(false); // Состояние отображения диалогового окна выхода

  const {
    data: currentUser,
    error: accountError,
    isLoading: isCurrentUserLoading,
  } = useCurrentUser();

  // logout
  const {
    mutate: mutateLogout,
    isPending: isPendingLogout,
  } = useMutation({
    mutationFn: async () => {
      return await authServices.logout();
    },
    onSuccess: () => {
      // Ревалидация данных юзера
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.auth.account,
      });
    },
  });

  useEffect(() => {
    if (isCurrentUserLoading) {
      return; // Пока данные загружаются, ничего не делаем
    }

    if (!currentUser) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      router.push(ROUTES.login);
      return;
    }

    if (
      onlyAdmin &&
      currentUser.role !=
        userRoleEnumSchema.Enum.ADMIN
    ) {
      // Если пользователь не является администратором, перенаправляем на главную страницу
      router.push(ROUTES.cabinet);
      return;
    }

    // Если все проверки пройдены, устанавливаем isReady в true
    setIsReady(true);
  }, [
    currentUser,
    isCurrentUserLoading,
    router,
    onlyAdmin,
  ]);

  useEffect(() => {
    if (accountError) {
      queryClient.setQueryData(
        queryKeys.auth.account,
        null
      );
    }
  }, [accountError]);

  if (
    !isReady ||
    isCurrentUserLoading ||
    !currentUser
  ) {
    // Показываем загрузку, пока проверяется аутентификация и роль
    return (
      <div className='relative'>
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px]'>
          <ProgressAnimation />
        </div>
      </div>
    );
  }

  const value: AuthContextValue = {
    loading: isCurrentUserLoading,
    currentUser,
    openLogoutDialog: () =>
      setIsOpenLogout(true),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      <ConfirmDialog
        key='user-logout'
        destructive
        open={!!isOpenLogout}
        onOpenChange={() => {
          setIsOpenLogout(false);
        }}
        handleConfirm={() => {
          setIsOpenLogout(false);
          mutateLogout();
        }}
        title={
          "Вы уверены что хотите выйти?"
        }
        desc='После выхода вы будете перенаправлены на страницу входа.'
        confirmText={"Выйти"}
        disabled={isPendingLogout}
      />
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(
    AuthContext
  );
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
