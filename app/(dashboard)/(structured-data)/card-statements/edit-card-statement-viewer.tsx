import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cardStatementsSchema } from "@/lib/llm/schema";
import { CardStatement } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CardTransaction = {
  description: string;
  category: string;
  amount: number;
};

type CardStatementWithTransactions = CardStatement & {
  transactions: CardTransaction[];
};

type EditCardStatementViewerProps = {
  editCardStatement: CardStatementWithTransactions;
  setEditCardStatement: (cardStatement: any) => void;
};

export function EditCardStatementViewer({
  editCardStatement,
  setEditCardStatement,
}: EditCardStatementViewerProps): React.JSX.Element {
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  return (
    <div className="w-full min-h-full h-20 p-2 overflow-scroll">
      <div>
        {/* Date */}
        <div className="grid grid-cols-2">
          <div className={cn("flex items-center gap-1 text-slate-800")}>
            <Label
              className="font-semibold text-base self-center"
              htmlFor="from"
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
              setEditCardStatement({
                ...editCardStatement,
                date: e.target.value,
              });
            }}
            value={editCardStatement.date as unknown as string}
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
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label
              className={cn("-mt-0.5 text-slate-800")}
              htmlFor="issuerName"
            >
              Name
            </Label>
          </div>

          <Input
            type="text"
            placeholder="null"
            id="issuerName"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                issuerName: e.target.value,
              });
            }}
            value={editCardStatement.issuerName}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="issuerAddress">
              Address
            </Label>
          </div>
          <Input
            type="text"
            placeholder="null"
            id="issuerAddress"
            className="w-full h-8"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                issuerAddress: e.target.value,
              });
            }}
            value={editCardStatement.issuerAddress ?? ""}
          />
        </div>
      </div>
      {/* Recipient */}
      <div>
        <h4
          className={cn(
            "font-semibold flex items-center mt-3 mb-2.5 text-slate-800"
          )}
        >
          Recipient
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="recipientName">
              Name
            </Label>
          </div>
          <Input
            type="text"
            placeholder="null"
            id="recipientName"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                recipientName: e.target.value,
              });
            }}
            value={editCardStatement.recipientName ?? ""}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="recipientAddress">
              Address
            </Label>
          </div>

          <Input
            type="text"
            placeholder="null"
            id="recipientAddress"
            className="w-full h-8"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                recipientAddress: e.target.value,
              });
            }}
            value={editCardStatement.recipientAddress ?? ""}
          />
        </div>
      </div>
      {/* Credit card */}
      <div>
        <h4
          className={cn(
            "font-semibold flex items-center mt-3 mb-2.5 text-slate-800"
          )}
        >
          Credit Card
          <Icons.braces strokeWidth={3} className="h-4 w-4 ml-1 inline-block" />
        </h4>
        <div className="rounded-md border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="creditCardName">
              Name
            </Label>
          </div>
          <Input
            type="text"
            placeholder="null"
            id="creditCardName"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                creditCardName: e.target.value,
              });
            }}
            value={editCardStatement.creditCardName ?? ""}
          />
          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="creditCardHolder">
              Holder
            </Label>
          </div>

          <Input
            type="text"
            placeholder="null"
            id="creditCardHolder"
            className="w-full h-8 mb-2"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                creditCardHolder: e.target.value,
              });
            }}
            value={editCardStatement.creditCardHolder ?? ""}
          />

          <div className="flex items-center gap-1 mb-1">
            <Label className={cn("text-slate-800")} htmlFor="creditCardNumber">
              Number
            </Label>
          </div>

          <Input
            type="text"
            placeholder="null"
            id="creditCardNumber"
            className="w-full h-8"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                creditCardNumber: e.target.value,
              });
            }}
            value={editCardStatement.creditCardNumber ?? ""}
          />
        </div>
      </div>
      {/* Transactions */}
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn("font-semibold flex items-center text-slate-800")}
            >
              Transactions
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 ml-1 inline-block"
              />
              <Button
                onClick={() => {
                  setEditCardStatement({
                    ...editCardStatement,
                    transactions: [
                      ...editCardStatement.transactions,
                      {
                        name: "",
                        category: "",
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
                {editCardStatement.transactions.map(
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
                            ...editCardStatement.transactions,
                          ];
                          newTransactions[index].description = e.target.value;
                          setEditCardStatement({
                            ...editCardStatement,
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
                                  ...editCardStatement.transactions,
                                ];
                                newTransactions[index].category = value;
                                setEditCardStatement({
                                  ...editCardStatement,
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
                                  (category) => (
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
                                  ...editCardStatement.transactions,
                                ];
                                newTransactions[index].amount =
                                  e.target.valueAsNumber;
                                setEditCardStatement({
                                  ...editCardStatement,
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
                              ...editCardStatement.transactions,
                            ];
                            newTransactions.splice(index, 1);
                            setEditCardStatement({
                              ...editCardStatement,
                              transactions: newTransactions,
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
              Currency
            </Label>
          </div>

          <Input
            id="currency"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setEditCardStatement({
                ...editCardStatement,
                currency: e.target.value,
              });
            }}
            value={editCardStatement.currency ?? ""}
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
              setEditCardStatement({
                ...editCardStatement,
                totalAmountDue: e.target.value,
              });
            }}
            value={editCardStatement.totalAmountDue}
          />
        </div>
      </div>
    </div>
  );
}
