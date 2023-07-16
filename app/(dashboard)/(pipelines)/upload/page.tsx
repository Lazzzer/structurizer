import { TopMainContent } from "@/components/top-main-content";
import UploadPipeline from "./components/upload-pipeline";
import { Metadata } from "next";
import { HelpPopover } from "@/components/ui/help-popover";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload your files to start the structuring process",
};

export default function UploadPipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Upload" step={1}>
        <HelpPopover
          align="start"
          iconClassName="w-6 h-6 text-slate-900 stroke-[2.5] -mt-1.5 ml-1.5 inline-block"
          contentClassName="max-h-[500px]"
        >
          <article className="prose prose-sm leading-normal">
            <h3 className="text-lg font-semibold">Upload Pipeline</h3>
            <p>This pipeline is the initial step in the structuring process.</p>
            <p>
              The application is currently limited to PDF files, ideally those
              with extractable content.
            </p>
            <p>
              From here, you have the option to upload a single file and
              personally manage the entire process, or you can upload several
              files simultaneously, allowing the application to automatically
              process them via the Bulk Processing feature.
            </p>
          </article>
        </HelpPopover>
      </TopMainContent>
      <UploadPipeline />
    </div>
  );
}
