import * as z from "zod";

export const preferencesSchema = z
  .object({
    classificationModel: z.string({
      required_error: "Please select a model.",
    }),
    extractionModel: z.string({
      required_error: "Please select a model.",
    }),
    analysisModel: z.string({
      required_error: "Please select a model.",
    }),
    enableReceiptsOneShot: z.boolean(),
    enableInvoicesOneShot: z.boolean(),
    enableCardStatementsOneShot: z.boolean(),
    receiptExampleExtractionId: z.string().uuid().nullish(),
    invoiceExampleExtractionId: z.string().uuid().nullish(),
    cardStatementExampleExtractionId: z.string().uuid().nullish(),
  })
  .refine(
    (data) => {
      if (data.enableReceiptsOneShot && !data.receiptExampleExtractionId)
        return false;
      return true;
    },
    {
      message: "Please select an extraction of receipts.",
      path: ["receiptExampleExtractionId"],
    }
  )
  .refine(
    (data) => {
      if (data.enableInvoicesOneShot && !data.invoiceExampleExtractionId)
        return false;
      return true;
    },
    {
      message: "Please select an extraction of invoices.",
      path: ["invoiceExampleExtractionId"],
    }
  )
  .refine(
    (data) => {
      if (
        data.enableCardStatementsOneShot &&
        !data.cardStatementExampleExtractionId
      )
        return false;

      return true;
    },
    {
      message: "Please select an extraction of card statements.",
      path: ["cardStatementExampleExtractionId"],
    }
  );
