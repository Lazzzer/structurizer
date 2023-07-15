"use client";

import { categories } from "@/app/(dashboard)/(structured-data)/receipts/columns";
import { Receipt, ReceiptItem } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
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
} from "./ui/alert-dialog";
import { deleteExtraction, getObjectUrl } from "@/lib/client-requests";
import { SheetReceiptEditor } from "./sheet-receipt-editor";
import { SheetError } from "./sheet-error";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SheetSkeleton } from "./sheet-skeleton";

interface SheetReceiptProps {
  id: string;
  children: React.ReactNode;
}

type ReceiptWithItems = Receipt & {
  items: ReceiptItem[];
};

async function getReceipt(id: string) {
  const res = await fetch(`/api/dashboard/receipts?id=${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Cannot fetch receipt");
  }
  const receipt = (await res.json()) as ReceiptWithItems;
  return receipt;
}

export function SheetReceipt({ id, children }: SheetReceiptProps) {
  const [receipt, setReceipt] = useState<ReceiptWithItems | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [hasGetFailed, setHasGetFailed] = useState(false);

  const idRef = useRef(id);

  useEffect(() => {
    async function get() {
      try {
        setReceipt(await getReceipt(idRef.current));
      } catch (e) {
        setHasGetFailed(true);
      }
    }
    if (!isEditing) {
      get();
    }
  }, [isEditing]);

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          setUrl(null);
          setIsEditing(false);
        }
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[512px]">
        {hasGetFailed && <SheetError />}
        {receipt ? (
          <div className="h-full w-full my-4 relative">
            <h1 className="text-2xl font-bold">Receipt</h1>
            {!isEditing ? (
              <div className="w-full">
                <div className="mt-10 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Category
                  </h2>
                  <p className="text-slate-700 text-end">
                    {
                      categories.find((c: any) => c.value === receipt.category)
                        ?.label
                    }
                  </p>
                </div>
                <div className="mt-6 flex justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">From</h3>
                    <p className="text-slate-700 text-sm leading-snug">
                      {receipt.from}
                    </p>
                  </div>
                  {receipt.number && (
                    <div>
                      <h3 className="font-semibold text-slate-900">Number</h3>
                      <p className="text-slate-700 text-sm leading-snug text-end">
                        {receipt.number}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Date Time</h3>
                    <p className="text-slate-700 text-sm leading-snug">
                      <span>{receipt.time ? `${receipt.time} - ` : ""}</span>
                      <span>
                        {new Date(receipt.date).toLocaleDateString("en-GB")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Items
                    </h2>
                    <div className="mt-2 mb-1 grid grid-cols-8 font-medium">
                      <h4 className="text-slate-800 col-span-4">Description</h4>
                      <h4 className="text-slate-800 col-span-2 justify-self-end">
                        Quantity
                      </h4>
                      <h4 className="text-slate-800 col-span-2 justify-self-end">
                        Amount
                      </h4>
                    </div>
                    <div className="h-full max-h-52 2xl:max-h-96 overflow-scroll">
                      {receipt.items.map((item) => (
                        <div
                          key={item.id}
                          className="mt-1 grid grid-cols-8 text-sm text-slate-700"
                        >
                          <p
                            title={item.description}
                            className="col-span-4 truncate overflow-hidden"
                          >
                            {item.description}
                          </p>
                          <p className="col-span-2 justify-self-end">
                            {item.quantity}
                          </p>
                          <p className="col-span-2 justify-self-end">
                            {item.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Subtotal</h3>
                    <p className="text-slate-700 text-sm text-end">
                      {receipt.subtotal?.toFixed(2) ?? "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <h3 className="font-semibold text-slate-900">Tax</h3>
                    <p className="text-slate-700 text-sm text-end">
                      {receipt.tax?.toFixed(2) ?? "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <h3 className="font-semibold text-slate-900">Tip</h3>
                    <p className="text-slate-700 text-sm text-end">
                      {receipt.tip?.toFixed(2) ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-row-1 justify-items-end">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 text-end">
                      Total
                    </h3>
                    <p className="text-slate-700 text-lg leading-snug text-end">
                      {receipt.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <SheetReceiptEditor
                receipt={receipt}
                setIsEditing={setIsEditing}
              />
            )}
            <div className="w-full flex gap-2 items-center justify-between absolute bottom-2 right-0">
              <div className="flex items-center gap-1.5">
                <Switch
                  id="display-pdf"
                  onCheckedChange={async () => {
                    if (!url) {
                      try {
                        setUrl(await getObjectUrl(receipt.extractionId));
                      } catch (_) {
                        console.log("Cannot display PDF");
                      }
                    } else {
                      setUrl(null);
                    }
                  }}
                  checked={url !== null}
                />
                <Label htmlFor="bulk-processing">Display PDF</Label>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure? This will permanently delete the current
                        receipt and remove its associated file and extraction.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          setUrl(null);
                          await deleteExtraction(receipt.extractionId);
                          window.location.reload();
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"} className="w-20">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
                {!isEditing && (
                  <Button className="w-20" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
            {url !== null && (
              <object
                data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
                type="application/pdf"
                style={{ width: "calc(100vw - 512px)", marginRight: "488px" }}
                className="h-screen absolute -top-10 right-0"
              />
            )}
          </div>
        ) : (
          <SheetSkeleton />
        )}
      </SheetContent>
    </Sheet>
  );
}
