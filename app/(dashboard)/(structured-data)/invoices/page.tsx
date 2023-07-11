import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Invoice, categories, columns } from "./columns";
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
  title: "Invoices",
  description: "Main page to view processed invoices",
};

export async function getData() {
  const user = await getUser();
  const invoices = await prisma.invoice.findMany({
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

  if (invoices.length === 0) {
    return null;
  }

  const rawAverageMonthlyExpenses: AverageMonthlyExpensesResult[] =
    await prisma.$queryRaw`
    WITH months AS (SELECT generate_series(1,12) AS month),
    invoices AS (
    SELECT
      COALESCE(EXTRACT(MONTH FROM date), 0) AS month,
      AVG("totalAmountDue") AS average
    FROM "Invoice"
    WHERE "userId" = ${user!.id}
    GROUP BY EXTRACT(MONTH FROM date)
    )
    SELECT
      months.month,
      COALESCE(invoices.average, 0) AS average
    FROM months
    LEFT JOIN invoices ON months.month = invoices.month
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

  const categoryCounts = await prisma.invoice.groupBy({
    by: ["category"],
    where: {
      userId: user!.id,
    },
    _count: {
      category: true,
    },
  });

  const categoryDistribution = categoryCounts.map((item) => ({
    category: item.category,
    percentage:
      invoices.length === 0
        ? 0
        : (item._count.category / invoices.length) * 100,
  }));

  const highestTotalAmount = await prisma.invoice.aggregate({
    where: {
      userId: user!.id,
    },
    _max: {
      totalAmountDue: true,
    },
  });

  const mostExpensiveCategory = await prisma.invoice.groupBy({
    by: ["category"],
    where: {
      userId: user!.id,
    },
    _sum: {
      totalAmountDue: true,
    },
    orderBy: {
      _sum: {
        totalAmountDue: "desc",
      },
    },
    take: 1,
  });

  const mostRecurrentIssuer = await prisma.invoice.groupBy({
    by: ["fromName"],
    _count: {
      fromName: true,
    },
    where: {
      userId: user!.id,
    },
    orderBy: [
      {
        _count: {
          fromName: "desc",
        },
      },
      { fromName: "asc" },
    ],
    take: 1,
  });

  const response = {
    invoices,
    averageMonthlyExpenses,
    categoryDistribution,
    highestTotalAmount: {
      total: highestTotalAmount._max.totalAmountDue,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0]._sum.totalAmountDue,
    },
    mostRecurrentIssuer: {
      fromName: mostRecurrentIssuer[0].fromName,
      count: mostRecurrentIssuer[0]._count.fromName,
    },
  };
  return response;
}

export default async function InvoicesPage() {
  const data = await getData();
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Invoices" displayUploadButton />
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
                    color="#f472b6"
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
                    title: "Most Recurrent Issuer",
                    data: data.mostRecurrentIssuer.fromName,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DataTable
          title="All Invoices"
          pageSize={10}
          emptyMessage="No Invoices extracted yet."
          filterColumn={{
            columnId: "fromName",
            placeholder: "Filter by Issuer",
          }}
          columns={columns}
          categories={categories}
          data={data ? (data.invoices as Invoice[]) : []}
        />
      </div>
    </div>
  );
}
