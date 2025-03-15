import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DATE_AND_TIME } from "@/lib/constants/date";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SettingsIcon } from "lucide-react";
import { columnsMapKeys } from "../../data/columns-map-keys";
import { Setting } from "../../data/schema";

export const columns: ColumnDef<Setting>[] =
  [
    {
      accessorKey: "description",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Setting
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium text-gray-600'>
            {row.original.description}
          </p>
        );
      },
    },
    {
      accessorKey: "key",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Setting
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.key}
          </p>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Setting
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.value}
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
              header.id as keyof Setting
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
              header.id as keyof Setting
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
