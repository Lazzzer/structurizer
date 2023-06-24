import DataExtractionPipeline from "@/components/data-extraction-pipeline";
import { TopMainContent } from "@/components/top-main-content";

export default function DataExtractionUUIDPage() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={3} />
      <DataExtractionPipeline />
    </div>
  );
}
