"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, minDelay } from "@/lib/utils";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { invoicesSchema } from "@/lib/data-categories";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { updateStructuredData } from "@/lib/client-requests";
import { Invoice } from "@prisma/client";

interface SheetInvoiceEditorProps {
  invoice: InvoiceWithItems;
  setIsEditing: (isEditing: boolean) => void;
}

type InvoiceItem = {
  id: string;
  description: string;
  amount: number | null;
};

type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export function SheetInvoiceEditor({
  invoice,
  setIsEditing,
}: SheetInvoiceEditorProps): React.JSX.Element {
  const [editedInvoice, setEditedInvoice] = useState<InvoiceWithItems>({
    ...invoice,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [areItemsOpen, setAreItemsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="w-full h-full">
      <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
        <div className="w-full min-h-full h-20 p-2 overflow-scroll">
          <div className=" grid grid-rows-3 gap-2.5">
            {/* Invoice number */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1 text-slate-800">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="invoiceNumber"
                >
                  Invoice Number{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="invoiceNumber"
                placeholder="null"
                type="text"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    invoiceNumber: e.target.value,
                  });
                }}
                value={editedInvoice.invoiceNumber ?? ""}
              />
            </div>
            {/* Category */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1 text-slate-800">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="category"
                >
                  Category
                </Label>
              </div>
              <Select
                onValueChange={(value) => {
                  setEditedInvoice({ ...editedInvoice, category: value });
                }}
                defaultValue={editedInvoice.category}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {invoicesSchema.properties.category.enum.map(
                    (category: any) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Date */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1 text-slate-800">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="date"
                >
                  Date
                </Label>
              </div>
              <Input
                id="date"
                placeholder="null"
                type="date"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    date: e.target.valueAsDate ?? new Date(),
                  });
                }}
                value={new Date(editedInvoice.date).toISOString().split("T")[0]}
              />
            </div>
          </div>
          {/* From */}
          <div>
            <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
              From
              <Icons.braces
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
            </h4>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1 mb-1">
                <Label className="-mt-0.5 text-slate-800" htmlFor="fromName">
                  Name
                </Label>
              </div>
              <Input
                type="text"
                placeholder="null"
                id="fromName"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    fromName: e.target.value,
                  });
                }}
                value={editedInvoice.fromName}
              />
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="fromAddress">
                  Address{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                type="text"
                placeholder="null"
                id="fromAddress"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    fromAddress: e.target.value,
                  });
                }}
                value={editedInvoice.fromAddress ?? ""}
              />
            </div>
          </div>
          {/* To */}
          <div>
            <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
              To
              <Icons.braces
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
            </h4>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="toName">
                  Name <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                type="text"
                placeholder="null"
                id="toName"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    toName: e.target.value,
                  });
                }}
                value={editedInvoice.toName ?? ""}
              />
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="toAddress">
                  Address{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                type="text"
                placeholder="null"
                id="toAddress"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    toAddress: e.target.value,
                  });
                }}
                value={editedInvoice.toAddress ?? ""}
              />
            </div>
          </div>
          {/* Items */}
          <div className="my-4">
            <Collapsible open={areItemsOpen} onOpenChange={setAreItemsOpen}>
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    "font-semibold flex items-center text-slate-800"
                  )}
                >
                  Items
                  <Icons.brackets
                    strokeWidth={3}
                    className="h-4 w-4 ml-1 inline-block"
                  />
                  <Button
                    onClick={() => {
                      setEditedInvoice({
                        ...editedInvoice,
                        items: [
                          ...editedInvoice.items,
                          {
                            id: window.crypto.randomUUID(),
                            description: "",
                            amount: 0,
                          },
                        ],
                      });
                    }}
                    variant="ghost"
                    className="h-8 ml-2 text-slate-800"
                  >
                    <Icons.plusCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs">Add Item</span>
                  </Button>
                </h4>
                <CollapsibleTrigger asChild>
                  <div>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <Icons.chevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-1.5">
                <motion.div layout className="w-full space-y-2">
                  <AnimatePresence>
                    {editedInvoice.items.map((item: InvoiceItem) => (
                      <motion.div
                        layout="size"
                        key={item.id}
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.3 },
                        }}
                        layoutId={item.id}
                        className="rounded-md border border-slate-200 px-4 py-3"
                      >
                        <Label htmlFor={`item-${item.id}-description`}>
                          Description
                        </Label>
                        <Input
                          type="text"
                          placeholder="null"
                          id={`item-${item.id}-description`}
                          className="w-full h-8"
                          onChange={(e) => {
                            setEditedInvoice((prevInvoice) => ({
                              ...prevInvoice,
                              items: prevInvoice.items.map((i) =>
                                i.id === item.id
                                  ? { ...i, description: e.target.value }
                                  : i
                              ),
                            }));
                          }}
                          value={item.description}
                        />
                        <div className="flex w-full mt-2 justify-between">
                          <div className="w-1/2 flex gap-1.5">
                            <div className="w-full">
                              <Label htmlFor={`item-${item.id}-amount`}>
                                Amount
                              </Label>
                              <Input
                                id={`item-${item.id}-amount`}
                                placeholder="null"
                                type="number"
                                className="w-full h-8"
                                onChange={(e) => {
                                  setEditedInvoice((prevInvoice) => ({
                                    ...prevInvoice,
                                    items: prevInvoice.items.map((i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            amount: parseFloat(e.target.value),
                                          }
                                        : i
                                    ),
                                  }));
                                }}
                                value={item.amount ?? ""}
                              />
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 p-0 self-end"
                            onClick={() => {
                              setEditedInvoice((prevInvoice) => ({
                                ...prevInvoice,
                                items: prevInvoice.items.filter(
                                  (i) => i.id !== item.id
                                ),
                              }));
                            }}
                          >
                            <Icons.trash
                              strokeWidth={2.5}
                              className="h-4 w-4 text-slate-800"
                            />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className=" grid grid-rows-2 gap-2.5">
            {/* Currency */}
            <div className="grid grid-cols-2">
              <div className={cn("flex items-center gap-1 text-slate-800")}>
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="currency"
                >
                  Currency{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="currency"
                placeholder="null"
                type="text"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    currency: e.target.value,
                  });
                }}
                value={editedInvoice.currency ?? ""}
              />
            </div>
            {/* Total Amount Due */}
            <div className="grid grid-cols-2">
              <div className={cn("flex items-center gap-1 text-slate-800")}>
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="totalAmountDue"
                >
                  Total Amount Due
                </Label>
              </div>

              <Input
                id="totalAmountDue"
                placeholder="null"
                type="number"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedInvoice({
                    ...editedInvoice,
                    totalAmountDue: parseFloat(e.target.value),
                  });
                }}
                value={editedInvoice.totalAmountDue}
              />
            </div>
          </div>
        </div>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1 text-end">{errorMessage}</p>
      )}
      <div className="mt-2 flex gap-2 justify-end">
        <Button
          variant={"secondary"}
          className="w-20"
          onClick={() => {
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="w-40"
          disabled={isLoading}
          onClick={async () => {
            setErrorMessage(null);
            setIsLoading(true);
            try {
              await minDelay(
                updateStructuredData<InvoiceWithItems>(
                  editedInvoice,
                  "invoices"
                ),
                500
              );
              setIsEditing(false);
            } catch (e: any) {
              setErrorMessage(e.message);
            }
            setIsLoading(false);
          }}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </div>
    </div>
  );
}
