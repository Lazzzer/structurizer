import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import { uploadFile } from "@/lib/s3";
import { log } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Upload", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    log.warn("Upload", req.method, "Invalid content type");
    return NextResponse.json(
      { error: "Content type must be multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      log.warn("Upload", req.method, "No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = file as Blob;
    const buffer = Buffer.from(await blob.arrayBuffer());
    const fileId = randomUUID();
    const key = `${user.id}/${fileId}`;

    try {
      await uploadFile(buffer, key, blob.type);
    } catch (e) {
      log.error("Upload", req.method, "Could not upload file", e);
      return NextResponse.json(
        { error: "Could not upload file" },
        { status: 500 }
      );
    }

    const extraction = await prisma.extraction.create({
      data: {
        filename: blob.name,
        objectPath: key,
        user: {
          connect: { id: user.id },
        },
      },
    });

    log.debug("Upload", req.method, "Request success");
    return NextResponse.json(
      {
        message: {
          id: extraction.id,
          filename: blob.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    log.warn("Upload", req.method, "Could not parse formData");
    return NextResponse.json(
      { error: "Could not parse formData" },
      { status: 400 }
    );
  }
}
