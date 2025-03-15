import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SlidersVerticalIcon } from "lucide-react";
import { columnsMapKeys } from "../../data/columns-map-keys";
import { Setting } from "../../data/schema";

interface DataTableViewOptionsProps<
  TData
> {
  table: Table<TData>;
}

export function DataTableViewOptions<
  TData
>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'>
          <SlidersVerticalIcon className='mr-2 h-4 w-4' />
          <span>Колонки</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[250px]'>
        <DropdownMenuLabel>
          Переключить колонки
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !==
                "undefined" &&
              column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(
                  value
                ) =>
                  column.toggleVisibility(
                    !!value
                  )
                }>
                {
                  columnsMapKeys[
                    column.id as keyof Setting
                  ]
                }
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
