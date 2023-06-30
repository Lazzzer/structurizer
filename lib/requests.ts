import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function getS3ObjectUrl(uuid: string) {
  const res = await fetch(
    `${process.env.APP_URL}/api/signed-url?uuid=${uuid}`,
    {
      method: "GET",
      headers: {
        Cookie: headers().get("cookie") ?? "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getText(url: string) {
  const res = await fetch(
    `${process.env.LLM_STRUCTURIZER_URL}/v1/parsers/pdf/url`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (res.status === 422) {
    return "";
  }

  if (!res.ok) {
    throw new Error("Failed to do text recognition");
  }

  const { content } = await res.json();
  return content;
}

export async function getExtractionData(uuid: string, status: Status) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }
  const userUUID = session?.user.id;

  const extractionData = await prisma.extraction.findFirst({
    where: {
      id: uuid,
      userId: userUUID,
      status,
    },
  });

  if (!extractionData) {
    throw new Error("Failed to fetch data");
  }

  return extractionData;
}

export async function getExtractions(status: Status) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }
  const userUUID = session?.user.id;
  const extractions = await prisma.extraction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
      status: status,
    },
  });

  return extractions;
}

export async function getReceipts() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }
  const userUUID = session?.user.id;
  const receipts = await prisma.receipt.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
    },
    include: {
      extraction: true,
    },
  });

  console.log(receipts);

  return receipts;
}
