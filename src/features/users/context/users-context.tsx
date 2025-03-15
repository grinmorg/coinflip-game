"use client";
import React from "react";
import { User } from "../data/schema";

export type UsersDialogType =
  | "create"
  | "update"
  | "delete";

interface UsersContextType {
  open: UsersDialogType | null;
  setOpen: (
    str: UsersDialogType | null
  ) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<User | null>
  >;
}

const UsersContext =
  React.createContext<UsersContextType | null>(
    null
  );

interface Props {
  children: React.ReactNode;
  value: UsersContextType;
}

export function UsersContextProvider({
  children,
  value,
}: Props) {
  return (
    <UsersContext.Provider
      value={value}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsersContext = () => {
  const usersContext = React.useContext(
    UsersContext
  );

  if (!usersContext) {
    throw new Error(
      "useUsersContext has to be used within <UsersContext.Provider>"
    );
  }

  return usersContext;
};
