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
    <>
      <TopMainContent title="Text Recognition" />
      <TextRecognitionPipeline uuid={params.uuid} />
    </>
  );
}
