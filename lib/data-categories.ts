// TODO : Use zod to json schema to generate each schema

export const receiptsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "receipts schema",
  type: "object",
  additionalProperties: false,
  properties: {
    number: {
      type: "string",
      description: "Number of the receipt.",
    },
    category: {
      type: "string",
      description:
        'Category of the receipt. If the category is not listed, use "other".',
      enum: ["retail", "groceries", "restaurant", "cafe", "other"],
    },
    date: {
      type: "string",
      format: "date",
      description: "Date of the receipt. Must be in the format of YYYY-MM-DD.",
    },
    time: {
      type: "string",
      format: "time",
      description: "Time of the receipt. Must be in the format of HH:MM:SS.",
    },
    from: {
      type: "string",
      description: "Name of the issuer of the receipt.",
    },
    items: {
      type: "array",
      description: "List of items of the receipt.",
      items: {
        type: "object",
        description: "An item of the receipt.",
        additionalProperties: false,
        properties: {
          description: {
            type: "string",
            description:
              "Description of the item. It should not contain the quantity or the amount.",
          },
          quantity: {
            type: "number",
            description: "Quantity of the item.",
            minimum: 0,
          },
          amount: {
            type: "number",
            description: "Amount of the item.",
            minimum: 0,
          },
        },
      },
    },
    subtotal: {
      type: "number",
      description: "Subtotal of the receipt.",
      minimum: 0,
    },
    tax: {
      type: "number",
      description: "Tax of the receipt.",
      minimum: 0,
    },
    tip: {
      type: "number",
      description: "Tip of the receipt. If there is no tip, just put 0.",
      minimum: 0,
    },
    total: {
      type: "number",
      description: "Total amount of the receipt.",
      minimum: 0,
    },
  },
  required: [
    "number",
    "category",
    "date",
    "time",
    "from",
    "items",
    "subtotal",
    "tax",
    "total",
  ],
};

export const invoicesSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "invoices schema",
  type: "object",
  additionalProperties: false,
  properties: {
    invoice_number: {
      type: "string",
      description: "Number of the invoice. It can contain dashes and spaces.",
    },
    category: {
      type: "string",
      description:
        'Category of the invoice. Some precision: b2b = business to business.  If the category is not listed, use "other".',
      enum: ["hobbies", "services", "b2b", "other"],
    },
    date: {
      type: "string",
      format: "date",
      description: "Date of the invoice. Must be in the format YYYY-MM-DD.",
    },
    from: {
      type: "object",
      description: "Sender of the invoice.",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Name of the sender.",
        },
        address: {
          type: "string",
          description:
            "Full address of the sender. If there is a newline, make the separation with a comma. It could be empty.",
        },
      },
      required: ["name"],
    },
    to: {
      type: "object",
      description: "Recipient of the invoice.",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Name of the recipient.",
        },
        address: {
          type: "string",
          description:
            "Full address of the recipient. If there is a newline, make the separation with a comma. It could be empty.",
        },
      },
      required: ["name"],
    },
    items: {
      type: "array",
      description: "List of items of the invoice.",
      items: {
        type: "object",
        description: "An item of the invoice.",
        additionalProperties: false,
        properties: {
          description: {
            type: "string",
            description: "Description of the item.",
          },
          amount: {
            type: "number",
            description: "Amount of the item.",
            minimum: 0,
          },
        },
      },
    },
    currency: {
      type: "string",
      description:
        "Currency of the invoice. It must be a valid ISO 4217 currency code.",
    },
    total_amount_due: {
      type: "number",
      description: "Total amount due of the invoice.",
      minimum: 0,
    },
  },
  required: [
    "invoice_number",
    "category",
    "date",
    "from",
    "to",
    "items",
    "currency",
    "total_amount_due",
  ],
};

export const cardStatementsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "credit_card_statement schema",
  type: "object",
  additionalProperties: false,
  properties: {
    issuer: {
      type: "object",
      description: "Issuer of the credit card statement.",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Name of the credit card issuer.",
        },
        address: {
          type: "string",
          description:
            "Full address of the credit card issuer. If there is a newline, make the separation with a comma.",
        },
      },
      required: ["name", "address"],
    },
    recipient: {
      type: "object",
      description: "Recipient of the credit card statement.",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Name of the recipient.",
        },
        address: {
          type: "string",
          description:
            "Full address of the recipient. If there is a newline, make the separation with a comma.",
        },
      },
      required: ["name", "address"],
    },
    date: {
      type: "string",
      format: "date",
      description:
        "Date of the credit card statement. Must be in the format YYYY-MM-DD.",
    },
    credit_card: {
      type: "object",
      description: "Credit card of the credit card statement",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Name of the credit card.",
        },
        holder: {
          type: "string",
          description: "Name of the credit card holder.",
        },
        number: {
          type: "string",
          description:
            "Number of the credit card. Must be in the format XXXX XXXX XXXX XXXX.",
        },
      },
      required: ["name", "holder", "number"],
    },
    transactions: {
      type: "array",
      description: "List of transactions of the credit card statement.",
      items: {
        type: "object",
        description: "Transaction of the credit card statement.",
        additionalProperties: false,
        properties: {
          description: {
            type: "string",
            description:
              "Name of the transaction, including the country code if applicable.",
          },
          category: {
            type: "string",
            description:
              'Category of the transaction. If the category is not listed, use "other".',
            enum: [
              "food",
              "travel",
              "hobbies",
              "services",
              "shopping",
              "entertainment",
              "other",
            ],
          },
          amount: {
            type: "number",
            description: "Amount of the transaction.",
            minimum: 0,
          },
        },
        required: ["description", "category", "amount"],
      },
    },
    currency: {
      type: "string",
      description:
        "Currency of the credit card statement. It must be a valid ISO 4217 currency code.",
    },
    total_amount_due: {
      type: "number",
      description: "Total amount due of the credit card statement.",
      minimum: 0,
    },
  },
  required: [
    "issuer",
    "recipient",
    "date",
    "credit_card",
    "transactions",
    "currency",
    "total_amount_due",
  ],
};

export interface Category {
  value: string;
  name: string;
  schema: any; // ideally replace 'any' with the actual type of your schemas
}

export const categories = new Map<string, Category>([
  [
    "receipts",
    {
      value: "receipts",
      name: "Receipt",
      schema: receiptsSchema,
    },
  ],
  [
    "invoices",
    {
      value: "invoices",
      name: "Invoice",
      schema: invoicesSchema,
    },
  ],
  [
    "credit card statements",
    {
      value: "credit card statements",
      name: "Card Statement",
      schema: cardStatementsSchema,
    },
  ],
]);
