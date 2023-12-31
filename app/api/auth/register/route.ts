import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { authSchema } from "@/lib/validations/auth";
import prisma from "@/lib/prisma";

import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { log } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as z.infer<typeof authSchema>;

  if (!validateBody(body, authSchema)) {
    log.warn("Auth", "Failed registration attempt, invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const exists = await prisma.user.findFirst({
    where: {
      name: {
        equals: body.name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (exists) {
    log.warn("Auth", "Failed registration attempt, name already taken");
    return NextResponse.json(
      { error: "Name is already taken" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      password: await hash(body.password, 10),
      preferences: {
        create: {
          classificationModel: "gpt-3.5-turbo-16k",
          extractionModel: "gpt-3.5-turbo-16k",
          analysisModel: "gpt-4",
        },
      },
    },
  });

  log.debug("Auth", `New user registered`);
  return NextResponse.json(
    {
      message: "User created",
      id: user.id,
    },
    { status: 201 }
  );
}
