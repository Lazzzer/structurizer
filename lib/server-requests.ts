import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Preferences, Status } from "@prisma/client";
import { getUser } from "./session";
import { categories } from "./data-categories";

export async function getPreferences() {
  const user = await getUser();
  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user!.id,
    },
  });
  return preferences!;
}

export async function getObjectUrl(id: string) {
  const res = await fetch(`${process.env.APP_URL}/api/signed-url?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: headers().get("cookie") ?? "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getText(url: string) {
  const res = await fetch(
    `${process.env.LLM_STRUCTURIZER_URL}/v1/parsers/pdf/url`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (res.status === 422) {
    return "";
  }

  if (!res.ok) {
    throw new Error("Failed to do text recognition");
  }

  const { content } = await res.json();
  return content;
}

export async function getExtraction(id: string, status: Status) {
  const user = await getUser();
  if (!user) {
    throw new Error("Cannot authenticate user");
  }

  const extractionData = await prisma.extraction.findFirst({
    where: {
      id,
      userId: user.id,
      status,
    },
  });

  if (!extractionData) {
    throw new Error("Failed to fetch data");
  }

  return extractionData;
}

export async function getExtractions(status: Status) {
  const user = await getUser();
  if (!user) {
    throw new Error("Cannot authenticate user");
  }

  const extractions = await prisma.extraction.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      user: {
        id: user.id,
      },
      status: status,
    },
  });

  return extractions;
}

export async function getStructuredData(
  preferences: Preferences,
  text: string,
  category: string,
  refine = false
) {
  const exampleExtraction = refine
    ? null
    : await getExampleExtraction(preferences, category);

  if (exampleExtraction) {
    const data = {
      model: {
        apiKey: process.env.OPENAI_API_KEY as string,
        name: preferences?.extractionModel ?? "gpt-3.5-turbo-16k",
      },
      text: text,
      exampleInput: exampleExtraction.text,
      exampleOutput: JSON.stringify(exampleExtraction.json),
    };
    return await fetchStructuredData("example", data);
  } else {
    const data = {
      model: {
        apiKey: process.env.OPENAI_API_KEY as string,
        name: preferences?.extractionModel ?? "gpt-3.5-turbo-16k",
      },
      text: text,
      jsonSchema: JSON.stringify(categories.get(category)!.schema),
      refine,
    };
    return await fetchStructuredData("schema", data);
  }
}

async function getExampleExtraction(
  preferences: Preferences,
  category: string
) {
  let exampleExtraction;
  try {
    switch (category) {
      case "invoices":
        exampleExtraction = preferences.invoiceExampleExtractionId
          ? await getExtraction(
              preferences.invoiceExampleExtractionId,
              Status.PROCESSED
            )
          : null;
        break;
      case "receipts":
        exampleExtraction = preferences.receiptExampleExtractionId
          ? await getExtraction(
              preferences.receiptExampleExtractionId,
              Status.PROCESSED
            )
          : null;
        break;
      case "credit card statements":
        exampleExtraction = preferences.cardStatementExampleExtractionId
          ? await getExtraction(
              preferences.cardStatementExampleExtractionId,
              Status.PROCESSED
            )
          : null;
        break;
      default:
        exampleExtraction = null;
    }
  } catch (e) {
    exampleExtraction = null;
  }
  return exampleExtraction;
}

async function fetchStructuredData(method: "schema" | "example", data: object) {
  return await fetch(
    `${process.env.LLM_STRUCTURIZER_URL}/v1/structured-data/json/${method}`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}
