"use client";

import { Invoice, InvoiceItem } from "@prisma/client";
import { useEffect, useState } from "react";
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
import { deleteExtraction, updateInvoice } from "@/lib/client-requests";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { categories } from "@/app/(dashboard)/(structured-data)/invoices/columns";
import { mapCurrency } from "@/lib/utils";
import { EditInvoiceViewer } from "@/app/(dashboard)/(structured-data)/invoices/edit-invoice-viewer";

type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export function SheetInvoice({ uuid }: { uuid: string }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfDisplayed, setIsPdfDisplayed] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [editedInvoice, setEditedInvoice] = useState<InvoiceWithItems | null>(
    null
  );

  async function fetchInvoice(uuid: string) {
    const res = await fetch(`/api/invoices?uuid=${uuid}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("No invoice found");
    }
    const invoice = await res.json();
    invoice.date = invoice?.date
      ? new Date(invoice.date).toISOString().split("T")[0]
      : null;
    return invoice;
  }

  useEffect(() => {
    const fetch = async () => {
      const invoice = await fetchInvoice(uuid);
      setInvoice(invoice);
      setEditedInvoice(invoice);
    };

    console.log("fetching");

    fetch();
  }, []);

  return (
    <div className="h-full w-full my-4 relative">
      <h1 className="text-2xl font-bold">Invoice</h1>
      {!isEditing && invoice && (
        <div className="w-full">
          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Category</h2>
            <p className="text-slate-700 text-end">
              {categories.find((c: any) => c.value === invoice.category)?.label}
            </p>
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Date</h3>
              <p className="text-slate-700 text-sm leading-snug">
                <span>{invoice.date as unknown as string}</span>
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
            <h3 className="font-semibold text-lg text-slate-900">Issuer</h3>
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
            <h3 className="font-semibold text-lg text-slate-900">Recipient</h3>
            <p className="text-slate-700 text-sm leading-snug">
              {invoice?.toName || "Unknown"}
            </p>
            {invoice?.toAddress && (
              <p className="text-slate-500 text-xs leading-snug">
                {invoice.toAddress}
              </p>
            )}
          </div>
          <div className="mt-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
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
                      {item.description ?? "N/A"}
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
      )}
      {isEditing && invoice && (
        <div className="w-full h-full">
          <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
            <EditInvoiceViewer
              editInvoice={editedInvoice!}
              setEditInvoice={setEditedInvoice}
            />
          </div>
          <div className="mt-2 flex gap-2 justify-end">
            <Button
              variant={"secondary"}
              className="w-20"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-40"
              disabled={isUpdating}
              onClick={async () => {
                setIsUpdating(true);
                await updateInvoice(editedInvoice);
                const newInvoice = await fetchInvoice(uuid);
                setInvoice(newInvoice);
                setEditedInvoice(newInvoice);
                setIsEditing(false);
                setIsUpdating(false);
                router.refresh();
                router.push("/invoices");
              }}
            >
              {isUpdating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </div>
        </div>
      )}
      <div className="w-full flex gap-2 items-center justify-between absolute bottom-2 right-0">
        <div className="flex items-center gap-1">
          <Switch
            id="display-pdf"
            onCheckedChange={async () => {
              if (!isPdfDisplayed) {
                const res = await fetch(
                  `/api/signed-url?uuid=${invoice?.extractionId}`,
                  {
                    method: "GET",
                  }
                );
                const { url } = await res.json();
                console.log(url);
                setPdfUrl(url);
              }
              setIsPdfDisplayed((isPdfDisplayed) => !isPdfDisplayed);
            }}
            checked={isPdfDisplayed}
          />
          <Label htmlFor="bulk-processing">Display PDF</Label>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This will permanently delete the current invoice
                  and remove its associated file and extraction. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setIsPdfDisplayed(false);
                    await deleteExtraction(invoice!.extractionId);
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
            <Button
              className="w-20"
              onClick={() => {
                setEditedInvoice(invoice);
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      {isPdfDisplayed && pdfUrl !== null && (
        <object
          data={`${pdfUrl}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
          type="application/pdf"
          style={{ width: "calc(100vw - 512px)", marginRight: "488px" }}
          className="h-screen absolute -top-10 right-0"
        />
      )}
    </div>
  );
}
