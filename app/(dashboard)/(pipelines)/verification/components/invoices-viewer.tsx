"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { invoicesSchema } from "@/lib/llm/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { CorrectionTooltip } from "@/components/ui/correction-tooltip";

export function InvoicesViewer({
  verifiedInvoice,
  setVerifiedInvoice,
  corrections,
}: {
  verifiedInvoice: any;
  setVerifiedInvoice: (receipt: any) => void;
  corrections: Map<any, any>;
}) {
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  return (
    <div className="w-full min-h-full h-20 p-2 overflow-scroll">
      <div className=" grid grid-rows-3 gap-2.5">
        {/* Invoice number */}
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("invoice_number")
                ? "text-red-500"
                : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold text-base self-center"
              htmlFor="from"
            >
              Invoice Number
            </Label>
            {corrections.has("invoice_number") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("invoice_number")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            id="invoice_number"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                invoice_number: e.target.value,
              });
            }}
            value={verifiedInvoice.invoice_number}
          />
        </div>
        {/* Category */}
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("category") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold text-base self-center"
              htmlFor="category"
            >
              Category
            </Label>
            {corrections.has("category") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("category")}
              ></CorrectionTooltip>
            )}
          </div>
          <Select
            onValueChange={(value) => {
              setVerifiedInvoice({ ...verifiedInvoice, category: value });
            }}
            defaultValue={verifiedInvoice.category}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {invoicesSchema.properties.category.enum.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Date */}
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("date") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold text-base self-center"
              htmlFor="from"
            >
              Date
            </Label>
            {corrections.has("date") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("date")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            id="date"
            placeholder="null"
            type="date"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({ ...verifiedInvoice, date: e.target.value });
            }}
            value={verifiedInvoice.date}
          />
        </div>
      </div>
      {/* From */}
      <div>
        <h4
          className={cn(
            corrections.has("from") ? "text-red-500" : "text-slate-800",
            "font-semibold flex items-center mt-3 mb-2.5"
          )}
        >
          From
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
          {corrections.has("from") && (
            <CorrectionTooltip
              classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
              classNameContent="w-80 font-normal"
              correction={corrections.get("from")}
            ></CorrectionTooltip>
          )}
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("from.name")
                  ? "text-red-500"
                  : "text-slate-800",
                "-mt-0.5"
              )}
              htmlFor="from-name"
            >
              Name
            </Label>
            {corrections.has("from.name") && (
              <CorrectionTooltip
                classNameTrigger="h-4 w-4 p-0 -mt-0.5  text-red-500 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80 font-normal"
                correction={corrections.get("from.name")}
              ></CorrectionTooltip>
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="from-name"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                from: { ...verifiedInvoice.from, name: e.target.value },
              });
            }}
            value={verifiedInvoice.from?.name}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("from.address")
                  ? "text-red-500"
                  : "text-slate-800"
              )}
              htmlFor="from-address"
            >
              Address
            </Label>
            {corrections.has("from.address") && (
              <CorrectionTooltip
                classNameTrigger="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80 font-normal"
                correction={corrections.get("from.address")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            type="text"
            placeholder="null"
            id="from-address"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                from: { ...verifiedInvoice.from, address: e.target.value },
              });
            }}
            value={verifiedInvoice.from?.address}
          />
        </div>
      </div>
      {/* To */}
      <div>
        <h4
          className={cn(
            corrections.has("to") ? "text-red-500" : "text-slate-800",
            "font-semibold flex items-center mt-3 mb-2.5"
          )}
        >
          To
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
          {corrections.has("to") && (
            <CorrectionTooltip
              classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
              classNameContent="w-80 font-normal"
              correction={corrections.get("to")}
            ></CorrectionTooltip>
          )}
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("to.name") ? "text-red-500" : "text-slate-800"
              )}
              htmlFor="to-name"
            >
              Name
            </Label>
            {corrections.has("to.name") && (
              <CorrectionTooltip
                classNameTrigger="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80 font-normal"
                correction={corrections.get("to.name")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            type="text"
            placeholder="null"
            id="to-name"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                to: { ...verifiedInvoice.to, name: e.target.value },
              });
            }}
            value={verifiedInvoice.to?.name}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("to.address")
                  ? "text-red-500"
                  : "text-slate-800"
              )}
              htmlFor="to-address"
            >
              Address
            </Label>
            {corrections.has("to.address") && (
              <CorrectionTooltip
                classNameTrigger="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80 font-normal"
                correction={corrections.get("to.address")}
              ></CorrectionTooltip>
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="to-address"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                to: { ...verifiedInvoice.to, address: e.target.value },
              });
            }}
            value={verifiedInvoice.to?.address}
          />
        </div>
      </div>
      {/* Items */}
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                corrections.has("items") ? "text-red-500" : "text-slate-800",
                "font-semibold flex items-center"
              )}
            >
              Items
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
              {corrections.has("items") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80 font-normal"
                  correction={corrections.get("items")}
                ></CorrectionTooltip>
              )}
              <Button
                onClick={() => {
                  setVerifiedInvoice({
                    ...verifiedInvoice,
                    items: [
                      ...verifiedInvoice.items,
                      {
                        description: "",
                        amount: "",
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
                {verifiedInvoice.items.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      transition: { duration: 0.2 },
                    }}
                    layoutId={`item-${index}`}
                    className="rounded-md border border-slate-200 px-4 py-3"
                  >
                    <Label htmlFor={`item-${index}-description`}>
                      Description
                    </Label>
                    <Input
                      type="text"
                      placeholder="null"
                      id={`item-${index}-description`}
                      className="w-full h-8"
                      onChange={(e) => {
                        const newItems = [...verifiedInvoice.items];
                        newItems[index].description = e.target.value;
                        setVerifiedInvoice({
                          ...verifiedInvoice,
                          items: newItems,
                        });
                      }}
                      value={item.description}
                    />
                    <div className="flex w-full mt-2 justify-between">
                      <div className="w-1/2 flex gap-1.5">
                        <div className="w-full">
                          <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                          <Input
                            id={`item-${index}-amount`}
                            placeholder="null"
                            type="number"
                            className="w-full h-8"
                            onChange={(e) => {
                              const newItems = [...verifiedInvoice.items];
                              newItems[index].amount = e.target.value;
                              setVerifiedInvoice({
                                ...verifiedInvoice,
                                items: newItems,
                              });
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
                          const newItems = [...verifiedInvoice.items];
                          newItems.splice(index, 1);
                          setVerifiedInvoice({
                            ...verifiedInvoice,
                            items: newItems,
                          });
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
          <div
            className={cn(
              corrections.has("currency") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold text-base self-center"
              htmlFor="currency"
            >
              Currency
            </Label>
            {corrections.has("currency") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("currency")}
              ></CorrectionTooltip>
            )}
          </div>

          <Input
            id="currency"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                currency: e.target.value,
              });
            }}
            value={verifiedInvoice.currency}
          />
        </div>
        {/* Total Amount Due */}
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("total_amount_due")
                ? "text-red-500"
                : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold text-base self-center"
              htmlFor="total_amount_due"
            >
              Total Amount Due
            </Label>
            {corrections.has("total_amount_due") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("total_amount_due")}
              ></CorrectionTooltip>
            )}
          </div>

          <Input
            id="total_amount_due"
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                total_amount_due: e.target.value,
              });
            }}
            value={verifiedInvoice.total_amount_due}
          />
        </div>
      </div>
    </div>
  );
}
