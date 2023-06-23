import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const extractionUUID = searchParams.get("uuid");
  const userUUID = session?.user.id;

  if (!extractionUUID) {
    return NextResponse.json(
      { error: "No extraction UUID provided" },
      { status: 400 }
    );
  }

  const extraction = await prisma.extraction.findFirst({
    where: {
      id: extractionUUID,
      userId: userUUID,
      status: "TO_RECOGNIZE",
    },
  });

  if (!extraction) {
    return NextResponse.json(
      { error: "Extraction not found" },
      { status: 404 }
    );
  }

  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET as string,
    Key: extraction.objectPath,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json(
    {
      uuid: extraction.id,
      filename: extraction.filename,
      url,
    },
    { status: 200 }
  );
}
