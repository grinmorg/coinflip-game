"use client";
import React, { useState } from "react";
import {
  UsersContextProvider,
  UsersDialogType,
} from "../context/users-context";
import { UsersList } from "./users-list";
import { User } from "../data/schema";
import useDialogState from "@/lib/hooks/use-dialog-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { userServices } from "../api/services";
import { queryKeys } from "@/lib/api/query-keys";
import { toast } from "sonner";
import { UserMutateDrawer } from "./user-mutation-drawer";

interface Props {
  className?: string;
}

export const UsersWrapper: React.FC<
  Props
> = ({ className }) => {
  const queryClient = useQueryClient();

  // Local states
  const [currentRow, setCurrentRow] =
    useState<User | null>(null);

  const [open, setOpen] =
    useDialogState<UsersDialogType>(
      // searchParams.action ||
      null
    );

  // Delete
  const { mutate: mutateDelete } =
    useMutation({
      mutationFn: async () => {
        if (!currentRow) return;

        await userServices.delete(
          currentRow.id
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.all,
          refetchType: "all",
        });
        toast.success(
          "Пользователь удалён"
        );
      },
    });

  return (
    <UsersContextProvider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}>
      <UsersList
        className={className}
      />

      {/* dialogs */}

      <UserMutateDrawer
        key='user-create'
        open={open === "create"}
        onOpenChange={() =>
          setOpen("create")
        }
      />

      {currentRow && (
        <>
          <UserMutateDrawer
            key={`user-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={() => {
              setOpen("update");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
          <ConfirmDialog
            key='user-delete'
            destructive
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => {
              setOpen(null);
              mutateDelete();
            }}
            title={`Вы уверены что хотите удалить пользователя с почтой: ${currentRow.email}?`}
            desc='Это действие необратимо.'
            confirmText='Удалить'
          />
        </>
      )}
    </UsersContextProvider>
  );
};
