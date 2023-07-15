import { getUser } from "@/lib/session";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as z from "zod";
import { categories } from "@/lib/data-categories";
import { validateBody } from "@/lib/validations/request";
import { getStructuredData } from "@/lib/server-requests";
import { log } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Data extraction", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    text: z.string().min(1),
    category: z.string().refine((category) => categories.has(category)),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    log.warn("Data extraction", req.method, "Invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user.id,
    },
  });

  let res = await getStructuredData(preferences!, body.text, body.category);

  // Using the refine method if the first result wasn't a parsable JSON
  if (res.status === 422) {
    log.warn(
      "Data extraction",
      req.method,
      "Failed initial request, using refine method"
    );
    res = await getStructuredData(preferences!, body.text, body.category, true);
  }

  if (!res.ok) {
    log.warn("Data extraction", req.method, "Failed Data extraction request");
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { output } = await res.json();

  log.debug("Data extraction", req.method, "Request success");
  return NextResponse.json(output, { status: 201 });
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) {
    log.warn("Data extraction", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    id: z.string().uuid(),
    json: z.string(),
    category: z.string().refine((category) => categories.has(category)),
  });

  const body = (await req.json()) as z.infer<typeof schema>;

  if (!validateBody(body, schema)) {
    log.warn("Data extraction", req.method, "Invalid body");
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
    log.warn("Data extraction", req.method, "Failed to update extraction");
    log.debug(
      "Data extraction",
      req.method,
      "Failed to update extraction",
      error
    );
    return NextResponse.json(
      { error: "Extraction not found or not updated" },
      { status: 404 }
    );
  }

  log.debug("Data extraction", req.method, "Extraction updated");
  return NextResponse.json({ message: "Extraction updated" }, { status: 200 });
}
