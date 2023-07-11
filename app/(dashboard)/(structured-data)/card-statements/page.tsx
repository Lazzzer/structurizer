import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { CardStatement, categories, columns } from "./columns";
import { getMonthNames } from "@/lib/utils";
import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import type {
  AverageMonthlyExpensesResult,
  FormattedAverageMonthlyExpensesResult,
} from "types";
import { MonthlyExpensesBarChart } from "../components/bar-chart";
import { CategoryDistributionChart } from "../components/pie-chart";
import { Statistics } from "../components/statistics";
import { EmptyDataDisplay } from "../components/empty-data-display";

export const metadata: Metadata = {
  title: "Card Statements",
  description: "Main page to view processed card statements",
};

async function getData() {
  const user = await getUser();
  const cardStatements = await prisma.cardStatement.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      user: {
        id: user!.id,
      },
    },
    include: {
      extraction: true,
    },
  });

  if (cardStatements.length === 0) {
    return null;
  }

  const rawAverageMonthlyExpenses: AverageMonthlyExpensesResult[] =
    await prisma.$queryRaw`
    WITH months AS (SELECT generate_series(1,12) AS month),
    cardStatements AS (
      SELECT
        COALESCE(EXTRACT(MONTH FROM date), 0) AS month,
        AVG("totalAmountDue") AS average
      FROM "CardStatement"
      WHERE "userId" = ${user!.id}
      GROUP BY EXTRACT(MONTH FROM date)
    )
    SELECT
      months.month,
      COALESCE(cardStatements.average, 0) AS average
    FROM months
    LEFT JOIN cardStatements ON months.month = cardStatements.month
    ORDER BY month
  `;

  const averageMonthlyExpenses: FormattedAverageMonthlyExpensesResult[] =
    rawAverageMonthlyExpenses.map((m: AverageMonthlyExpensesResult) => {
      const { shortName, longName } = getMonthNames(m.month);
      return {
        name: shortName,
        fullName: longName,
        value: m.average,
      };
    });

  const categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[] = await prisma.$queryRaw`
    SELECT 
      t.category,
      COUNT(t.category) as count,
      COUNT(t.category) * 100.0 / (
        SELECT COUNT(*) 
        FROM "CardTransaction" as t
        JOIN "CardStatement" as s ON t."cardStatementId" = s.id 
        WHERE s."userId" = ${user!.id}
      ) as percentage
    FROM "CardTransaction" as t
    JOIN "CardStatement" as s ON t."cardStatementId" = s.id
    WHERE s."userId" = ${user!.id}
    GROUP BY t.category
  `;

  const highestTotalAmount = await prisma.cardStatement.aggregate({
    where: {
      userId: user!.id,
    },
    _max: {
      totalAmountDue: true,
    },
  });

  const mostExpensiveCategory: {
    category: string;
    totalamount: number;
  }[] = await prisma.$queryRaw`
    SELECT 
      t.category,
      SUM(t.amount) as totalAmount
    FROM "CardTransaction" as t
    JOIN "CardStatement" as s ON t."cardStatementId" = s.id
    WHERE s."userId" = ${user!.id}
    GROUP BY t.category
    ORDER BY totalAmount DESC
    LIMIT 1
  `;

  const mostRecurrentTransaction: {
    description: string;
    count: number;
  }[] = await prisma.$queryRaw`
    SELECT 
      t.description,
      COUNT(t.description) as count
    FROM "CardTransaction" as t
    JOIN "CardStatement" as s ON t."cardStatementId" = s.id
    WHERE s."userId" = ${user!.id}
    GROUP BY t.description
    ORDER BY count DESC
    LIMIT 1
  `;

  const response = {
    cardStatements,
    averageMonthlyExpenses,
    categoryDistribution: categoryDistribution.map((item) => ({
      category: item.category,
      percentage: parseFloat(item.percentage.toFixed(2)),
    })),
    highestTotalAmount: {
      total: highestTotalAmount._max.totalAmountDue,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0].totalamount,
    },
    mostRecurrentTransaction: {
      transaction: mostRecurrentTransaction[0].description,
      count: mostRecurrentTransaction[0].count,
    },
  };
  return response;
}

export default async function CardStatementsPage() {
  const data = await getData();
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Card Statements" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <div className="w-full h-72 2xl:h-[450px]">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Overview</h2>
          {!data ? (
            <EmptyDataDisplay />
          ) : (
            <div className="w-full h-full grid grid-cols-8 gap-3">
              <div className="w-full h-full col-span-3">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Average Monthly Expenses
                </h3>
                <div className="w-full h-[228px] 2xl:h-[356px] border border-slate-200 rounded-md pr-3 pt-6 pb-2 2xl:pt-10 2xl:pb-4">
                  <MonthlyExpensesBarChart
                    data={data.averageMonthlyExpenses}
                    color="#14b8a6"
                  />
                </div>
              </div>
              <div className="w-full h-[228px] 2xl:h-[356px] col-span-3">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Category Distribution
                </h3>
                <CategoryDistributionChart
                  data={data.categoryDistribution}
                  categories={categories}
                />
              </div>
              <div className="w-full h-[228px] 2xl:h-[356px] col-span-2">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Statistics
                </h3>
                <Statistics
                  first={{
                    title: "Highest Total Amount",
                    data: data.highestTotalAmount.total?.toFixed(2),
                  }}
                  second={{
                    title: "Most Expensive Category",
                    data: {
                      categories: categories,
                      category: data.mostExpensiveCategory.category,
                    },
                  }}
                  third={{
                    title: "Most Recurrent Transaction",
                    data: data.mostRecurrentTransaction.transaction,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DataTable
          title="All Card Statements"
          pageSize={10}
          emptyMessage="No Card Statements extracted yet."
          filterColumn={{
            columnId: "issuerName",
            placeholder: "Filter by Issuer",
          }}
          columns={columns}
          data={data ? (data.cardStatements as CardStatement[]) : []}
        />
      </div>
    </div>
  );
}
