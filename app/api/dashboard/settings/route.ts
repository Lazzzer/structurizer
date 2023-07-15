import { preferencesSchema } from "@/lib/validations/preferences";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { getUser } from "@/lib/session";
import { deleteUserFolder } from "@/lib/s3";
import { log } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Settings", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json()) as z.infer<typeof preferencesSchema>;
  if (!validateBody(body, preferencesSchema)) {
    log.warn("Settings", req.method, "Failed request, invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const updatedPreferences = await prisma.preferences.update({
      where: {
        userId: user.id,
      },
      data: {
        classificationModel: body.classificationModel,
        extractionModel: body.extractionModel,
        analysisModel: body.analysisModel,
        receiptExampleExtractionId: body.enableReceiptsOneShot
          ? body.receiptExampleExtractionId
          : null,
        invoiceExampleExtractionId: body.enableInvoicesOneShot
          ? body.invoiceExampleExtractionId
          : null,
        cardStatementExampleExtractionId: body.enableCardStatementsOneShot
          ? body.cardStatementExampleExtractionId
          : null,
      },
    });
    log.debug("Settings", req.method, "Preferences updated", user.id);
    return NextResponse.json(
      {
        message: "Preferences updated",
        id: updatedPreferences.id,
      },
      { status: 200 }
    );
  } catch (e) {
    log.error("Settings", req.method, "Failed to update", user.id, e);
    return NextResponse.json(
      { error: "Preferences could not be updated" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const user = await getUser();
  if (!user) {
    log.warn("Settings", "DELETE", "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const extractions = await prisma.extraction.findMany({
    where: {
      userId: user.id,
    },
  });

  const count = await deleteUserFolder(user.id);
  if (count !== extractions.length) {
    log.error(
      "Settings",
      "DELETE",
      "Failed to delete all files in bucket",
      user.id
    );
    return NextResponse.json(
      { error: "Not all files could be deleted" },
      { status: 500 }
    );
  }

  try {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    log.debug("Settings", "DELETE", "Account deleted", user.id);
    return NextResponse.json("User deleted", { status: 200 });
  } catch (e) {
    log.error("Settings", "DELETE", "Failed to delete user", user.id, e);
    return NextResponse.json(
      { error: "User could not be deleted" },
      { status: 500 }
    );
  }
}
