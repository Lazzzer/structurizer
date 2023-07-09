import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { deleteObject } from "@/lib/s3";

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const extractionId = searchParams.get("id");

  const schema = z.object({
    id: z.string().uuid(),
  });

  const { success } = schema.safeParse({ id: extractionId });
  if (!success) {
    return NextResponse.json(
      { error: "Invalid Extraction id" },
      { status: 400 }
    );
  }

  const extraction = await prisma.extraction.findFirst({
    where: {
      id: extractionId!,
      userId: user.id,
    },
  });

  if (!extraction) {
    return NextResponse.json(
      { error: "Extraction not found" },
      { status: 404 }
    );
  }

  try {
    await deleteObject(extraction.objectPath);
    await prisma.extraction.delete({
      where: {
        id: extraction.id,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Error deleting corresponding file" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "extraction deleted" }, { status: 200 });
}