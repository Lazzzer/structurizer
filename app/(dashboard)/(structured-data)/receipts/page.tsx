import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Receipt, categories, columns } from "./columns";
import { getReceipts } from "@/lib/requests";
import { MonthlyExpensesGraph } from "@/components/monthly-expenses-graph";
import { getMonthNames } from "@/lib/utils";

export default async function ReceiptsPage() {
  const { receipts, avgMonthlyExpenses } = await getReceipts();
  const formattedAvgMonthlyExpenses = avgMonthlyExpenses.map((m: any) => {
    if (m.month === 0) {
      return {
        name: "N/A",
        fullName: "None",
        value: m.average,
      };
    }
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2 2xl:mb-3">
            Overview
          </h2>
          <div className="w-full h-full grid grid-cols-8 gap-3">
            <div className="w-full h-full col-span-3">
              <h3 className="font-semibold text-slate-800 mb-1">
                Average Monthly Expenses
              </h3>
              <div className="w-full h-4/5 border border-slate-200 rounded-md pl-1 pr-2 pt-6 pb-2 2xl:pt-10 2xl:pb-4">
                <MonthlyExpensesGraph data={formattedAvgMonthlyExpenses} />
              </div>
            </div>
            <div className="w-full h-4/5 col-span-3">
              <h3 className="font-semibold text-slate-800 mb-1">
                Category Distribution
              </h3>
              <div className="border border-slate-200 rounded-md w-full h-full"></div>
            </div>
            <div className="w-full h-4/5 col-span-2">
              <h3 className="font-semibold text-slate-800 mb-1">Statistics</h3>
              <div className="border border-slate-200 rounded-md w-full h-full"></div>
            </div>
          </div>
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
          data={receipts as Receipt[]}
        />
      </div>
    </div>
  );
}
