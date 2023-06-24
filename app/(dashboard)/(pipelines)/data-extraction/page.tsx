import { TopMainContent } from "@/components/top-main-content";

export default function DataExtractionPage() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" displayUploadButton />
      <div className="m-4">
        <h1>Content</h1>
      </div>
    </div>
  );
}
