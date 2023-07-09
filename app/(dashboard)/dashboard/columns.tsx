"use client";

import { Icons } from "@/components/icons";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SheetReceipt } from "@/components/sheet-receipt";

import { deleteExtraction } from "@/lib/client-requests";
import { cn } from "@/lib/utils";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SheetInvoice } from "@/components/sheet-invoice";
import { SheetCardStatement } from "@/components/sheet-card-statement";

export type Extraction = {
  id: string;
  category: "receipts" | "invoices" | "credit card statements" | null;
  filename: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  receipt?: {
    id: string;
  };
  invoice?: {
    id: string;
  };
  cardStatement?: {
    id: string;
  };
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
        className="w-32 2xl:w-full truncate overflow-hidden text-slate-900"
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
        <div className="w-32">
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
        className="w-32 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
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
        <div className="w-32">
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
      <div className="w-32 text-slate-900">
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
      <div className="w-32 text-slate-900">
        {row.getValue<Date>("updatedAt").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      const status = statuses.find(
        (status) => status.value === row.original.status
      );

      return (
        <div className="flex gap-1.5 justify-end">
          <Link
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "text-slate-900"
            )}
            href={`${status?.link}${row.original.id}`}
          >
            <Icons.refresh strokeWidth={2} className="h-4 w-4 mr-1.5" />
            Process
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outlineDestructive"} size={"iconSm"}>
                <Icons.trash strokeWidth={2} className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Extraction in Pipeline
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This will permanently delete the current
                  extraction and remove the associated file. This action cannot
                  be undone.
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
        </div>
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
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <div className="flex gap-1.5 justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant={"outline"}
                size={"sm"}
                className="text-slate-900"
              >
                <Icons.sheetOpen strokeWidth={2} className="h-4 w-4 mr-1" />
                Show
              </Button>
            </SheetTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"outlineDestructive"} size={"iconSm"}>
                  <Icons.trash strokeWidth={2} className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete Processed Extraction
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure? This will permanently delete the current
                    extraction, remove the associated file and its extracted
                    data. This action cannot be undone.
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
            <SheetContent className="w-[512px]">
              {row.original.receipt && (
                <SheetReceipt uuid={row.original.receipt.id} />
              )}
              {row.original.invoice && (
                <SheetInvoice uuid={row.original.invoice.id} />
              )}
              {row.original.cardStatement && (
                <SheetCardStatement uuid={row.original.cardStatement.id} />
              )}
            </SheetContent>
          </Sheet>
        </div>
      );
    },
  },
];
