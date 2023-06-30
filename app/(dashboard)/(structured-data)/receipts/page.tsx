import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Receipt, categories, columns } from "./columns";
import { getReceipts } from "@/lib/requests";

export default async function ReceiptsPage() {
  const receipts = await getReceipts();
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Receipts" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow items-center justify-center space-y-12 2xl:space-y-20">
        <div className="w-full h-1/2">Overview</div>
        <DataTable
          title="All Receipts"
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
