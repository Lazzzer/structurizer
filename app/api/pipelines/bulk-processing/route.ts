import { getUser } from "@/lib/session";
import { validateBody } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import {
  fetchFromService,
  getObjectUrl,
  getStructuredData,
  getText,
} from "@/lib/server-requests";
import { Status } from "@prisma/client";
import { categories } from "@/lib/data-categories";
import { log } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Bulk Processing", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    ids: z.array(z.string().uuid()).min(1),
  });

  const body = (await req.json()) as z.infer<typeof schema>;
  if (!validateBody(body, schema)) {
    log.warn("Bulk Processing", req.method, "Invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user.id,
    },
  });

  let ids = body.ids;
  const textRecognitionPromises = ids.map(async (id) => {
    const data = await getObjectUrl(id);
    const text = await getText(data.url);

    if (text === "") {
      log.warn("Bulk Processing", req.method, "Empty text", id);
      throw new Error("Empty text");
    }
    return await prisma.extraction.update({
      where: {
        id: id,
        userId: user.id,
        status: Status.TO_RECOGNIZE,
      },
      data: {
        text,
        status: Status.TO_EXTRACT,
      },
    });
  });

  const textRecognitionResults = await Promise.allSettled(
    textRecognitionPromises
  );

  ids = ids.filter((id, index) => {
    if (textRecognitionResults[index].status === "rejected") {
      log.warn("Bulk Processing", req.method, "Failed Text Recognition", id);
      return false;
    }
    return true;
  });

  const dataExtractionPromises = ids.map(async (id) => {
    const extraction = await prisma.extraction.findFirst({
      where: {
        id: id,
        userId: user.id,
        status: Status.TO_EXTRACT,
      },
    });

    if (!extraction) {
      log.warn("Bulk Processing", req.method, "Extraction not found", id);
      throw new Error("Extraction not found");
    }

    const data = {
      model: {
        apiKey: process.env.OPENAI_API_KEY as string,
        name: preferences?.classificationModel ?? "gpt-3.5-turbo-16k",
      },
      categories: Array.from(categories.keys()),
      text: extraction.text,
    };

    const classificationResponse = await fetchFromService(
      "classification",
      data
    );

    if (!classificationResponse.ok) {
      log.warn(
        "Bulk Processing",
        req.method,
        "Failed classification request",
        id
      );
      throw new Error("Cannot classify text");
    }

    const { classification } = await classificationResponse.json();

    if (
      !classification.classification ||
      !categories.has(classification.classification)
    ) {
      log.warn(
        "Bulk Processing",
        req.method,
        "No valid classification found",
        id
      );
      throw new Error("No classification found");
    }

    const dataExtractionResponse = await getStructuredData(
      preferences!,
      extraction.text!,
      classification.classification
    );

    if (!dataExtractionResponse.ok) {
      log.warn(
        "Bulk Processing",
        req.method,
        "Failed data extraction request",
        id
      );
      throw new Error("Cannot extract data");
    }
    const { output } = await dataExtractionResponse.json();
    return await prisma.extraction.update({
      where: {
        id: id,
        userId: user.id,
        status: Status.TO_EXTRACT,
      },
      data: {
        json: output,
        category: classification.classification,
        status: Status.TO_VERIFY,
      },
    });
  });

  const dataExtractionResults = await Promise.allSettled(
    dataExtractionPromises
  );

  ids = ids.filter((id, index) => {
    if (dataExtractionResults[index].status === "rejected") {
      log.warn("Bulk Processing", req.method, "Failed Data Extraction", id);
      return false;
    }
    return true;
  });

  log.info(
    "Bulk Processing",
    req.method,
    `Processed ${body.ids.length} file(s), ${ids.length} awaiting verification`
  );
  return NextResponse.json(
    {
      message: "Bulk processing done",
    },
    { status: 200 }
  );
}
