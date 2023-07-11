import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { receiptsSchema } from "@/lib/data-categories";
import { validateRequiredOrEmptyFields } from "@/lib/validations/request";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const receiptId = searchParams.get("id");

  const schema = z.object({
    id: z.string().uuid(),
  });

  const { success } = schema.safeParse({ id: receiptId });

  if (!success) {
    return NextResponse.json({ error: "Invalid Receipt id" }, { status: 400 });
  }
  const receipt = await prisma.receipt.findFirst({
    where: {
      id: receiptId!,
      userId: user.id,
    },
    include: {
      items: true,
    },
  });

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }
  return NextResponse.json(receipt, { status: 200 });
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
    validateRequiredOrEmptyFields(data, ["from", "category", "date", "total"]);
    await prisma.receipt.update({
      where: {
        id: data.id,
        userId: user.id,
      },
      data: {
        number: data.number,
        category: receiptsSchema.properties.category.enum.includes(
          data.category
        )
          ? data.category
          : null,
        date: new Date(data.date).toISOString(),
        time: data.time,
        from: data.from,
        subtotal: data.subtotal,
        tax: data.tax,
        tip: data.tip,
        total: data.total,
        items: {
          deleteMany: {
            receiptId: data.id,
            NOT: data.items?.map((item: any) => ({
              id: item.id,
            })),
          },
          upsert: data.items?.map((item: any) => ({
            where: {
              id: item.id,
              receiptId: data.id,
            },
            create: {
              description:
                item.description.length > 0 ? item.description : null,
              quantity: item.quantity,
              amount: item.amount,
            },
            update: {
              description:
                item.description.length > 0 ? item.description : null,
              quantity: item.quantity,
              amount: item.amount,
            },
          })),
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Receipt not updated" }, { status: 422 });
  }

  return NextResponse.json("Receipt updated", { status: 200 });
}
