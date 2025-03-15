import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DATE_AND_TIME } from "@/lib/constants/date";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SettingsIcon } from "lucide-react";
import { columnsMapKeys } from "../../data/columns-map-keys";
import {
  User,
  userRoleEnumSchema,
} from "../../data/schema";

export const columns: ColumnDef<User>[] =
  [
    {
      accessorKey: "id",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof User
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.id}
          </p>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof User
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.email}
          </p>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof User
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.balance}
          </p>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof User
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.role ===
            userRoleEnumSchema.Enum
              .ADMIN ? (
              <span className='text-orange-500'>
                Админ
              </span>
            ) : (
              <span className='text-green-500'>
                Пользователь
              </span>
            )}
          </p>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof User
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {format(
              row.original.createdAt,
              DATE_AND_TIME
            )}
          </p>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof User
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {format(
              row.original.updatedAt,
              DATE_AND_TIME
            )}
          </p>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <SettingsIcon size={16} />
      ),
      cell: DataTableRowActions,
    },
  ];
