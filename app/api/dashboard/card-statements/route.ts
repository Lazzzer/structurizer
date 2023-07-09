import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cardStatementUUID = searchParams.get("uuid");
  const userUUID = session?.user.id;

  if (!cardStatementUUID) {
    return NextResponse.json({ error: "No UUID provided" }, { status: 400 });
  }

  const cardStatement = await prisma.cardStatement.findFirst({
    where: {
      id: cardStatementUUID,
      userId: userUUID,
    },
    include: {
      transactions: true,
    },
  });

  if (!cardStatement) {
    return NextResponse.json(
      { error: "cardStatement not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(cardStatement, { status: 200 });
}

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
    await prisma.cardStatement.updateMany({
      where: {
        id: jsonObj.id,
        userId: userUUID,
      },
      data: {
        creditCardName: jsonObj.creditCardName,
        creditCardHolder: jsonObj.creditCardHolder,
        creditCardNumber: jsonObj.creditCardNumber,
        issuerName: jsonObj.issuerName,
        issuerAddress: jsonObj.issuerAddress,
        recipientName: jsonObj.recipientName,
        recipientAddress: jsonObj.recipientAddress,
        date: new Date(jsonObj.date).toISOString(),
        currency: jsonObj.currency,
        totalAmountDue: parseFloat(jsonObj.totalAmountDue),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "cardStatement not created, bad data" },
      { status: 400 }
    );
  }

  try {
    await prisma.cardTransaction.deleteMany({
      where: {
        cardStatementId: jsonObj.id,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not delete cardStatement items" },
      { status: 400 }
    );
  }

  try {
    await prisma.cardTransaction.createMany({
      data: jsonObj.transactions?.map((transaction: any) => ({
        cardStatementId: jsonObj.id,
        description: transaction.description,
        category: transaction.category,
        amount: parseFloat(transaction.amount),
      })),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not create cardStatement items" },
      { status: 400 }
    );
  }

  return NextResponse.json("cardStatement updated", { status: 200 });
}
