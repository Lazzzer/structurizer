import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Receipt, categories, columns } from "./columns";
import { getReceiptsData } from "@/lib/requests";
import { MonthlyExpensesBarChart } from "@/components/monthly-expenses-bar-chart";
import { getMonthNames } from "@/lib/utils";
import { CategoryDistributionChart } from "@/components/pie-chart";
import { Statistics } from "@/components/statistics";
import { EmptyDataDisplay } from "@/components/empty-data-display";

export default async function ReceiptsPage() {
  const data = await getReceiptsData();
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
      <TopMainContent title="Receipts" displayUploadButton />
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
                  <MonthlyExpensesBarChart data={formattedAvgMonthlyExpenses} />
                </div>
              </div>
              <div className="w-full h-[228px] 2xl:h-[356px]  col-span-3">
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
                    title: "Most Recurrent Location",
                    data: data.mostRecurrentFrom.from,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DataTable
          title="All Receipts"
          pageSize={10}
          emptyMessage="No receipts extracted yet."
          filterColumn={{
            columnId: "from",
            placeholder: "Filter by location",
          }}
          columns={columns}
          categories={categories}
          data={data ? (data.receipts as Receipt[]) : []}
        />
      </div>
    </div>
  );
}
