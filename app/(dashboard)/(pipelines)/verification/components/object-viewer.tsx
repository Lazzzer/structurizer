"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReceiptsViewer } from "./receipts-viewer";
import { cn } from "@/lib/utils";
import { InvoicesViewer } from "./invoices-viewer";
import { CardStatementsViewer } from "./card-statements-viewer";

interface ObjectViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  category: string;
  json: any;
  corrections: any[];
  setVerifiedJson: (json: any) => void;
}

export function ObjectViewer({
  className,
  category,
  json,
  corrections,
  setVerifiedJson,
}: ObjectViewerProps) {
  const correctionsMap = new Map();
  corrections.forEach((correction) => {
    correctionsMap.set(correction.field.replace(/\[.*\]/g, ""), correction);
  });

  return (
    <ScrollArea
      className={cn(className, "w-full h-full bg-white rounded-lg p-2")}
    >
      {category === "receipts" && (
        <ReceiptsViewer
          verifiedReceipt={json}
          setVerifiedReceipt={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
      {category === "invoices" && (
        <InvoicesViewer
          verifiedInvoice={json}
          setVerifiedInvoice={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
      {category === "credit card statements" && (
        <CardStatementsViewer
          verifiedCardStatement={json}
          setVerifiedCardStatement={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
    </ScrollArea>
  );
}
