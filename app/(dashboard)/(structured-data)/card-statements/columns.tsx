"use client";

import { Icons } from "@/components/icons";
import { SheetCardStatement } from "@/components/sheet-card-statement";
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
import { deleteExtraction } from "@/lib/client-requests";

import { cn, mapCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export type CardStatement = {
  id: string;
  extractionId: string;
  extraction: {
    filename: string;
  };
  issuerName: string;
  totalAmountDue: number;
  creditCardNumber: string | null;
  creditCardName: string | null;
  currency: string | null;
  date: Date;
  createdAt: Date;
};

export const categories = [
  {
    value: "entertainment",
    label: "Entertainment",
    textClass: "text-cyan-800",
    borderClass: "border-cyan-800",
    fillColorClass: "fill-cyan-800",
    bgColorClass: "bg-cyan-800",
  },
  {
    value: "food",
    label: "Food",
    textClass: "text-green-500",
    borderClass: "border-green-400",
    fillColorClass: "fill-green-400",
    bgColorClass: "bg-green-400",
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
  {
    value: "shopping",
    label: "Shopping",
    textClass: "text-orange-500",
    borderClass: "border-orange-400",
    fillColorClass: "fill-orange-400",
    bgColorClass: "bg-orange-400",
  },
  {
    value: "travel",
    label: "Travel",
    textClass: "text-red-500",
    borderClass: "border-red-400",
    fillColorClass: "fill-red-400",
    bgColorClass: "bg-red-400",
  },
];

export const columns: ColumnDef<CardStatement>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Card Number" />
    ),
    cell: ({ row }) => {
      const value =
        row.original.creditCardNumber === ""
          ? "None"
          : row.original.creditCardNumber;
      return (
        <div
          title={row.original.creditCardNumber ?? "None"}
          className={cn(
            value === "None"
              ? "text-slate-400"
              : "2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900",
            "w-28"
          )}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "creditCardName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Card Name" />
    ),
    cell: ({ row }) => {
      const value =
        row.original.creditCardName === ""
          ? "None"
          : row.original.creditCardName;
      return (
        <div
          title={row.getValue("creditCardName")}
          className={cn(
            value === "None"
              ? "text-slate-400"
              : "2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900",
            "w-28"
          )}
        >
          {value}
        </div>
      );
    },
  },
  {
    id: "issuerName",
    accessorKey: "issuerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issuer" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("issuerName")}
        className="w-24 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.original.issuerName}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-22 text-slate-900">
        {row.getValue<Date>("date").toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "totalAmountDue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("totalAmountDue")}
        className="w-24 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
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
        className="w-28 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
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
      <div className="w-28 text-slate-900">
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
        <div className="flex gap-1.5 justify-end">
          <SheetCardStatement id={row.original.id}>
            <Button variant={"outline"} size={"sm"} className="text-slate-900">
              <Icons.sheetOpen strokeWidth={2} className="h-4 w-4 mr-1" />
              Show
            </Button>
          </SheetCardStatement>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outlineDestructive"} size={"iconSm"}>
                <Icons.trash strokeWidth={2} className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Card Statement</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This will permanently delete the current card
                  statement and remove its associated file and extraction. This
                  action cannot be undone.
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
        </div>
      );
    },
  },
];
