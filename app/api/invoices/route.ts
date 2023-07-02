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
  const invoiceUUID = searchParams.get("uuid");
  const userUUID = session?.user.id;

  if (!invoiceUUID) {
    return NextResponse.json({ error: "No UUID provided" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceUUID,
      userId: userUUID,
    },
    include: {
      items: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice, { status: 200 });
}
