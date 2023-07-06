import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { getUser } from "@/lib/session";
import * as z from "zod";
import { validateBody } from "@/lib/validations/request";

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    id: z.string().uuid(),
    text: z.string().nonempty(),
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
        status: Status.TO_RECOGNIZE,
      },
      data: {
        text: body.text,
        status: Status.TO_EXTRACT,
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
