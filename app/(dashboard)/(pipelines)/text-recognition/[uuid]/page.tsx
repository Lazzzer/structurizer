import TextRecognitionPipeline from "@/components/text-recognition-pipeline";
import { TopMainContent } from "@/components/top-main-content";

export default function TextRecognitionPipelinePage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" step={2} />
      <TextRecognitionPipeline uuid={params.uuid} />
    </div>
  );
}
