"use client";

import { ReceiptsViewer } from "./receipts-viewer";
import { InvoicesViewer } from "./invoices-viewer";
import { CardStatementsViewer } from "./card-statements-viewer";
import { Correction } from "types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
      {category === "receipts" && (
        <ReceiptsViewer
          verifiedReceipt={json}
          setVerifiedReceipt={setVerifiedJson}
          corrections={corrections}
        />
      )}
      {category === "invoices" && (
        <InvoicesViewer
          verifiedInvoice={json}
          setVerifiedInvoice={setVerifiedJson}
          corrections={corrections}
        />
      )}
      {category === "credit card statements" && (
        <CardStatementsViewer
          verifiedCardStatement={json}
          setVerifiedCardStatement={setVerifiedJson}
          corrections={corrections}
        />
      )}
    </ScrollArea>
  );
}
