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
    await prisma.invoice.updateMany({
      where: {
        id: jsonObj.id,
        userId: userUUID,
      },
      data: {
        invoiceNumber: jsonObj.invoiceNumber,
        date: new Date(jsonObj.date).toISOString(),
        category: jsonObj.category,
        fromName: jsonObj.fromName,
        fromAddress: jsonObj.fromAddress,
        toName: jsonObj.toName,
        toAddress: jsonObj.toAddress,
        currency: jsonObj.currency,
        totalAmountDue: parseFloat(jsonObj.totalAmountDue),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "invoice not created, bad data" },
      { status: 400 }
    );
  }

  try {
    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: jsonObj.id,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not delete invoice items" },
      { status: 400 }
    );
  }

  try {
    await prisma.invoiceItem.createMany({
      data: jsonObj.items?.map((item: any) => ({
        invoiceId: jsonObj.id,
        description: item.description,
        amount: parseFloat(item.amount),
      })),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not create invoice items" },
      { status: 400 }
    );
  }

  return NextResponse.json("invoice updated", { status: 200 });
}
