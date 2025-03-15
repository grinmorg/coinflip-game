"use client";
import React from "react";
import { UsersTable } from "./table/users-table";
import { columns } from "./table/columns";
import { useAllUsers } from "../api/hooks/use-all-users";

interface Props {
  className?: string;
}

export const UsersList: React.FC<
  Props
> = ({ className }) => {
  const {
    data: allUsersData,
    isLoading,
  } = useAllUsers();

  return (
    <div className={className}>
      <UsersTable
        columns={columns}
        isLoading={isLoading}
        data={allUsersData}
      />
    </div>
  );
};
