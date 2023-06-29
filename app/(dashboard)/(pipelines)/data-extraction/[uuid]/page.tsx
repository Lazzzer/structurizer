import DataExtractionPipeline from "@/components/data-extraction-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { getExtractionData } from "@/lib/requests";
import { Status } from "@prisma/client";

export default async function DataExtractionPipelinePage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const data = await getExtractionData(params.uuid, Status.TO_EXTRACT);

  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={3} />
      <DataExtractionPipeline
        data={{
          uuid: params.uuid,
          filename: data.filename,
          text: data.text as string,
        }}
      />
    </div>
  );
}
