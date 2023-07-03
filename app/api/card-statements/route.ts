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
