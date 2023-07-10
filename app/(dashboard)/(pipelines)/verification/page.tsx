import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Status } from "@prisma/client";
import { getExtractions } from "@/lib/server-requests";
import { Extraction, columns, categories } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification",
  description: "Pipeline where the user can verify the extracted data",
};

export default async function VerificationPage() {
  const extractions = await getExtractions(Status.TO_VERIFY);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Verification" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow items-center justify-center space-y-12 2xl:space-y-20">
        <DataTable
          title="Documents in Current Pipeline"
          pageSize={10}
          emptyMessage="No documents in Verification Pipeline"
          filterColumn={{
            columnId: "filename",
            placeholder: "Filter by file name",
          }}
          columns={columns}
          categories={categories}
          data={extractions as Extraction[]}
        />
      </div>
    </div>
  );
}
