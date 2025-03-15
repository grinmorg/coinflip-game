"use client";
import React from "react";
import { columns } from "./table/columns";
import { useAllSettings } from "../api/hooks/use-all-settings";
import { SettingsTable } from "./table/settings-table";

interface Props {
  className?: string;
}

export const SettingsList: React.FC<
  Props
> = ({ className }) => {
  const { data, isLoading } =
    useAllSettings();

  return (
    <div className={className}>
      <SettingsTable
        columns={columns}
        isLoading={isLoading}
        data={data}
      />
    </div>
  );
};
