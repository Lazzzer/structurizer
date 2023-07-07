import { getUser } from "@/lib/session";
import { validateBody } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { getS3ObjectUrl, getText } from "@/lib/requests";
import { Status } from "@prisma/client";
import { categories } from "@/lib/data-categories";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    ids: z.array(z.string().min(1)),
  });

  const body = (await req.json()) as z.infer<typeof schema>;
  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const textRecognitionPromises = body.ids.map(async (id) => {
    const data = await getS3ObjectUrl(id);
    const text = await getText(data.url);

    if (text === "") {
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

  textRecognitionResults.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Error processing id ${body.ids[index]}: ${result.reason}`);
    }
  });

  const dataExtractionPromises = body.ids.map(async (id) => {
    const extraction = await prisma.extraction.findFirst({
      where: {
        id: id,
        userId: user.id,
        status: Status.TO_EXTRACT,
      },
    });

    if (!extraction) {
      throw new Error("Extraction not found");
    }

    // TODO: Add model from user preferences
    const classificationResponse = await fetch(
      `${process.env.LLM_STRUCTURIZER_URL}/v1/structured-data/json/classification`,
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.X_API_KEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: {
            apiKey: process.env.OPENAI_API_KEY as string,
            name: "gpt-3.5-turbo-16k",
          },
          categories: Array.from(categories.keys()),
          text: extraction.text,
        }),
      }
    );

    if (!classificationResponse.ok) {
      throw new Error("Cannot classify text");
    }

    const { classification } = await classificationResponse.json();

    if (
      !classification.classification ||
      !categories.has(classification.classification)
    ) {
      throw new Error("No classification found");
    }

    // TODO: Add model from user preferences
    const dataExtractionResponse = await fetch(
      `${process.env.LLM_STRUCTURIZER_URL}/v1/structured-data/json/schema`,
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.X_API_KEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: {
            apiKey: process.env.OPENAI_API_KEY as string,
            name: "gpt-3.5-turbo-16k",
          },
          jsonSchema: JSON.stringify(
            categories.get(classification.classification)!.schema
          ),
          text: extraction.text,
        }),
      }
    );

    if (!dataExtractionResponse.ok) {
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

  dataExtractionResults.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Error processing id ${body.ids[index]}: ${result.reason}`);
    }
  });

  return NextResponse.json(
    {
      message: "Bulk processing in progress",
    },
    { status: 200 }
  );
}
