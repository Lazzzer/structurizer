import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { getUser } from "@/lib/session";
import * as z from "zod";
import {
  validateBody,
  validateRequiredOrEmptyFields,
} from "@/lib/validations/request";
import {
  cardStatementsSchema,
  categories,
  invoicesSchema,
  receiptsSchema,
} from "@/lib/data-categories";
import { fetchFromService } from "@/lib/server-requests";

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    id: z.string().uuid(),
    category: z.string().refine((category) => categories.has(category)),
    json: z.any(),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const extraction = await prisma.extraction.findFirst({
    where: {
      id: body.id,
      userId: user.id,
      status: Status.TO_VERIFY,
    },
  });

  if (!extraction) {
    return NextResponse.json(
      { error: "Extraction not found" },
      { status: 404 }
    );
  }

  try {
    switch (extraction.category) {
      case "receipts": {
        validateRequiredOrEmptyFields(body.json, [
          "from",
          "category",
          "date",
          "total",
        ]);
        await prisma.receipt.create({
          data: {
            userId: user.id,
            extractionId: extraction.id,
            objectPath: extraction.objectPath,
            number: body.json.number,
            category: receiptsSchema.properties.category.enum.includes(
              body.json.category
            )
              ? body.json.category
              : null,
            date: new Date(body.json.date).toISOString(),
            time: body.json.time,
            from: body.json.from,
            subtotal: parseFloat(body.json.subtotal),
            tax: parseFloat(body.json.tax),
            tip: parseFloat(body.json.tip),
            total: parseFloat(body.json.total),
            items: {
              create: body.json.items?.map((item: any) => {
                validateRequiredOrEmptyFields(item, [
                  "description",
                  "quantity",
                  "amount",
                ]);
                return {
                  description: item.description,
                  quantity: parseFloat(item.quantity),
                  amount: parseFloat(item.amount),
                };
              }),
            },
          },
        });
        break;
      }
      case "invoices": {
        validateRequiredOrEmptyFields(body.json, [
          "category",
          "date",
          "total_amount_due",
        ]);
        validateRequiredOrEmptyFields(body.json.from, ["name"]);
        await prisma.invoice.create({
          data: {
            userId: user.id,
            extractionId: extraction.id,
            objectPath: extraction.objectPath,
            invoiceNumber: body.json.invoice_number,
            category: invoicesSchema.properties.category.enum.includes(
              body.json.category
            )
              ? body.json.category
              : null,
            date: new Date(body.json.date).toISOString(),
            fromName: body.json.from.name,
            fromAddress: body.json.from.address,
            toName: body.json.to.name,
            toAddress: body.json.to.address,
            currency: body.json.currency,
            totalAmountDue: parseFloat(body.json.total_amount_due),
            items: {
              create: body.json.items?.map((item: any) => {
                return {
                  description:
                    item.description.length > 0 ? item.description : null,
                  amount: parseFloat(item.amount),
                };
              }),
            },
          },
        });
        break;
      }
      case "credit card statements": {
        validateRequiredOrEmptyFields(body.json, ["total_amount_due", "date"]);
        validateRequiredOrEmptyFields(body.json.issuer, ["name"]);
        await prisma.cardStatement.create({
          data: {
            userId: user.id,
            extractionId: extraction.id,
            objectPath: extraction.objectPath,
            issuerName: body.json.issuer.name,
            issuerAddress: body.json.issuer.address,
            recipientName: body.json.recipient.name,
            recipientAddress: body.json.recipient.address,
            creditCardName: body.json.credit_card.name,
            creditCardNumber: body.json.credit_card.number,
            creditCardHolder: body.json.credit_card.holder,
            date: new Date(body.json.date).toISOString(),
            currency: body.json.currency,
            totalAmountDue: parseFloat(body.json.total_amount_due),
            transactions: {
              create: body.json.transactions?.map((transaction: any) => {
                validateRequiredOrEmptyFields(transaction, [
                  "description",
                  "category",
                  "amount",
                ]);
                return {
                  description: transaction.description,
                  category:
                    cardStatementsSchema.properties.transactions.items.properties.category.enum.includes(
                      transaction.category
                    )
                      ? transaction.category
                      : null,
                  amount: parseFloat(transaction.amount),
                };
              }),
            },
          },
        });
        break;
      }
      default:
        return NextResponse.json(
          { error: "Invalid category provided" },
          { status: 500 }
        );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Data provided cannot be saved." },
      { status: 422 }
    );
  }

  try {
    await prisma.extraction.update({
      where: {
        id: body.id,
        userId: user.id,
        status: Status.TO_VERIFY,
      },
      data: {
        json: body.json,
        status: Status.PROCESSED,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Extraction not updated" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Data saved" }, { status: 200 });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    text: z.string().min(1),
    category: z.string().refine((category) => categories.has(category)),
    json: z.object({}).nonstrict(),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user.id,
    },
  });

  const data = {
    model: {
      apiKey: process.env.OPENAI_API_KEY as string,
      name: preferences?.analysisModel ?? "gpt-4",
    },
    jsonSchema: JSON.stringify(categories.get(body.category)!.schema),
    originalText: body.text,
    jsonOutput: JSON.stringify(body.json),
  };
  const res = await fetchFromService("analysis", data);

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { analysis } = await res.json();

  return NextResponse.json(analysis, { status: 200 });
}
