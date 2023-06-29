"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, RefreshCw } from "lucide-react";
import Link from "next/link";

export type Extraction = {
  id: string;
  category: "receipts" | "invoices" | "credit card statements" | null;
  filename: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
};

export const categories = [
  { value: "receipts", label: "Receipts" },
  { value: "invoices", label: "Invoices" },
  { value: "credit card statements", label: "Card Statements" },
];

export const statuses = [
  {
    value: Status.TO_RECOGNIZE,
    label: "To Recognize",
    link: "/text-recognition/",
    textClass: "text-sky-500",
    borderClass: "border-sky-300",
  },
  {
    value: Status.TO_EXTRACT,
    label: "To Extract",
    link: "/data-extraction/",
    textClass: "text-orange-500",
    borderClass: "border-orange-300",
  },
  {
    value: Status.TO_VERIFY,
    label: "To Verify",
    link: "/verification/",
    textClass: "text-violet-500",
    borderClass: "border-violet-300",
  },
];

export const columns: ColumnDef<Extraction>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("id")}
        className="w-36 2xl:w-full truncate overflow-hidden text-slate-900"
      >
        {row.getValue("id")}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (category) => category.value === row.original.category
      );
      return (
        <div className="w-36">
          {(category?.value && (
            <Badge
              className="py-1 border-slate-900 text-slate-900"
              variant={"outline"}
            >
              {category.label}
            </Badge>
          )) || (
            <div className="text-xs font-medium text-slate-400 ml-4">None</div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Name" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("filename")}
        className="w-36 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.getValue("filename")}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status
      );
      return (
        <div className="w-36">
          <Badge
            className={cn("py-1", status?.textClass, status?.borderClass)}
            variant={"outline"}
          >
            {status?.label}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creation Date" />
    ),
    cell: ({ row }) => (
      <div className="w-36 text-slate-900">
        {row.getValue<Date>("createdAt").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => (
      <div className="w-36 text-slate-900">
        {row.getValue<Date>("updatedAt").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status
      );

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-slate-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>
                <Link
                  href={`${status?.link}${row.original.id}`}
                  className="flex items-center w-full"
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                  Process
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  console.log("delete");
                }}
              >
                <DialogTrigger className="flex items-center w-full">
                  <Trash className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                  Delete
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Extraction in Pipelines</DialogTitle>
              <DialogDescription className="pt-4">
                Are you sure? This will permanently delete the current
                extraction and remove the associated file. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const columnsWithoutStatus: ColumnDef<Extraction>[] = [
  ...columns.filter(
    (column) => column.id !== "status" && column.id !== "actions"
  ),
  {
    id: "actions",
    cell: () => (
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>
              <DialogTrigger className="flex items-center w-full">
                <Trash className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                Delete
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Processed Extraction</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure? This will permanently delete the current extraction
              and remove the associated file and extracted data. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
];
