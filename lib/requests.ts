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

  const avgMonthlyExpenses: any = await prisma.$queryRaw`
WITH months AS (
    SELECT generate_series(1,12) AS month
),
receipts AS (
    SELECT
        COALESCE(EXTRACT(MONTH FROM date), 0) AS month,
        AVG(total) AS average
    FROM
        "Receipt"
    WHERE
        "userId" = ${userUUID}
    GROUP BY
        EXTRACT(MONTH FROM date)
)
SELECT
    months.month,
    COALESCE(receipts.average, 0) AS average
FROM
    months
LEFT JOIN 
    receipts ON months.month = receipts.month
ORDER BY 
    month
`;

  const categoryCounts = await prisma.receipt.groupBy({
    by: ["category"],
    where: {
      userId: userUUID,
    },
    _count: {
      category: true,
    },
  });

  const categoryDistribution = categoryCounts.map((item) => ({
    category: item.category,
    percentage:
      receipts.length === 0
        ? 0
        : (item._count.category / receipts.length) * 100,
  }));

  const highestTotalAmount = await prisma.receipt.aggregate({
    where: {
      userId: userUUID,
    },
    _max: {
      total: true,
    },
  });

  const mostExpensiveCategory = await prisma.receipt.groupBy({
    by: ["category"],
    where: {
      userId: userUUID,
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 1,
  });

  const mostRecurrentFrom = await prisma.receipt.groupBy({
    by: ["from"],
    _count: {
      from: true,
    },
    where: {
      userId: userUUID,
    },
    orderBy: {
      from: "desc",
    },
    take: 1,
  });

  const response = {
    receipts,
    avgMonthlyExpenses,
    categoryDistribution,
    highestTotalAmount: {
      total: highestTotalAmount._max.total,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0]._sum.total,
    },
    mostRecurrentFrom: {
      from: mostRecurrentFrom[0].from,
      count: mostRecurrentFrom[0]._count.from,
    },
  };

  console.log(response);

  return response;
}
