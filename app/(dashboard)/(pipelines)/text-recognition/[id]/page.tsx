import { TopMainContent } from "@/components/top-main-content";
import { getExtraction, getObjectUrl, getText } from "@/lib/server-requests";
import { Status } from "@prisma/client";
import { Metadata } from "next";
import TextRecognitionPipeline from "../components/text-recognition-pipeline";
import { HelpPopover } from "@/components/ui/help-popover";

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
      <TopMainContent title="Text Recognition" step={2}>
        <HelpPopover
          align="start"
          iconClassName="w-6 h-6 text-slate-900 stroke-[2.5] -mt-1 ml-1.5 inline-block"
          contentClassName="max-h-[500px]"
        >
          <article className="prose prose-sm leading-normal">
            <h3 className="text-lg font-semibold">Text Recognition Pipeline</h3>
            <p>
              This pipeline is responsible for retrieving the text from the
              document.
            </p>

            <p>
              This stage is essential as the extracted text serves as the unique
              source of information that the LLMs use for the structured data
              extraction.
            </p>
            <p>
              If the application fails to retrieve the text, you can still add
              it manually.
            </p>
            <p>
              It is recommended to correct any OCR errors and remove any
              unnecessary paragraphs as it helps increase the quality of the
              resulting structured data.
            </p>
          </article>
        </HelpPopover>
      </TopMainContent>
      <TextRecognitionPipeline
        id={params.id}
        url={url}
        text={text}
        filename={filename}
      />
    </div>
  );
}
