import { ColumnDef } from "@tanstack/react-table";
import { Keyword } from "../data/schema";
import { format } from "date-fns";
import { DATE_AND_TIME } from "@/lib/constants/date";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SettingsIcon } from "lucide-react";
import { columnsMapKeys } from "../data/columns-map-keys";

export const columns: ColumnDef<Keyword>[] =
  [
    {
      accessorKey: "text",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.text}
          </p>
        );
      },
    },
    {
      accessorKey: "region",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.region}
          </p>
        );
      },
    },
    {
      accessorKey: "maxClicks",
      header: ({ header }) => (
        <p>
          {
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }
          :
        </p>
      ),
      cell: ({ row }) => {
        const formattedDate = {
          "1d": "в день",
          "7d": "в неделю",
          "30d": "в месяц",
        }[row.original.resetDays];
        return (
          <p className='font-medium'>
            {row.original.maxClicks}{" "}
            {formattedDate}
          </p>
        );
      },
    },
    {
      accessorKey: "maxOnDayClicks",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {
              row.original
                .maxOnDayClicks
            }
          </p>
        );
      },
    },
    {
      accessorKey: "leftClicks",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.leftClicks}
          </p>
        );
      },
    },
    {
      accessorKey: "todayClicks",
      header: ({ column, header }) => (
        <DataTableColumnHeader
          column={column}
          title={`${
            columnsMapKeys[
              header.id as keyof Keyword
            ]
          }:`}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className='font-medium'>
            {row.original.todayClicks}
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
              header.id as keyof Keyword
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
              header.id as keyof Keyword
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
