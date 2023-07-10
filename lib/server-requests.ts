import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { getUser } from "./session";

export async function getPreferences() {
  const user = await getUser();
  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: user!.id,
    },
  });
  return preferences!;
}

export async function getObjectUrl(id: string) {
  const res = await fetch(`${process.env.APP_URL}/api/signed-url?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: headers().get("cookie") ?? "",
    },
  });

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

export async function getExtraction(id: string, status: Status) {
  const user = await getUser();
  if (!user) {
    throw new Error("Cannot authenticate user");
  }

  const extractionData = await prisma.extraction.findFirst({
    where: {
      id,
      userId: user.id,
      status,
    },
  });

  if (!extractionData) {
    throw new Error("Failed to fetch data");
  }

  return extractionData;
}

export async function getExtractions(status: Status) {
  const user = await getUser();
  if (!user) {
    throw new Error("Cannot authenticate user");
  }

  const extractions = await prisma.extraction.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      user: {
        id: user.id,
      },
      status: status,
    },
  });

  return extractions;
}
