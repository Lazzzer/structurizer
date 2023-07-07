import { getUser } from "@/lib/session";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as z from "zod";
import { categories } from "@/lib/data-categories";
import { validateBody } from "@/lib/validations/request";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    text: z.string().min(1),
    category: z.string().refine((category) => categories.has(category)),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user.id,
    },
  });

  async function fetchData(refine = false) {
    const response = await fetch(
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
            name: preferences?.extractionModel ?? "gpt-3.5-turbo-16k",
          },
          jsonSchema: JSON.stringify(categories.get(body.category)!.schema),
          text: body.text,
          refine,
        }),
      }
    );

    return response;
  }

  let res = await fetchData();

  // Using the refine method if the first result wasn't a parsable JSON
  if (res.status === 422) {
    res = await fetchData(true);
  }

  if (!res.ok) {
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

  const schema = z.object({
    id: z.string().uuid(),
    json: z.string(), //TODO: Use zod to validate each category with json schema
    category: z.string().refine((category) => categories.has(category)),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    await prisma.extraction.update({
      where: {
        id: body.id,
        userId: user.id,
        status: Status.TO_EXTRACT,
      },
      data: {
        json: body.json,
        category: categories.get(body.category)!.value,
        status: Status.TO_VERIFY,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Extraction not found or not updated" },
      { status: 404 }
    );
  }
  return NextResponse.json({ message: "Extraction updated" }, { status: 200 });
}
