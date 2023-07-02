"use client";

import { SheetReceipt } from "@/components/sheet-receipt";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { deleteExtraction } from "@/lib/client-requests";

import { cn, mapCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PanelRightOpen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export type Invoice = {
  id: string;
  extractionId: string;
  extraction: {
    filename: string;
  };
  category: "hobbies" | "services" | "b2b" | "other";
  fromName: string;
  totalAmountDue: number;
  invoiceNumber: string;
  currency: string | null;
  date: Date;
  createdAt: Date;
};

export const categories = [
  {
    value: "b2b",
    label: "Business",
    textClass: "text-cyan-800",
    borderClass: "border-cyan-800",
    fillColorClass: "fill-cyan-800",
    bgColorClass: "bg-cyan-800",
  },
  {
    value: "hobbies",
    label: "Hobbies",
    textClass: "text-pink-500",
    borderClass: "border-pink-400",
    fillColorClass: "fill-pink-400",
    bgColorClass: "bg-pink-400",
  },
  {
    value: "other",
    label: "Other",
    textClass: "text-slate-500",
    borderClass: "border-slate-400",
    fillColorClass: "fill-slate-400",
    bgColorClass: "bg-slate-400",
  },
  {
    value: "services",
    label: "Services",
    textClass: "text-cyan-500",
    borderClass: "border-cyan-400",
    fillColorClass: "fill-cyan-400",
    bgColorClass: "bg-cyan-400",
  },
];

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => {
      const value =
        row.original.invoiceNumber === "" ? "None" : row.original.invoiceNumber;
      return (
        <div
          title={row.getValue("number")}
          className={cn(
            value === "None"
              ? "text-slate-400"
              : "2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900",
            "w-16"
          )}
        >
          {value}
        </div>
      );
    },
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
        <div className="w-24">
          <Badge
            className={cn("py-1", category?.textClass, category?.borderClass)}
            variant={"outline"}
          >
            {category?.label}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "fromName",
    accessorKey: "fromName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issuer" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("fromName")}
        className="w-40 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.original.fromName}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-28 text-slate-900">
        {row.getValue<Date>("date").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "totalAmountDue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Due" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("totalAmountDue")}
        className="w-32 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        <span>{mapCurrency(row.original.currency ?? "")} </span>
        {row.original.totalAmountDue.toFixed(2)}
      </div>
    ),
  },
  {
    id: "filename",
    accessorFn: (row) => row.extraction.filename,
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Name" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("filename")}
        className="w-32 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.getValue("filename")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extraction Date" />
    ),
    cell: ({ row }) => (
      <div className="w-32 text-slate-900">
        {row.getValue<Date>("createdAt").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <Sheet>
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
                <DropdownMenuItem className="cursor-pointer">
                  <SheetTrigger asChild>
                    <div className="flex items-center w-full">
                      <PanelRightOpen className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                      Show
                    </div>
                  </SheetTrigger>
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
                <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This will permanently delete the current receipt
                  and remove its associated file and extraction. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteExtraction(row.original.extractionId);
                    router.refresh();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <SheetContent className="w-[512px]">
            <SheetReceipt uuid={row.original.id} />
          </SheetContent>
        </Sheet>
      );
    },
  },
];
