import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { receiptsSchema } from "@/lib/llm/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { AnimatePresence, motion } from "framer-motion";

function ReceiptsViewer({ receipt }: { receipt: any }) {
  const [verifiedReceipt, setVerifiedReceipt] = useState(receipt);
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  return (
    <div className="w-full min-h-full h-20 p-2 overflow-scroll">
      <div className=" grid grid-rows-4 gap-2.5">
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="from"
          >
            From
          </Label>
          <Input
            id="from"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({ ...verifiedReceipt, from: e.target.value });
            }}
            value={verifiedReceipt.from}
          />
        </div>
        <div className="grid grid-cols-2">
          <Label className="font-semibold font-slate-800 self-center text-base">
            Category
          </Label>
          <Select
            onValueChange={(value) => {
              setVerifiedReceipt({ ...verifiedReceipt, category: value });
            }}
            defaultValue={verifiedReceipt.category}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {receiptsSchema.properties.category.enum.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="number"
          >
            Number
          </Label>
          <Input
            id="number"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({
                ...verifiedReceipt,
                number: e.target.value,
              });
            }}
            value={verifiedReceipt.number}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="flex gap-1">
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="date"
            >
              Date
            </Label>
            <span className="font-semibold font-slate-800 mx-1 self-center text-base">
              /
            </span>
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="time"
            >
              Time
            </Label>
          </div>

          <div className="flex gap-1.5">
            <Input
              id="date"
              type="date"
              placeholder="null"
              className="w-3/5 h-8"
              onChange={(e) => {
                setVerifiedReceipt({
                  ...verifiedReceipt,
                  date: e.target.value,
                });
              }}
              value={verifiedReceipt.date}
            />
            <Input
              id="time"
              placeholder="null"
              className="w-2/5 h-8"
              onChange={(e) => {
                setVerifiedReceipt({
                  ...verifiedReceipt,
                  date: e.target.value,
                });
              }}
              value={verifiedReceipt.time}
            />
          </div>
        </div>
      </div>
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-slate-800">
              Items
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 inline-block"
              />
              <Button
                onClick={() => {
                  setVerifiedReceipt({
                    ...verifiedReceipt,
                    items: [
                      ...verifiedReceipt.items,
                      {
                        description: "",
                        quantity: "",
                        amount: "",
                      },
                    ],
                  });
                }}
                variant="ghost"
                className="h-8 ml-2"
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
                {verifiedReceipt.items.map((item: any, index: number) => (
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
                    className=" rounded-md border border-slate-200 px-4 py-3"
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
                        const newItems = [...verifiedReceipt.items];
                        newItems[index].description = e.target.value;
                        setVerifiedReceipt({
                          ...verifiedReceipt,
                          items: newItems,
                        });
                      }}
                      value={item.description}
                    />
                    <div className="flex w-full mt-2 justify-between">
                      <div className="w-1/2 flex gap-1.5">
                        <div className="w-1/2">
                          <Label htmlFor={`item-${index}-quantity`}>
                            Quantity
                          </Label>
                          <Input
                            id={`item-${index}-quantity`}
                            placeholder="null"
                            type="number"
                            className="w-full h-8"
                            onChange={(e) => {
                              const newItems = [...verifiedReceipt.items];
                              newItems[index].quantity = e.target.value;
                              setVerifiedReceipt({
                                ...verifiedReceipt,
                                items: newItems,
                              });
                            }}
                            value={item.quantity}
                          />
                        </div>
                        <div className="w-1/2">
                          <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                          <Input
                            id={`item-${index}-amount`}
                            placeholder="null"
                            type="number"
                            className="w-full h-8"
                            onChange={(e) => {
                              const newItems = [...verifiedReceipt.items];
                              newItems[index].amount = e.target.value;
                              setVerifiedReceipt({
                                ...verifiedReceipt,
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
                          const newItems = [...verifiedReceipt.items];
                          newItems.splice(index, 1);
                          setVerifiedReceipt({
                            ...verifiedReceipt,
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
      <div className=" grid grid-rows-4 gap-2.5">
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="subtotal"
          >
            Subtotal
          </Label>
          <Input
            id="subtotal"
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({
                ...verifiedReceipt,
                subtotal: e.target.value,
              });
            }}
            value={verifiedReceipt.subtotal}
          />
        </div>
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="tax"
          >
            Tax
          </Label>
          <Input
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({
                ...verifiedReceipt,
                tax: e.target.value,
              });
            }}
            value={verifiedReceipt.tax}
          />
        </div>
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="tip"
          >
            Tip
          </Label>
          <Input
            id="tip"
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({
                ...verifiedReceipt,
                tip: e.target.value,
              });
            }}
            value={verifiedReceipt.tip}
          />
        </div>
        <div className="grid grid-cols-2">
          <Label
            className="font-semibold font-slate-800 self-center text-base"
            htmlFor="total"
          >
            Total
          </Label>
          <Input
            id="total"
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedReceipt({
                ...verifiedReceipt,
                total: e.target.value,
              });
            }}
            value={verifiedReceipt.total}
          />
        </div>
      </div>
    </div>
  );
}

export function ObjectViewer({
  className,
  category,
  jsonStr,
}: {
  className?: string;
  category: string;
  jsonStr: string;
}) {
  console.log(category);
  return (
    <ScrollArea className={cn(className, "w-full h-full")}>
      {category === "receipts" && (
        <ReceiptsViewer receipt={JSON.parse(jsonStr)} />
      )}
    </ScrollArea>
  );
}
