import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { textRecognitionSchema } from "@/lib/validations/text-recognition";
import { log } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Text Recognition", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json()) as z.infer<typeof textRecognitionSchema>;

  if (!validateBody(body, textRecognitionSchema)) {
    log.warn("Text Recognition", req.method, "Invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    await prisma.extraction.update({
      where: {
        id: body.id,
        userId: user.id,
        status: Status.TO_RECOGNIZE,
      },
      data: {
        text: body.text,
        status: Status.TO_EXTRACT,
      },
    });
  } catch (error) {
    log.warn("Text Recognition", req.method, "Failed to update extraction");
    log.debug(
      "Text Recognition",
      req.method,
      "Failed to update extraction",
      error
    );
    return NextResponse.json(
      { error: "Extraction not found or not updated" },
      { status: 404 }
    );
  }

  log.debug("Text Recognition", req.method, "Request success");
  return NextResponse.json({ message: "Extraction updated" }, { status: 200 });
}
