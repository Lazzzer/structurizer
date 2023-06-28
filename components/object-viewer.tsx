import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReceiptsViewer } from "./receipts-viewer";
import { cn } from "@/lib/utils";
import { InvoicesViewer } from "./invoices-viewer";

export function ObjectViewer({
  className,
  category,
  json,
  corrections,
  setVerifiedJson,
}: {
  className?: string;
  category: string;
  json: any;
  corrections: any[];
  setVerifiedJson: (json: any) => void;
}) {
  const correctionsMap = new Map();
  corrections.forEach((correction) => {
    correctionsMap.set(correction.field, correction);
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
    </ScrollArea>
  );
}
