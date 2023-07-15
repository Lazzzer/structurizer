"use client";

import { ReceiptsViewer } from "./receipts-viewer";
import { InvoicesViewer } from "./invoices-viewer";
import { CardStatementsViewer } from "./card-statements-viewer";
import { Correction } from "types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CARD_STATEMENTS, INVOICES, RECEIPTS } from "@/lib/data-categories";

interface ObjectViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  category: string;
  json: any;
  corrections: Map<string, Correction>;
  setVerifiedJson: (json: any) => void;
}

export function ObjectViewer({
  category,
  json,
  corrections,
  setVerifiedJson,
}: ObjectViewerProps) {
  return (
    <ScrollArea className="w-full h-full bg-white rounded-lg p-2">
      {category === RECEIPTS && (
        <ReceiptsViewer
          verifiedReceipt={json}
          setVerifiedReceipt={setVerifiedJson}
          corrections={corrections}
        />
      )}
      {category === INVOICES && (
        <InvoicesViewer
          verifiedInvoice={json}
          setVerifiedInvoice={setVerifiedJson}
          corrections={corrections}
        />
      )}
      {category === CARD_STATEMENTS && (
        <CardStatementsViewer
          verifiedCardStatement={json}
          setVerifiedCardStatement={setVerifiedJson}
          corrections={corrections}
        />
      )}
    </ScrollArea>
  );
}
