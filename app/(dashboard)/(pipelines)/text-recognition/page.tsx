import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { Status } from "@prisma/client";
import { Extraction, columns } from "./columns";
import { getExtractions } from "@/lib/server-requests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Recognition",
  description: "Pipeline where the text is extracted from your file",
};

export default async function TextRecognitionPage() {
  const extractions = await getExtractions(Status.TO_RECOGNIZE);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow">
        <DataTable
          title="Documents in Current Pipeline"
          pageSize={10}
          emptyMessage="No documents in Text Recognition Pipeline"
          filterColumn={{
            columnId: "filename",
            placeholder: "Filter by file name",
          }}
          columns={columns}
          data={extractions as Extraction[]}
        />
      </div>
    </div>
  );
}
