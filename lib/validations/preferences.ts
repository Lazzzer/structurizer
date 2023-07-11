import * as z from "zod";

export const preferencesSchema = z
  .object({
    classificationModel: z.enum(["gpt-3.5-turbo", "gpt-3.5-turbo-16k"], {
      required_error: "Please select a model.",
    }),
    extractionModel: z.enum(["gpt-3.5-turbo", "gpt-3.5-turbo-16k"], {
      required_error: "Please select a model.",
    }),
    analysisModel: z.enum(["gpt-3.5-turbo-16k", "gpt-4"], {
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
