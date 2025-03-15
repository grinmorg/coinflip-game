"use client";
import React, { useState } from "react";
import useDialogState from "@/lib/hooks/use-dialog-state";
import { Setting } from "../data/schema";
import {
  SettingsContextProvider,
  SettingsDialogType,
} from "../context/settings-context";
import { SettingsList } from "./settings-list";
import { SettingUpdateDrawer } from "./setting-update-drawer";

interface Props {
  className?: string;
}

export const SettingsWrapper: React.FC<
  Props
> = ({ className }) => {
  // Local states
  const [currentRow, setCurrentRow] =
    useState<Setting | null>(null);

  const [open, setOpen] =
    useDialogState<SettingsDialogType>(
      // searchParams.action ||
      null
    );

  return (
    <SettingsContextProvider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}>
      <SettingsList
        className={className}
      />

      {/* dialogs */}

      {currentRow && (
        <SettingUpdateDrawer
          key={`setting-update-${currentRow.id}`}
          open={open === "update"}
          onOpenChange={() => {
            setOpen("update");
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }}
          currentRow={currentRow}
        />
      )}
    </SettingsContextProvider>
  );
};
