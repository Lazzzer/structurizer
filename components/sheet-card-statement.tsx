"use client";

import { CardStatement, CardTransaction } from "@prisma/client";
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
import { mapCurrency } from "@/lib/utils";
import { deleteExtraction, getObjectUrl } from "@/lib/client-requests";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SheetError } from "./sheet-error";
import { SheetCardStatementEditor } from "./sheet-card-statement-editor";
import { SheetSkeleton } from "./sheet-skeleton";

interface SheetCardStatementProps {
  id: string;
  children: React.ReactNode;
}

type CardStatementWithTransactions = CardStatement & {
  transactions: CardTransaction[];
};

async function getCardStatement(id: string) {
  const res = await fetch(`/api/dashboard/card-statements?id=${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Cannot fetch card statement");
  }
  const cardStatement = (await res.json()) as CardStatementWithTransactions;
  return cardStatement;
}

export function SheetCardStatement({ id, children }: SheetCardStatementProps) {
  const [cardStatement, setCardStatement] =
    useState<CardStatementWithTransactions | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [hasGetFailed, setHasGetFailed] = useState(false);

  useEffect(() => {
    async function get() {
      try {
        setCardStatement(await getCardStatement(id));
      } catch (e) {
        setHasGetFailed(true);
      }
    }
    if (!isEditing) {
      get();
    }
  }, [isEditing, id]);

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          setUrl(null);
        }
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[512px]">
        {hasGetFailed && <SheetError />}
        {cardStatement ? (
          <div className="h-full w-full my-4 relative">
            <h1 className="text-2xl font-bold">Card Statement</h1>
            {!isEditing ? (
              <div className="w-full">
                <div className="mt-10 flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Credit Card
                    </h2>
                    <p className="text-slate-700">
                      {cardStatement.creditCardNumber ?? "Unknown Number"}
                    </p>
                    <p className="text-slate-700 -mt-1">
                      {cardStatement.creditCardName ?? "Unknown Name"}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {cardStatement.creditCardHolder ?? "Unknown Holder"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Date
                    </h3>
                    <p className="text-slate-700 leading-snug">
                      <span>
                        {new Date(cardStatement.date).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg text-slate-900">
                    Issuer
                  </h3>
                  <p className="text-slate-700 text-sm leading-snug">
                    {cardStatement.issuerName}
                  </p>
                  <p className="text-slate-500 text-xs leading-snug">
                    {cardStatement.issuerAddress ?? "Unknown Address"}
                  </p>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg text-slate-900">
                    Recipient
                  </h3>
                  <p className="text-slate-700 text-sm leading-snug">
                    {cardStatement?.recipientName ?? "Unknown Name"}
                  </p>
                  <p className="text-slate-500 text-xs leading-snug">
                    {cardStatement.recipientAddress ?? "Unknown Address"}
                  </p>
                </div>
                <div className="mt-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Items
                    </h2>
                    <div className="mt-2 mb-1 grid grid-cols-8 font-medium">
                      <h4 className="text-slate-800 col-span-4">Description</h4>
                      <h4 className="text-slate-800 col-span-2 justify-self-end">
                        Category
                      </h4>
                      <h4 className="text-slate-800 col-span-2 justify-self-end">
                        Amount
                      </h4>
                    </div>
                    <div className="h-full max-h-52 2xl:max-h-96 overflow-scroll">
                      {cardStatement.transactions.map((item) => (
                        <div
                          key={item.id}
                          className="mt-1 grid grid-cols-8 text-sm text-slate-700"
                        >
                          <p
                            title={item.description}
                            className="col-span-4 truncate overflow-hidden"
                          >
                            {item.description ?? "N/A"}
                          </p>
                          <p className="col-span-2 justify-self-end">
                            {item.category.charAt(0).toUpperCase() +
                              item.category.slice(1)}
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
                      <span>{mapCurrency(cardStatement.currency ?? "")} </span>
                      {cardStatement.totalAmountDue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <SheetCardStatementEditor
                cardStatement={cardStatement}
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
                        setUrl(await getObjectUrl(cardStatement.extractionId));
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
                      <AlertDialogTitle>Delete Card Statement</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure? This will permanently delete the current
                        card statement and remove its associated file and
                        extraction. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          setUrl(null);
                          await deleteExtraction(cardStatement.extractionId);
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
