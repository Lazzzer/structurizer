"use client";

import { categories } from "@/app/(dashboard)/(structured-data)/receipts/columns";
import { Receipt, ReceiptItem } from "@prisma/client";
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
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { ReceiptsViewer } from "@/app/(dashboard)/(pipelines)/verification/components/receipts-viewer";
import { deleteExtraction, updateStructuredData } from "@/lib/client-requests";

type ReceiptWithItems = Receipt & {
  items: ReceiptItem[];
};

export function SheetReceipt({ uuid }: { uuid: string }) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<ReceiptWithItems | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfDisplayed, setIsPdfDisplayed] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [editedReceipt, setEditedReceipt] = useState<ReceiptWithItems | null>(
    null
  );

  async function fetchReceipt(uuid: string) {
    const res = await fetch(`/api/dashboard/receipts?uuid=${uuid}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("No receipt found");
    }
    const receipt = await res.json();
    receipt.date = receipt?.date
      ? new Date(receipt.date).toISOString().split("T")[0]
      : null;
    return receipt;
  }

  useEffect(() => {
    const fetch = async () => {
      const receipt = await fetchReceipt(uuid);
      setReceipt(receipt);
      setEditedReceipt(receipt);
    };

    console.log("fetching");

    fetch();
  }, []);

  return (
    <div className="h-full w-full my-4 relative">
      <h1 className="text-2xl font-bold">Receipt</h1>
      {!isEditing && receipt && (
        <div className="w-full">
          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Category</h2>
            <p className="text-slate-700 text-end">
              {categories.find((c: any) => c.value === receipt.category)?.label}
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">From</h3>
              <p className="text-slate-700 text-sm leading-snug">
                {receipt.from}
              </p>
            </div>
            {receipt.number !== null && (
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
                <span>{receipt.time !== null ? `${receipt.time} - ` : ""}</span>
                <span>{receipt.date as unknown as string}</span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
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
            {receipt.subtotal !== null && (
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Subtotal</h3>
                <p className="text-slate-700 text-sm text-end">
                  {receipt.subtotal.toFixed(2)}
                </p>
              </div>
            )}
            {receipt.tax !== null && (
              <div className="flex justify-between items-center mt-2">
                <h3 className="font-semibold text-slate-900">Tax</h3>
                <p className="text-slate-700 text-sm text-end">
                  {receipt.tax.toFixed(2)}
                </p>
              </div>
            )}
            {receipt.tip !== null && (
              <div className="flex justify-between items-center mt-2">
                <h3 className="font-semibold text-slate-900">Tip</h3>
                <p className="text-slate-700 text-sm text-end">
                  {receipt.tip === 0 ? "No Tip" : receipt.tip.toFixed(2)}
                </p>
              </div>
            )}
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
      )}
      {isEditing && receipt && (
        <div className="w-full h-full">
          <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
            <ReceiptsViewer
              verifiedReceipt={editedReceipt}
              setVerifiedReceipt={setEditedReceipt}
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
                await updateStructuredData(editedReceipt, "receipts");
                const newReceipt = await fetchReceipt(uuid);
                setReceipt(newReceipt);
                setEditedReceipt(newReceipt);
                setIsEditing(false);
                setIsUpdating(false);
                router.refresh();
                router.push("/receipts");
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
                  `/api/signed-url?uuid=${receipt?.extractionId}`,
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
                    setIsPdfDisplayed(false);
                    await deleteExtraction(receipt!.extractionId);
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
                setEditedReceipt(receipt);
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
