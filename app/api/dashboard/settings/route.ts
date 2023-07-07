import { preferencesSchema } from "@/lib/validations/preferences";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { getUser } from "@/lib/session";
import { deleteUserFolder } from "@/lib/s3";

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json()) as z.infer<typeof preferencesSchema>;
  if (!validateBody(body, preferencesSchema)) {
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
    return NextResponse.json(
      {
        message: "Preferences updated",
        id: updatedPreferences.id,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Preferences could not be updated" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const extractions = await prisma.extraction.findMany({
    where: {
      userId: user.id,
    },
  });

  const count = await deleteUserFolder(user.id);
  if (count !== extractions.length) {
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
    return NextResponse.json("User deleted", { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "User could not be deleted" },
      { status: 500 }
    );
  }
}
