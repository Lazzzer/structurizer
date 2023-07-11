import DataExtractionPipeline from "../components/data-extraction-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { getExtraction } from "@/lib/server-requests";
import { Status } from "@prisma/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Extraction",
  description:
    "Pipeline where LLMs extract structured data from the provided text",
};

export default async function DataExtractionPipelinePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getExtraction(params.id, Status.TO_EXTRACT);

  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={3} />
      <DataExtractionPipeline id={params.id} text={data.text as string} />
    </div>
  );
}
