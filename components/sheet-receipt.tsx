"use client";

import { categories } from "@/app/(dashboard)/(structured-data)/receipts/columns";
import { Receipt, ReceiptItem } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ReceiptsViewer } from "./receipts-viewer";

type ReceiptWithItems = Receipt & {
  items: ReceiptItem[];
};

export function SheetReceipt({ uuid }: { uuid: string }) {
  const [receipt, setReceipt] = useState<ReceiptWithItems | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchReceipt(uuid: string) {
    const res = await fetch(`/api/receipts?uuid=${uuid}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("No receipt found");
    }
    const receipt = await res.json();
    return receipt;
  }

  useEffect(() => {
    const fetch = async () => {
      const receipt = await fetchReceipt(uuid);
      setReceipt(receipt);
    };

    console.log("fetching");

    fetch();
  }, []);

  const date = receipt?.date ? new Date(receipt.date) : null;
  return (
    <div className="h-full w-full my-4 relative">
      <h1 className="text-2xl font-bold">Receipt</h1>
      {!isEditing && receipt && (
        <div className="w-full ">
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
                <span>
                  {date?.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
              <div className="mt-2 mb-1 grid grid-cols-8 font-medium">
                <h4 className="col-span-4">Description</h4>
                <h4 className="col-span-2 justify-self-end">Quantity</h4>
                <h4 className="col-span-2 justify-self-end">Amount</h4>
              </div>
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
                  <p className="col-span-2 justify-self-end">{item.quantity}</p>
                  <p className="col-span-2 justify-self-end">
                    {item.amount.toFixed(2)}
                  </p>
                </div>
              ))}
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
          <div className="w-full flex gap-2 items-center justify-between absolute bottom-2 right-0">
            <div className="flex items-center gap-1">
              <Switch
                id="display-pdf"
                // onCheckedChange={() =>
                //   setBulkProcessing((previousState) => !previousState)
                // }
                // checked={isBulkProcessing}
              />
              <Label htmlFor="bulk-processing">Display PDF</Label>
            </div>

            <div className="flex gap-2">
              <Button variant={"destructive"} className="w-20">
                Delete
              </Button>
              <Button className="w-20" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
      {isEditing && receipt && (
        <div className="w-full h-full">
          <ReceiptsViewer
            verifiedReceipt={receipt}
            setVerifiedReceipt={setReceipt}
            corrections={new Map()}
          />
        </div>
      )}
    </div>
  );
}
