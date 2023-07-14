import { categories } from "@/lib/data-categories";
import { getUser } from "@/lib/session";
import { validateBody } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { fetchFromService } from "@/lib/server-requests";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    text: z.string().min(1),
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

  const data = {
    model: {
      apiKey: process.env.OPENAI_API_KEY as string,
      name: preferences!.classificationModel ?? "gpt-3.5-turbo-16k",
    },
    categories: Array.from(categories.keys()),
    text: body.text,
  };
  const res = await fetchFromService("classification", data);

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { classification } = await res.json();
  return NextResponse.json(classification, { status: 200 });
}
