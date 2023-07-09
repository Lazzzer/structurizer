import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { CardStatement, categories, columns } from "./columns";
import { getCardStatementsData } from "@/lib/requests";
import { MonthlyExpensesBarChart } from "@/components/monthly-expenses-bar-chart";
import { getMonthNames } from "@/lib/utils";
import { CategoryDistributionChart } from "@/components/pie-chart";
import { Statistics } from "@/components/statistics";
import { EmptyDataDisplay } from "@/components/empty-data-display";

export default async function CardStatementsPage() {
  const data = await getCardStatementsData();
  const formattedAvgMonthlyExpenses = data?.avgMonthlyExpenses.map((m: any) => {
    const { shortName, longName } = getMonthNames(m.month);
    return {
      name: shortName,
      fullName: longName,
      value: m.average,
    };
  });
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
                    data={formattedAvgMonthlyExpenses!}
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
