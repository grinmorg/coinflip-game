import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Keyword } from "../data/schema";
import {
  EllipsisIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useSitesContext } from "../context/sites-context";

interface DataTableRowActionsProps {
  row: Row<Keyword>;
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const {
    setOpen,
    setCurrentRowKeyword,
  } = useSitesContext();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
            <EllipsisIcon className='h-4 w-4' />
            <span className='sr-only'>
              Открыть меню
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRowKeyword(
                row.original
              );
              setOpen("edit-keyword");
            }}>
            Редактировать
            <DropdownMenuShortcut>
              <PencilIcon size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Удалить */}
          <DropdownMenuItem
            onClick={() => {
              setCurrentRowKeyword(
                row.original
              );
              setOpen("delete-keyword");
            }}
            className='!text-red-500'>
            Удалить
            <DropdownMenuShortcut>
              <Trash2Icon size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
