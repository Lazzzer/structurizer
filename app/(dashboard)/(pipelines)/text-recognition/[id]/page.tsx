import { TopMainContent } from "@/components/top-main-content";
import { getExtraction, getObjectUrl, getText } from "@/lib/server-requests";
import { Status } from "@prisma/client";
import { Metadata } from "next";
import TextRecognitionPipeline from "../components/text-recognition-pipeline";

export const metadata: Metadata = {
  title: "Text Recognition",
  description: "Pipeline where the text is extracted from your file",
};

export default async function TextRecognitionPipelinePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { filename } = await getExtraction(params.id, Status.TO_RECOGNIZE);
  const { url } = await getObjectUrl(params.id);
  const text = await getText(url);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" step={2} />
      <TextRecognitionPipeline
        id={params.id}
        url={url}
        text={text}
        filename={filename}
      />
    </div>
  );
}
