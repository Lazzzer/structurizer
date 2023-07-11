import { TopMainContent } from "@/components/top-main-content";
import UploadPipeline from "./components/upload-pipeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload your files to start the structuring process",
};

export default function UploadPipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Upload" step={1} />
      <UploadPipeline />
    </div>
  );
}
