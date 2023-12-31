import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { validateRequiredOrEmptyFields } from "@/lib/validations/request";
import { cardStatementsSchema } from "@/lib/data-categories";
import { log } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Card Statements", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const cardStatementId = searchParams.get("id");

  const schema = z.object({
    id: z.string().uuid(),
  });

  const { success } = schema.safeParse({ id: cardStatementId });

  if (!success) {
    log.warn("Card Statements", req.method, "Failed request, invalid id");
    return NextResponse.json(
      { error: "Invalid Card Statement id" },
      { status: 400 }
    );
  }
  const cardStatement = await prisma.cardStatement.findFirst({
    where: {
      id: cardStatementId!,
      userId: user.id,
    },
    include: {
      transactions: true,
    },
  });

  if (!cardStatement) {
    log.warn("Card Statements", req.method, "Card Statement not found");
    return NextResponse.json(
      { error: "Card Statement not found" },
      { status: 404 }
    );
  }

  log.debug("Card Statements", req.method, "Fetched", cardStatementId);
  return NextResponse.json(cardStatement, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Card Statements", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await req.json();
  if (!data) {
    log.warn("Card Statements", req.method, "Failed request, no data provided");
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }
  try {
    validateRequiredOrEmptyFields(data, [
      "totalAmountDue",
      "date",
      "issuerName",
    ]);
    await prisma.cardStatement.update({
      where: {
        id: data.id,
        userId: user.id,
      },
      data: {
        creditCardName: data.creditCardName,
        creditCardHolder: data.creditCardHolder,
        creditCardNumber: data.creditCardNumber,
        issuerName: data.issuerName,
        issuerAddress: data.issuerAddress,
        recipientName: data.recipientName,
        recipientAddress: data.recipientAddress,
        date: new Date(data.date).toISOString(),
        currency: data.currency,
        totalAmountDue: data.totalAmountDue,
        transactions: {
          deleteMany: {
            cardStatementId: data.id,
            NOT: data.transactions?.map((transaction: any) => ({
              id: transaction.id,
            })),
          },
          upsert: data.transactions?.map((transaction: any) => {
            validateRequiredOrEmptyFields(transaction, [
              "description",
              "category",
              "amount",
            ]);
            return {
              where: {
                id: transaction.id,
                cardStatementId: data.id,
              },
              create: {
                description: transaction.description,
                category:
                  cardStatementsSchema.properties.transactions.items.properties.category.enum.includes(
                    transaction.category
                  )
                    ? transaction.category
                    : null,
                amount: transaction.amount,
              },
              update: {
                description: transaction.description,
                category:
                  cardStatementsSchema.properties.transactions.items.properties.category.enum.includes(
                    transaction.category
                  )
                    ? transaction.category
                    : null,
                amount: transaction.amount,
              },
            };
          }),
        },
      },
    });
  } catch (error) {
    log.warn(
      "Card Statements",
      req.method,
      "Failed to update card statement",
      data.id
    );
    log.debug(
      "Card Statements",
      req.method,
      "Failed to update card statement",
      data.id,
      error
    );
    return NextResponse.json(
      { error: "Card Statement not updated" },
      { status: 422 }
    );
  }

  log.debug("Card Statements", req.method, "Updated", data.id);
  return NextResponse.json("cardStatement updated", { status: 200 });
}
