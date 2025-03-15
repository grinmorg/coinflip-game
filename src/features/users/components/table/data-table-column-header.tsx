import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EyeOffIcon,
  Settings2Icon,
} from "lucide-react";

interface DataTableColumnHeaderProps<
  TData,
  TValue
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<
  TData,
  TValue
>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<
  TData,
  TValue
>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        {title}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-2",
        className
      )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8 data-[state=open]:bg-accent'>
            <span>{title}</span>
            <Settings2Icon className='ml-2 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem
            onClick={() =>
              column.toggleVisibility(
                false
              )
            }>
            <EyeOffIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Скрыть колонку
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
