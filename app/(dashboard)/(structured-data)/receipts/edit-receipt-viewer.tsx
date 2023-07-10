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
import { receiptsSchema } from "@/lib/data-categories";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { updateStructuredData } from "@/lib/client-requests";
import { Receipt } from "@prisma/client";
import { useRouter } from "next/navigation";
interface EditReceiptViewerProps {
  receipt: ReceiptWithItems;
  setIsEditing: (isEditing: boolean) => void;
}

type ReceiptItem = {
  id: string;
  description: string;
  quantity: number;
  amount: number;
};

type ReceiptWithItems = Receipt & {
  items: ReceiptItem[];
};

export function EditReceiptViewer({
  receipt,
  setIsEditing,
}: EditReceiptViewerProps): React.JSX.Element {
  const [editedReceipt, setEditedReceipt] = useState<ReceiptWithItems>({
    ...receipt,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [areItemsOpen, setAreItemsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  return (
    <div className="w-full h-full">
      <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
        <div className="w-full min-h-full h-20 p-2 overflow-scroll">
          <div className=" grid grid-rows-4 gap-2.5">
            {/* From */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="from"
                >
                  From
                </Label>
              </div>
              <Input
                id="from"
                placeholder="null"
                type="text"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    from: e.target.value,
                  });
                }}
                value={editedReceipt.from}
              />
            </div>
            {/* Category */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="category"
                >
                  Category
                </Label>
              </div>
              <Select
                name="category"
                onValueChange={(value) => {
                  setEditedReceipt({ ...editedReceipt, category: value });
                }}
                defaultValue={editedReceipt.category}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {receiptsSchema.properties.category.enum.map(
                    (category: string) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Number */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="number"
                >
                  Number <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="number"
                placeholder="null"
                type="text"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    number: e.target.value,
                  });
                }}
                value={editedReceipt.number ?? ""}
              />
            </div>
            {/* Date & Time */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="date"
                >
                  Date
                </Label>
                <span className="font-semibold text-slate-800 self-center text-base">
                  /
                </span>
                <Label
                  className="font-semibold text-base self-center"
                  htmlFor="time"
                >
                  Time <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <div className="flex gap-1.5">
                <Input
                  id="date"
                  type="date"
                  placeholder="null"
                  className="w-3/5 h-8"
                  onChange={(e) => {
                    setEditedReceipt({
                      ...editedReceipt,
                      date: e.target.valueAsDate ?? new Date(),
                    });
                  }}
                  value={
                    new Date(editedReceipt.date).toISOString().split("T")[0]
                  }
                />
                <Input
                  id="time"
                  type="string"
                  placeholder="null"
                  className="w-2/5 h-8"
                  onChange={(e) => {
                    setEditedReceipt({
                      ...editedReceipt,
                      time: e.target.value,
                    });
                  }}
                  value={editedReceipt.time ?? ""}
                />
              </div>
            </div>
          </div>
          {/* Items */}
          <div className="my-4">
            <Collapsible open={areItemsOpen} onOpenChange={setAreItemsOpen}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center text-slate-900">
                  Items
                  <Icons.brackets
                    strokeWidth={3}
                    className="h-4 w-4 ml-1 inline-block"
                  />
                  <Button
                    onClick={() => {
                      setEditedReceipt({
                        ...editedReceipt,
                        items: [
                          ...editedReceipt.items,
                          {
                            id: window.crypto.randomUUID(),
                            description: "",
                            quantity: 0,
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
                    {editedReceipt.items.map((item: ReceiptItem) => (
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
                        className=" rounded-md border border-slate-200 px-4 py-3"
                      >
                        <Label htmlFor={`item-${item.id}-description`}>
                          Description
                        </Label>
                        <Input
                          type="text"
                          placeholder="null"
                          id={`item-${item.id}}-description`}
                          className="w-full h-8"
                          onChange={(e) => {
                            setEditedReceipt((prevReceipt) => ({
                              ...prevReceipt,
                              items: prevReceipt.items.map((i) =>
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
                            <div className="w-1/2">
                              <Label htmlFor={`item-${item.id}}-quantity`}>
                                Quantity
                              </Label>
                              <Input
                                id={`item-${item.id}}-quantity`}
                                placeholder="null"
                                type="number"
                                className="w-full h-8"
                                onChange={(e) => {
                                  setEditedReceipt((prevReceipt) => ({
                                    ...prevReceipt,
                                    items: prevReceipt.items.map((i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            quantity: parseFloat(
                                              e.target.value
                                            ),
                                          }
                                        : i
                                    ),
                                  }));
                                }}
                                value={item.quantity}
                              />
                            </div>
                            <div className="w-1/2">
                              <Label htmlFor={`item-${item.id}}-amount`}>
                                Amount
                              </Label>
                              <Input
                                id={`item-${item.id}}-amount`}
                                placeholder="null"
                                type="number"
                                className="w-full h-8"
                                onChange={(e) => {
                                  setEditedReceipt((prevReceipt) => ({
                                    ...prevReceipt,
                                    items: prevReceipt.items.map((i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            amount: parseFloat(e.target.value),
                                          }
                                        : i
                                    ),
                                  }));
                                }}
                                value={item.amount}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 p-0 self-end"
                            onClick={() => {
                              setEditedReceipt((prevReceipt) => ({
                                ...prevReceipt,
                                items: prevReceipt.items.filter(
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
          <div className=" grid grid-rows-4 gap-2.5">
            {/* Subtotal */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className={cn("font-semibold text-base self-center")}
                  htmlFor="subtotal"
                >
                  Subtotal{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="subtotal"
                placeholder="null"
                type="number"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    subtotal: parseFloat(e.target.value),
                  });
                }}
                value={editedReceipt.subtotal ?? ""}
              />
            </div>
            {/* Tax */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className={cn("font-semibold text-base self-center")}
                  htmlFor="tax"
                >
                  Tax <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="tax"
                placeholder="null"
                type="number"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    tax: parseFloat(e.target.value),
                  });
                }}
                value={editedReceipt.tax ?? ""}
              />
            </div>
            {/* Tip */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className={cn("font-semibold text-base self-center")}
                  htmlFor="tip"
                >
                  Tip <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="tip"
                placeholder="null"
                type="number"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    tip: parseFloat(e.target.value),
                  });
                }}
                value={editedReceipt.tip ?? ""}
              />
            </div>
            {/* Total */}
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-1">
                <Label
                  className={cn("font-semibold text-base self-center")}
                  htmlFor="total"
                >
                  Total
                </Label>
              </div>
              <Input
                id="total"
                placeholder="null"
                type="number"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedReceipt({
                    ...editedReceipt,
                    total: parseFloat(e.target.value),
                  });
                }}
                value={editedReceipt.total ?? ""}
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
                updateStructuredData<ReceiptWithItems>(
                  editedReceipt,
                  "receipts"
                ),
                500
              );
              setIsEditing(false);
            } catch (e: any) {
              setErrorMessage(e.message);
            }
            setIsLoading(false);
            router.refresh();
          }}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </div>
    </div>
  );
}
