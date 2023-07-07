import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session?.user.id;

  const { uuid, json } = await req.json();

  if (!uuid || !json) {
    return NextResponse.json(
      { error: "No UUID or JSON provided" },
      { status: 400 }
    );
  }

  let jsonObj = null;
  try {
    jsonObj = JSON.parse(json);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON provided" },
      { status: 400 }
    );
  }

  const extraction = await prisma.extraction.findUnique({
    where: {
      id: uuid,
    },
  });

  let data = null;
  switch (extraction?.category) {
    case "receipts": {
      try {
        data = await prisma.receipt.create({
          data: {
            extractionId: uuid,
            userId: userUUID,
            objectPath: extraction.objectPath,
            number: jsonObj.number,
            category: jsonObj.category,
            date: new Date(jsonObj.date).toISOString(),
            time: jsonObj.time,
            from: jsonObj.from,
            subtotal: parseFloat(jsonObj.subtotal),
            tax: parseFloat(jsonObj.tax),
            tip: parseFloat(jsonObj.tip),
            total: parseFloat(jsonObj.total),
            items: {
              create: jsonObj.items?.map((item: any) => ({
                description: item.description,
                quantity: parseFloat(item.quantity),
                amount: parseFloat(item.amount),
              })),
            },
          },
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Receipt not created, bad data" },
          { status: 400 }
        );
      }

      break;
    }
    case "invoices": {
      try {
        data = await prisma.invoice.create({
          data: {
            userId: userUUID,
            extractionId: uuid,
            objectPath: extraction.objectPath,
            invoiceNumber: jsonObj.invoice_number,
            date: new Date(jsonObj.date).toISOString(),
            category: jsonObj.category,
            fromName: jsonObj.from.name,
            fromAddress: jsonObj.from.address,
            toName: jsonObj.to.name,
            toAddress: jsonObj.to.address,
            currency: jsonObj.currency,
            totalAmountDue: parseFloat(jsonObj.total_amount_due),
            items: {
              create: jsonObj.items?.map((item: any) => ({
                description: item.description,
                amount: parseFloat(item.amount),
              })),
            },
          },
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Invoice not created, bad data" },
          { status: 400 }
        );
      }
      break;
    }
    case "credit card statements": {
      try {
        data = await prisma.cardStatement.create({
          data: {
            userId: userUUID,
            extractionId: uuid,
            objectPath: extraction.objectPath,
            issuerName: jsonObj.issuer.name,
            issuerAddress: jsonObj.issuer.address,
            recipientName: jsonObj.recipient.name,
            recipientAddress: jsonObj.recipient.address,
            creditCardName: jsonObj.credit_card.name,
            creditCardNumber: jsonObj.credit_card.number,
            creditCardHolder: jsonObj.credit_card.holder,
            date: new Date(jsonObj.date).toISOString(),
            currency: jsonObj.currency,
            totalAmountDue: parseFloat(jsonObj.total_amount_due),
            transactions: {
              create: jsonObj.transactions?.map((transaction: any) => ({
                description: transaction.description,
                category: transaction.category,
                amount: parseFloat(transaction.amount),
              })),
            },
          },
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Card Statement not created, bad data" },
          { status: 400 }
        );
      }

      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 500 }
      );
  }

  if (!data) {
    return NextResponse.json({ error: "Data not created" }, { status: 400 });
  }

  const updatedExtraction = await prisma.extraction.updateMany({
    where: {
      id: uuid,
      userId: userUUID,
      status: Status.TO_VERIFY,
    },
    data: {
      json,
      status: Status.PROCESSED,
    },
  });

  if (!updatedExtraction.count) {
    return NextResponse.json(
      { error: "Extraction not found or not updated" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Process finished" }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, category, json } = await req.json();

  if (!text || !category || !json) {
    return NextResponse.json(
      { error: "No text, category or json provided" },
      { status: 400 }
    );
  }

  let schema = {};
  switch (category) {
    case "receipts": {
      schema = receiptsSchema;
      break;
    }
    case "invoices": {
      schema = invoicesSchema;
      break;
    }
    case "credit card statements": {
      schema = cardStatementsSchema;
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 400 }
      );
  }

  const res = await fetch(
    `${process.env.LLM_STRUCTURIZER_URL}/v1/structured-data/json/analysis`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {
          apiKey: process.env.OPENAI_API_KEY as string,
          name: "gpt-4",
        },
        jsonSchema: JSON.stringify(schema),
        originalText: text,
        jsonOutput: json,
      }),
    }
  );
  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { analysis } = await res.json();

  return NextResponse.json(analysis, { status: 200 });
}
