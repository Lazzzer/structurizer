import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";

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
    return NextResponse.json(
      { error: "Invalid Extraction id" },
      { status: 400 }
    );
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

  const jsonObj = await req.json();

  if (!jsonObj) {
    return NextResponse.json({ error: "No JSON provided" }, { status: 400 });
  }

  try {
    await prisma.receipt.updateMany({
      where: {
        id: jsonObj.id,
        userId: user.id,
      },
      data: {
        number: jsonObj.number,
        category: jsonObj.category,
        date: new Date(jsonObj.date).toISOString(),
        time: jsonObj.time,
        from: jsonObj.from,
        subtotal: parseFloat(jsonObj.subtotal),
        tax: parseFloat(jsonObj.tax),
        tip: parseFloat(jsonObj.tip),
        total: parseFloat(jsonObj.total),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Receipt not created, bad data" },
      { status: 400 }
    );
  }

  try {
    await prisma.receiptItem.deleteMany({
      where: {
        receiptId: jsonObj.id,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not delete receipt items" },
      { status: 400 }
    );
  }

  try {
    await prisma.receiptItem.createMany({
      data: jsonObj.items?.map((item: any) => ({
        receiptId: jsonObj.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        amount: parseFloat(item.amount),
      })),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not create receipt items" },
      { status: 400 }
    );
  }

  return NextResponse.json("receipt updated", { status: 200 });
}
