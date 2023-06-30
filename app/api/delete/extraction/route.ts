import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const extractionUUID = searchParams.get("uuid");
  const userUUID = session?.user.id;

  if (!extractionUUID) {
    return NextResponse.json(
      { error: "No UUID of data provided" },
      { status: 400 }
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

  const extraction = await prisma.extraction.findFirst({
    where: {
      id: extractionUUID,
      userId: userUUID,
    },
  });

  if (!extraction) {
    return NextResponse.json(
      { error: "Extraction not found" },
      { status: 404 }
    );
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET as string,
    Key: extraction.objectPath,
  });

  try {
    const response = await s3.send(command);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting corresponding file" },
      { status: 500 }
    );
  }

  const deletedExtraction = await prisma.extraction.delete({
    where: {
      id: extraction.id,
    },
  });

  return NextResponse.json({ message: "extraction deleted" }, { status: 200 });
}
