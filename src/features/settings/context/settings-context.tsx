"use client";
import React from "react";
import { Setting } from "../data/schema";

export type SettingsDialogType =
  | "update";

interface SettingsContextType {
  open: SettingsDialogType | null;
  setOpen: (
    str: SettingsDialogType | null
  ) => void;
  currentRow: Setting | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<Setting | null>
  >;
}

const SettingsContext =
  React.createContext<SettingsContextType | null>(
    null
  );

interface Props {
  children: React.ReactNode;
  value: SettingsContextType;
}

export function SettingsContextProvider({
  children,
  value,
}: Props) {
  return (
    <SettingsContext.Provider
      value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettingsContext =
  () => {
    const settingsContext =
      React.useContext(SettingsContext);

    if (!settingsContext) {
      throw new Error(
        "useSettingsContext has to be used within <SettingsContext.Provider>"
      );
    }

    return settingsContext;
  };
