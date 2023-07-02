import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session?.user.id;

  const jsonObj = await req.json();

  if (!jsonObj) {
    return NextResponse.json({ error: "No JSON provided" }, { status: 400 });
  }

  try {
    await prisma.receipt.updateMany({
      where: {
        id: jsonObj.id,
        userId: userUUID,
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
