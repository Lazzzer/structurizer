import TextRecognitionPipeline from "@/components/text-recognition-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { getExtractionData, getS3ObjectUrl, getText } from "@/lib/requests";
import { Status } from "@prisma/client";

export default async function TextRecognitionPipelinePage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const { filename } = await getExtractionData(
    params.uuid,
    Status.TO_RECOGNIZE
  );
  const { url } = await getS3ObjectUrl(params.uuid);
  const text = await getText(url);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" step={2} />
      <TextRecognitionPipeline
        uuid={params.uuid}
        url={url}
        text={text}
        filename={filename}
      />
    </div>
  );
}
