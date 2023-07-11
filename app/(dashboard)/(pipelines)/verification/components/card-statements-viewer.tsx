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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { CorrectionPopover } from "./correction-popover";
import { Correction } from "types";
import { cardStatementsSchema } from "@/lib/data-categories";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CardStatementsViewerProps {
  verifiedCardStatement: any;
  setVerifiedCardStatement: (receipt: any) => void;
  corrections: Map<string, Correction>;
}

export function CardStatementsViewer({
  verifiedCardStatement,
  setVerifiedCardStatement,
  corrections,
}: CardStatementsViewerProps) {
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  return (
    <div className="w-full min-h-full h-20 p-2 overflow-scroll">
      <div>
        {/* Date */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <Label
              className={cn(
                "font-semibold text-base self-center",
                corrections.has("date") && "text-red-500"
              )}
              htmlFor="date"
            >
              Date
            </Label>
            {corrections.has("date") && (
              <CorrectionPopover correction={corrections.get("date")!} />
            )}
          </div>
          <Input
            id="date"
            placeholder="null"
            type="date"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                date: e.target.value,
              });
            }}
            value={verifiedCardStatement.date}
          />
        </div>
      </div>
      {/* Issuer */}
      <div>
        <h4
          className={cn(
            corrections.has("issuer") ? "text-red-500" : "text-slate-900",
            "font-semibold flex items-center mt-3 mb-2.5"
          )}
        >
          Issuer
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
          {corrections.has("issuer") && (
            <CorrectionPopover correction={corrections.get("issuer")!} />
          )}
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("issuer.name")
                  ? "text-red-500"
                  : "text-slate-900",
                "-mt-0.5"
              )}
              htmlFor="issuer-name"
            >
              Name
            </Label>
            {corrections.has("issuer.name") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 -mt-0.5  text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("issuer.name")!}
              />
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="issuer-name"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                issuer: {
                  ...verifiedCardStatement.issuer,
                  name: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.issuer?.name}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("issuer.address")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="issuer-address"
            >
              Address <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("issuer.address") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("issuer.address")!}
              />
            )}
          </div>
          <Input
            type="text"
            placeholder="null"
            id="issuer-address"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                issuer: {
                  ...verifiedCardStatement.issuer,
                  address: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.issuer?.address}
          />
        </div>
      </div>
      {/* Recipient */}
      <div>
        <h4
          className={cn(
            corrections.has("recipient") ? "text-red-500" : "text-slate-900",
            "font-semibold flex items-center mt-3 mb-2.5"
          )}
        >
          Recipient
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
          {corrections.has("recipient") && (
            <CorrectionPopover correction={corrections.get("recipient")!} />
          )}
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("recipient.name")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="recipient-name"
            >
              Name <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("recipient.name") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("recipient.name")!}
              />
            )}
          </div>
          <Input
            type="text"
            placeholder="null"
            id="recipient-name"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                recipient: {
                  ...verifiedCardStatement.recipient,
                  name: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.recipient?.name}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("recipient.address")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="recipient-address"
            >
              Address <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("recipient.address") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("recipient.address")!}
              />
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="recipient-address"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                recipient: {
                  ...verifiedCardStatement.recipient,
                  address: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.recipient?.address}
          />
        </div>
      </div>
      {/* Credit card */}
      <div>
        <h4
          className={cn(
            corrections.has("credit_card") ? "text-red-500" : "text-slate-900",
            "font-semibold flex items-center mt-3 mb-2.5"
          )}
        >
          Credit Card
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
          {corrections.has("credit_card") && (
            <CorrectionPopover correction={corrections.get("credit_card")!} />
          )}
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("credit_card.name")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="credit_card-name"
            >
              Name <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("credit_card.name") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("credit_card.name")!}
              />
            )}
          </div>
          <Input
            type="text"
            placeholder="null"
            id="credit_card-name"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                credit_card: {
                  ...verifiedCardStatement.credit_card,
                  name: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.credit_card?.name}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("credit_card.holder")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="credit_card-holder"
            >
              Holder <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("credit_card.holder") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("credit_card.holder")!}
              />
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="credit_card-holder"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                credit_card: {
                  ...verifiedCardStatement.credit_card,
                  holder: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.credit_card?.holder}
          />

          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn(
                corrections.has("credit_card.number")
                  ? "text-red-500"
                  : "text-slate-900"
              )}
              htmlFor="credit_card-number"
            >
              Number <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("credit_card.number") && (
              <CorrectionPopover
                iconClassName="h-4 w-4 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                correction={corrections.get("credit_card.number")!}
              />
            )}
          </div>

          <Input
            type="text"
            placeholder="null"
            id="credit_card-number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                credit_card: {
                  ...verifiedCardStatement.credit_card,
                  number: e.target.value,
                },
              });
            }}
            value={verifiedCardStatement.credit_card?.number}
          />
        </div>
      </div>
      {/* Transactions */}
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                corrections.has("transactions")
                  ? "text-red-500"
                  : "text-slate-900",
                "font-semibold flex items-center"
              )}
            >
              Transactions
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
              {corrections.has("transactions") && (
                <CorrectionPopover
                  correction={corrections.get("transactions")!}
                />
              )}
              <Button
                onClick={() => {
                  setVerifiedCardStatement({
                    ...verifiedCardStatement,
                    transactions: [
                      ...verifiedCardStatement.transactions,
                      {
                        name: "",
                        category: "",
                        amount: "",
                      },
                    ],
                  });
                }}
                variant="ghost"
                className="h-8 ml-2 text-slate-900"
              >
                <Icons.plusCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Add Transaction</span>
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
                {verifiedCardStatement.transactions.map(
                  (transaction: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                      layoutId={`transaction-${index}`}
                      className="rounded-md border border-slate-200 px-4 py-3"
                    >
                      <Label htmlFor={`transaction-${index}-description`}>
                        Description
                      </Label>
                      <Input
                        type="text"
                        placeholder="null"
                        id={`transaction-${index}-description`}
                        className="w-full h-8"
                        onChange={(e) => {
                          const newTransactions = [
                            ...verifiedCardStatement.transactions,
                          ];
                          newTransactions[index].description = e.target.value;
                          setVerifiedCardStatement({
                            ...verifiedCardStatement,
                            transactions: newTransactions,
                          });
                        }}
                        value={transaction.description}
                      />
                      <div className="flex w-full mt-2 justify-between">
                        <div className="w-2/3 flex gap-1.5">
                          <div className="w-3/5">
                            <Label htmlFor={`transaction-${index}-category`}>
                              Category
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                const newTransactions = [
                                  ...verifiedCardStatement.transactions,
                                ];
                                newTransactions[index].category = value;
                                setVerifiedCardStatement({
                                  ...verifiedCardStatement,
                                  transactions: newTransactions,
                                });
                              }}
                              defaultValue={transaction.category}
                            >
                              <SelectTrigger className="w-full h-8">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {cardStatementsSchema.properties.transactions.items.properties.category.enum.map(
                                  (category: any) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-2/5">
                            <Label htmlFor={`transaction-${index}-amount`}>
                              Amount
                            </Label>
                            <Input
                              id={`transaction-${index}-amount`}
                              placeholder="null"
                              type="number"
                              className="w-full h-8"
                              onChange={(e) => {
                                const newTransactions = [
                                  ...verifiedCardStatement.transactions,
                                ];
                                newTransactions[index].amount = e.target.value;
                                setVerifiedCardStatement({
                                  ...verifiedCardStatement,
                                  transactions: newTransactions,
                                });
                              }}
                              value={transaction.amount}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-9 p-0 self-end"
                          onClick={() => {
                            const newTransactions = [
                              ...verifiedCardStatement.transactions,
                            ];
                            newTransactions.splice(index, 1);
                            setVerifiedCardStatement({
                              ...verifiedCardStatement,
                              transactions: newTransactions,
                            });
                          }}
                        >
                          <Icons.trash
                            strokeWidth={2.5}
                            className="h-4 w-4 text-slate-900"
                          />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className=" grid grid-rows-2 gap-2.5">
        {/* Currency */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <Label
              className={cn(
                "font-semibold text-base self-center",
                corrections.has("currency") && "text-red-500"
              )}
              htmlFor="currency"
            >
              Currency <span className="text-xs font-medium">(optional)</span>
            </Label>
            {corrections.has("currency") && (
              <CorrectionPopover
                align="end"
                correction={corrections.get("currency")!}
              />
            )}
          </div>

          <Input
            id="currency"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                currency: e.target.value,
              });
            }}
            value={verifiedCardStatement.currency}
          />
        </div>
        {/* Total Amount Due */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <Label
              className={cn(
                "font-semibold text-base self-center",
                corrections.has("total_amount_due") && "text-red-500"
              )}
              htmlFor="total_amount_due"
            >
              Total Amount Due
            </Label>
            {corrections.has("total_amount_due") && (
              <CorrectionPopover
                align="end"
                correction={corrections.get("total_amount_due")!}
              />
            )}
          </div>
          <Input
            id="total_amount_due"
            placeholder="null"
            type="number"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                total_amount_due: e.target.value,
              });
            }}
            value={verifiedCardStatement.total_amount_due}
          />
        </div>
      </div>
    </div>
  );
}
