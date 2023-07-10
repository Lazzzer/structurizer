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
import { cardStatementsSchema } from "@/lib/data-categories";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { updateStructuredData } from "@/lib/client-requests";
import { CardStatement } from "@prisma/client";
import { useRouter } from "next/navigation";

interface SheetCardStatementEditorProps {
  cardStatement: CardStatementWithTransactions;
  setIsEditing: (isEditing: boolean) => void;
}

type CardTransaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
};

type CardStatementWithTransactions = CardStatement & {
  transactions: CardTransaction[];
};

export function SheetCardStatementEditor({
  cardStatement,
  setIsEditing,
}: SheetCardStatementEditorProps): React.JSX.Element {
  const [editedCardStatement, setEditedCardStatement] =
    useState<CardStatementWithTransactions>({
      ...cardStatement,
    });
  const [isLoading, setIsLoading] = useState(false);
  const [areItemsOpen, setAreItemsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  return (
    <div className="w-full h-full">
      <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
        <div className="w-full min-h-full h-20 p-2 overflow-scroll">
          <div>
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
                  setEditedCardStatement({
                    ...editedCardStatement,
                    date: e.target.valueAsDate ?? new Date(),
                  });
                }}
                value={
                  new Date(editedCardStatement.date).toISOString().split("T")[0]
                }
              />
            </div>
          </div>
          {/* Issuer */}
          <div>
            <h4
              className={cn(
                "font-semibold flex items-center mt-3 mb-2.5 text-slate-800"
              )}
            >
              Issuer
              <Icons.braces
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
            </h4>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1 mb-1">
                <Label className="-mt-0.5 text-slate-800" htmlFor="issuerName">
                  Name
                </Label>
              </div>

              <Input
                type="text"
                placeholder="null"
                id="issuerName"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    issuerName: e.target.value,
                  });
                }}
                value={editedCardStatement.issuerName}
              />
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="issuerAddress">
                  Address{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="issuerAddress"
                type="text"
                placeholder="null"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    issuerAddress: e.target.value,
                  });
                }}
                value={editedCardStatement.issuerAddress ?? ""}
              />
            </div>
          </div>
          {/* Recipient */}
          <div>
            <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
              Recipient
              <Icons.braces
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
            </h4>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="recipientName">
                  Name <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="recipientName"
                type="text"
                placeholder="null"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    recipientName: e.target.value,
                  });
                }}
                value={editedCardStatement.recipientName ?? ""}
              />
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="recipientAddress">
                  Address{" "}
                  <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="recipientAddress"
                type="text"
                placeholder="null"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    recipientAddress: e.target.value,
                  });
                }}
                value={editedCardStatement.recipientAddress ?? ""}
              />
            </div>
          </div>
          {/* Credit card */}
          <div>
            <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
              Credit Card
              <Icons.braces
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
            </h4>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="creditCardName">
                  Name <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>
              <Input
                id="creditCardName"
                type="text"
                placeholder="null"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    creditCardName: e.target.value,
                  });
                }}
                value={editedCardStatement.creditCardName ?? ""}
              />
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="creditCardHolder">
                  Holder <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="creditCardHolder"
                type="text"
                placeholder="null"
                className="w-full h-8 mb-2"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    creditCardHolder: e.target.value,
                  });
                }}
                value={editedCardStatement.creditCardHolder ?? ""}
              />

              <div className="flex items-center gap-1 mb-1">
                <Label className="text-slate-800" htmlFor="creditCardNumber">
                  Number <span className="text-xs font-medium">(optional)</span>
                </Label>
              </div>

              <Input
                id="creditCardNumber"
                type="text"
                placeholder="null"
                className="w-full h-8"
                onChange={(e) => {
                  setEditedCardStatement({
                    ...editedCardStatement,
                    creditCardNumber: e.target.value,
                  });
                }}
                value={editedCardStatement.creditCardNumber ?? ""}
              />
            </div>
          </div>
          {/* Transactions */}
          <div className="my-4">
            <Collapsible open={areItemsOpen} onOpenChange={setAreItemsOpen}>
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    "font-semibold flex items-center text-slate-800"
                  )}
                >
                  Transactions
                  <Icons.brackets
                    strokeWidth={3}
                    className="h-4 w-4 ml-1 inline-block"
                  />
                  <Button
                    onClick={() => {
                      setEditedCardStatement({
                        ...editedCardStatement,
                        transactions: [
                          ...editedCardStatement.transactions,
                          {
                            id: window.crypto.randomUUID(),
                            description: "",
                            category: "other",
                            amount: 0,
                          },
                        ],
                      });
                    }}
                    variant="ghost"
                    className="h-8 ml-2 text-slate-800"
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
                    {editedCardStatement.transactions.map(
                      (transaction: CardTransaction) => (
                        <motion.div
                          layout="size"
                          key={transaction.id}
                          initial={false}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.3 },
                          }}
                          layoutId={transaction.id}
                          className="rounded-md border border-slate-200 px-4 py-3"
                        >
                          <Label
                            htmlFor={`transaction-${transaction.id}-description`}
                          >
                            Description
                          </Label>
                          <Input
                            type="text"
                            placeholder="null"
                            id={`transaction-${transaction.id}-description`}
                            className="w-full h-8"
                            onChange={(e) => {
                              setEditedCardStatement((prevCardStatement) => ({
                                ...prevCardStatement,
                                transactions:
                                  prevCardStatement.transactions.map((t) =>
                                    t.id === transaction.id
                                      ? { ...t, description: e.target.value }
                                      : t
                                  ),
                              }));
                            }}
                            value={transaction.description}
                          />
                          <div className="flex w-full mt-2 justify-between">
                            <div className="w-2/3 flex gap-1.5">
                              <div className="w-3/5">
                                <Label
                                  htmlFor={`transaction-${transaction.id}-category`}
                                >
                                  Category
                                </Label>
                                <Select
                                  onValueChange={(value) => {
                                    setEditedCardStatement(
                                      (prevCardStatement) => ({
                                        ...prevCardStatement,
                                        transactions:
                                          prevCardStatement.transactions.map(
                                            (t) =>
                                              t.id === transaction.id
                                                ? {
                                                    ...t,
                                                    category: value,
                                                  }
                                                : t
                                          ),
                                      })
                                    );
                                  }}
                                  defaultValue={transaction.category}
                                >
                                  <SelectTrigger className="w-full h-8">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cardStatementsSchema.properties.transactions.items.properties.category.enum.map(
                                      (category: any) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="w-2/5">
                                <Label
                                  htmlFor={`transaction-${transaction.id}-amount`}
                                >
                                  Amount
                                </Label>
                                <Input
                                  id={`transaction-${transaction.id}-amount`}
                                  placeholder="null"
                                  type="number"
                                  className="w-full h-8"
                                  onChange={(e) => {
                                    setEditedCardStatement(
                                      (prevCardStatement) => ({
                                        ...prevCardStatement,
                                        transactions:
                                          prevCardStatement.transactions.map(
                                            (t) =>
                                              t.id === transaction.id
                                                ? {
                                                    ...t,
                                                    amount: parseFloat(
                                                      e.target.value
                                                    ),
                                                  }
                                                : t
                                          ),
                                      })
                                    );
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
                                setEditedCardStatement((prevCardStatement) => ({
                                  ...prevCardStatement,
                                  transactions:
                                    prevCardStatement.transactions.filter(
                                      (t) => t.id !== transaction.id
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
                  setEditedCardStatement({
                    ...editedCardStatement,
                    currency: e.target.value,
                  });
                }}
                value={editedCardStatement.currency ?? ""}
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
                  setEditedCardStatement({
                    ...editedCardStatement,
                    totalAmountDue: parseFloat(e.target.value),
                  });
                }}
                value={editedCardStatement.totalAmountDue}
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
                updateStructuredData<CardStatementWithTransactions>(
                  editedCardStatement,
                  "card-statements"
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
