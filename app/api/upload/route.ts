import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content type must be multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = file as Blob;
    const buffer = Buffer.from(await blob.arrayBuffer());

    const s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true,
    });

    const userUUID = session?.user.id;
    const fileUUID = randomUUID();

    const s3Params = {
      Bucket: process.env.S3_BUCKET as string,
      Key: `${userUUID}/${fileUUID}`,
      Body: buffer,
      ContentType: blob.type,
    };

    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
      expiresIn: 60,
    });

    const res = await fetch(signedUrl, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not upload file" },
        { status: 500 }
      );
    }

    const extraction = await prisma.extraction.create({
      data: {
        filename: blob.name,
        objectPath: s3Params.Key,
        user: {
          connect: { id: userUUID },
        },
      },
    });

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
    return NextResponse.json(
      { error: "Could not parse content as FormData" },
      { status: 400 }
    );
  }
}
