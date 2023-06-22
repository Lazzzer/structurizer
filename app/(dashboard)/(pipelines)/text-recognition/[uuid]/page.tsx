import TextRecognitionPipeline from "@/components/text-recognition-pipeline";
import { TopMainContent } from "@/components/top-main-content";

export default async function TextRecognitionUUIDPage({
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
