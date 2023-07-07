import {
  cardStatementsSchema,
  invoicesSchema,
  receiptsSchema,
} from "@/lib/llm/schema";
import { getUser } from "@/lib/session";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { text, category } = await req.json();

  if (!text || !category) {
    return NextResponse.json(
      { error: "No text or category provided" },
      { status: 400 }
    );
  }

  let schema = {};
  switch (category) {
    case "receipts": {
      schema = receiptsSchema;
      break;
    }
    case "invoices": {
      schema = invoicesSchema;
      break;
    }
    case "credit card statements": {
      schema = cardStatementsSchema;
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 400 }
      );
  }

  let res = await fetch(
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
        jsonSchema: JSON.stringify(schema),
        text,
      }),
    }
  );

  if (res.status === 422) {
    res = await fetch(
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
          jsonSchema: JSON.stringify(schema),
          text,
          refine: true,
        }),
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: res.statusText },
        { status: res.status }
      );
    }
  } else if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { output } = await res.json();

  return NextResponse.json(output, { status: 201 });
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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
      userId: user.id,
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
