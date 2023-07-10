import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { invoicesSchema } from "@/lib/data-categories";
import { validateRequiredOrEmptyFields } from "@/lib/validations/request";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("id");

  const schema = z.object({
    id: z.string().uuid(),
  });

  const { success } = schema.safeParse({ id: invoiceId });

  if (!success) {
    return NextResponse.json({ error: "Invalid Invoice id" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId!,
      userId: user.id,
    },
    include: {
      items: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json(invoice, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await req.json();
  if (!data) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  try {
    validateRequiredOrEmptyFields(data, [
      "category",
      "date",
      "totalAmountDue",
      "fromName",
    ]);
    await prisma.invoice.update({
      where: {
        id: data.id,
        userId: user.id,
      },
      data: {
        invoiceNumber: data.invoiceNumber,
        date: new Date(data.date).toISOString(),
        category: invoicesSchema.properties.category.enum.includes(
          data.category
        )
          ? data.category
          : null,
        fromName: data.fromName,
        fromAddress: data.fromAddress,
        toName: data.toName,
        toAddress: data.toAddress,
        currency: data.currency,
        totalAmountDue: data.totalAmountDue,
        items: {
          deleteMany: {
            invoiceId: data.id,
            NOT: data.items?.map((item: any) => ({
              id: item.id,
            })),
          },
          upsert: data.items?.map((item: any) => ({
            where: {
              id: item.id,
              invoiceId: data.id,
            },
            create: {
              description:
                item.description.length > 0 ? item.description : null,
              amount: item.amount,
            },
            update: {
              description:
                item.description.length > 0 ? item.description : null,
              amount: item.amount,
            },
          })),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invoice not updated" }, { status: 422 });
  }

  return NextResponse.json("Invoice updated", { status: 200 });
}
