"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Extraction = {
  id: string;
  filename: string;
  createdAt: Date;
  updatedAt: Date;
};

async function deleteExtraction(uuid: string) {
  const res = await fetch(`/api/delete/extraction?uuid=${uuid}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export const columns: ColumnDef<Extraction>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("id")}
        className="w-full truncate overflow-hidden text-slate-900"
      >
        {row.getValue("id")}
      </div>
    ),
    enableSorting: false,
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <AlertDialog>
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
                  href={`/data-extraction/${row.original.id}`}
                  className="flex items-center w-full"
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                  Process
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <AlertDialogTrigger asChild>
                  <div className="flex items-center w-full">
                    <Trash className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                    Delete
                  </div>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Extraction in Pipeline</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will permanently delete the current
                extraction and remove the associated file. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteExtraction(row.original.id);
                  router.refresh();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
