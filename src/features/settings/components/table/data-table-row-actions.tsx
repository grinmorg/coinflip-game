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
import {
  EllipsisIcon,
  PencilIcon,
} from "lucide-react";
import { Setting } from "../../data/schema";
import { useSettingsContext } from "../../context/settings-context";

interface DataTableRowActionsProps {
  row: Row<Setting>;
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } =
    useSettingsContext();

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
              setCurrentRow(
                row.original
              );
              setOpen("update");
            }}>
            Редактировать
            <DropdownMenuShortcut>
              <PencilIcon size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
