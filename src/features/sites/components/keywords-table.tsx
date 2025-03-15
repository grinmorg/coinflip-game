import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { Keyword } from "../data/schema";
import { SkeletonTable } from "@/components/shared/skeletons/table";
import { DataTableViewOptions } from "./data-table-view-options";
import { CopyLinkButton } from "@/components/shared/copy-link-button";

interface DataTableProps {
  isLoading: boolean;
  columns: ColumnDef<Keyword>[];
  data?: Keyword[];
  // pagination: {
  //   pageSize: number;
  //   setPageSize: (
  //     pageSize: number
  //   ) => void;
  //   page: number;
  //   setPage: (page: number) => void;
  //   lastPage?: number;
  // };
  linkToNextKeyword?: string;
}

export function KeywordsTable({
  isLoading,
  columns,
  data,
  linkToNextKeyword,
}: // pagination,
DataTableProps) {
  const [
    rowSelection,
    setRowSelection,
  ] = useState({});
  const [
    columnVisibility,
    setColumnVisibility,
  ] = useState<VisibilityState>({
    maxOnDayClicks: false,
    leftClicks: false,
    todayClicks: false,
    createdAt: false,
    updatedAt: false,
  });
  const [
    columnFilters,
    setColumnFilters,
  ] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const table = useReactTable({
    data: data ? data : [],
    columns,
    // pageCount:
    //   pagination.lastPage ?? -1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      // pagination: {
      //   pageIndex: pagination.page - 1,
      //   pageSize: pagination.pageSize,
      // },
    },
    // onPaginationChange: (updater) => {
    //   if (
    //     typeof updater === "function"
    //   ) {
    //     const newState = updater({
    //       pageIndex:
    //         pagination.page - 1,
    //       pageSize: pagination.pageSize,
    //     });
    //     pagination.setPage(
    //       newState.pageIndex + 1
    //     );
    //     pagination.setPageSize(
    //       newState.pageSize
    //     );
    //   }
    // },
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange:
      setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange:
      setColumnFilters,
    onColumnVisibilityChange:
      setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),
    getSortedRowModel:
      getSortedRowModel(),
    getFacetedRowModel:
      getFacetedRowModel(),
    getFacetedUniqueValues:
      getFacetedUniqueValues(),
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center gap-x-2'>
        {/* Copy link  */}
        <CopyLinkButton
          link={
            linkToNextKeyword || ""
          }>
          Получить ссылку для этого
          сайта
        </CopyLinkButton>

        <div>
          <DataTableViewOptions
            table={table}
          />
        </div>
      </div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          {!!data?.length ? (
            <div className='rounded-md border'>
              <DataTable
                columns={columns}
                table={table}
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              Ключевых слов пока нет.
            </p>
          )}

          {/* <DataTablePagination
            table={table}
          /> */}
        </>
      )}
    </div>
  );
}
