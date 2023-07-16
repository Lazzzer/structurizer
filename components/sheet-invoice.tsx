"use client";

import { categories } from "@/app/(dashboard)/(structured-data)/invoices/columns";
import { Invoice, InvoiceItem } from "@prisma/client";
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
import { SheetInvoiceEditor } from "./sheet-invoice-editor";
import { SheetError } from "./sheet-error";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { mapCurrency } from "@/lib/utils";
import { SheetSkeleton } from "./sheet-skeleton";
import { useRouter } from "next/navigation";

interface SheetInvoiceProps {
  id: string;
  children: React.ReactNode;
}

type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

async function getInvoice(id: string) {
  const res = await fetch(`/api/dashboard/invoices?id=${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Cannot fetch invoice");
  }
  const invoice = (await res.json()) as InvoiceWithItems;
  return invoice;
}

export function SheetInvoice({ id, children }: SheetInvoiceProps) {
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [hasGetFailed, setHasGetFailed] = useState(false);

  const router = useRouter();
  const idRef = useRef(id);

  useEffect(() => {
    async function get() {
      try {
        setInvoice(await getInvoice(idRef.current));
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
          router.refresh();
        }
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[512px]">
        {hasGetFailed && <SheetError />}
        {invoice ? (
          <div className="h-full w-full my-4 relative">
            <h1 className="text-2xl font-bold">Invoice</h1>
            {!isEditing ? (
              <div className="w-full">
                <div className="mt-10 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Category
                  </h2>
                  <p className="text-slate-700 text-end">
                    {
                      categories.find((c: any) => c.value === invoice.category)
                        ?.label
                    }
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Date</h3>
                    <p className="text-slate-700 text-sm leading-snug">
                      <span>
                        {new Date(invoice.date).toLocaleDateString("en-GB")}
                      </span>
                    </p>
                  </div>
                  {invoice.invoiceNumber && (
                    <div>
                      <h3 className="font-semibold text-slate-900">Number</h3>
                      <p className="text-slate-700 text-sm leading-snug text-end">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg text-slate-900">
                    Issuer
                  </h3>
                  <p className="text-slate-700 text-sm leading-snug">
                    {invoice.fromName}
                  </p>
                  {invoice.fromAddress && (
                    <p className="text-slate-500 text-xs leading-snug">
                      {invoice.fromAddress}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg text-slate-900">
                    Recipient
                  </h3>
                  <p className="text-slate-700 text-sm leading-snug">
                    {invoice.toName ?? "N/A"}
                  </p>
                  {invoice.toAddress && (
                    <p className="text-slate-500 text-xs leading-snug">
                      {invoice.toAddress}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Items
                    </h2>
                    <div className="mt-2 mb-1 grid grid-cols-8 font-medium">
                      <h4 className="text-slate-800 col-span-6">Description</h4>
                      <h4 className="text-slate-800 col-span-2 justify-self-end">
                        Amount
                      </h4>
                    </div>
                    <div className="h-full max-h-52 2xl:max-h-96 overflow-scroll">
                      {invoice.items.map((item) => (
                        <div
                          key={item.id}
                          className="mt-1 grid grid-cols-8 text-sm text-slate-700"
                        >
                          <p
                            title={item.description}
                            className="col-span-6 truncate overflow-hidden"
                          >
                            {item.description}
                          </p>
                          <p className="col-span-2 justify-self-end">
                            {item.amount?.toFixed(2) ?? "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-row-1 justify-items-end">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 text-end">
                      Total Amount Due
                    </h3>
                    <p className="text-slate-700 text-lg leading-snug text-end">
                      <span>{mapCurrency(invoice.currency ?? "")} </span>
                      {invoice.totalAmountDue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <SheetInvoiceEditor
                invoice={invoice}
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
                        setUrl(await getObjectUrl(invoice.extractionId));
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
                      <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure? This will permanently delete the current
                        invoice and remove its associated file and extraction.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          setUrl(null);
                          await deleteExtraction(invoice.extractionId);
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
