import UploadPipeline from "@/components/upload-pipeline";
import { TopMainContent } from "@/components/top-main-content";

export default function UploadPipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Upload" step={1} />
      <UploadPipeline />
    </div>
  );
}
