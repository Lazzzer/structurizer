import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { deleteObject } from "@/lib/s3";
import { log } from "@/lib/utils";

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Extraction", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const extractionId = searchParams.get("id");

  const schema = z.object({
    id: z.string().uuid(),
  });

  const { success } = schema.safeParse({ id: extractionId });
  if (!success) {
    log.warn("Extraction", req.method, "Failed request, invalid id");
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
    log.warn("Extraction", req.method, "Extraction not found");
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
    log.error("Extraction", req.method, "Error deleting", extractionId, e);
    return NextResponse.json(
      { error: "Error deleting corresponding file" },
      { status: 500 }
    );
  }

  log.debug("Extraction", req.method, "Deleted", extractionId);
  return NextResponse.json({ message: "extraction deleted" }, { status: 200 });
}
