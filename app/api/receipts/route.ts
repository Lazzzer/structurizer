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
  const receiptUUID = searchParams.get("uuid");
  const userUUID = session?.user.id;

  if (!receiptUUID) {
    return NextResponse.json({ error: "No UUID provided" }, { status: 400 });
  }

  const receipt = await prisma.receipt.findFirst({
    where: {
      id: receiptUUID,
      userId: userUUID,
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
