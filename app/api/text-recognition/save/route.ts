import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session?.user.id;

  const { uuid, text } = await req.json();

  if (!uuid || !text) {
    return NextResponse.json(
      { error: "No UUID nor text provided" },
      { status: 400 }
    );
  }

  const updatedExtraction = await prisma.extraction.updateMany({
    where: {
      id: uuid,
      userId: userUUID,
      status: Status.TO_RECOGNIZE,
    },
    data: {
      text,
      status: Status.TO_EXTRACT,
    },
  });

  if (!updatedExtraction.count) {
    return NextResponse.json(
      { error: "Extraction not found or not updated" },
      { status: 404 }
    );
  }
  return NextResponse.json({ message: "Extraction updated" }, { status: 200 });
}
