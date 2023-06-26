import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session?.user.id;

  const { uuid, json, category } = await req.json();

  if (!uuid || !json || !category) {
    return NextResponse.json(
      { error: "No UUID or JSON or category provided" },
      { status: 400 }
    );
  }

  switch (category) {
    case "receipts": {
      break;
    }
    case "invoices": {
      break;
    }
    case "credit card statements": {
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 400 }
      );
  }

  const updatedExtraction = await prisma.extraction.updateMany({
    where: {
      id: uuid,
      userId: userUUID,
      status: Status.TO_EXTRACT,
    },
    data: {
      json,
      category,
      status: Status.TO_VERIFY,
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
