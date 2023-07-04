import { preferencesSchema } from "@/lib/validations/preferences";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { getUser } from "../lib/user";

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
