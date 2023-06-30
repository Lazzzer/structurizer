"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Icons } from "../icons";

interface DataTableProps<TData, TValue> {
  title: string;
  emptyMessage: string;
  pageSize?: number;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn: {
    columnId: string;
    placeholder: string;
  };
  categories: {
    label: string;
    value: string;
  }[];
  statuses?: {
    label: string;
    value: string;
  }[];
}

export function DataTable<TData, TValue>({
  title,
  emptyMessage,
  pageSize = 5,
  columns,
  data,
  filterColumn,
  categories,
  statuses,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-2 w-full">
      {data.length === 0 ? (
        <div className="w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
          <div className="h-64 2xl:h-72 w-full border border-dashed rounded-lg border-slate-200 flex flex-col items-center justify-center">
            <Icons.empty
              strokeWidth={1.4}
              className="w-8 h-auto text-slate-400"
            />
            <p className="text-lg mt-1 text-slate-400 text-center">
              {emptyMessage}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <DataTableToolbar
              filterColumn={filterColumn}
              table={table}
              categories={categories}
              statuses={statuses}
            />
          </div>
          <div className="rounded-md border w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 2xl:h-72 text-lg text-slate-400 text-center"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
