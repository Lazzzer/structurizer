import { HelpPopover } from "@/components/ui/help-popover";
import DataExtractionPipeline from "../components/data-extraction-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { getExtraction } from "@/lib/server-requests";
import { Status } from "@prisma/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Extraction",
  description:
    "Pipeline where LLMs extract structured data from the provided text",
};

export default async function DataExtractionPipelinePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getExtraction(params.id, Status.TO_EXTRACT);

  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={3}>
        <HelpPopover
          align="start"
          iconClassName="w-6 h-6 text-slate-900 stroke-[2.5] -mt-1 ml-1.5 inline-block"
          contentClassName="max-h-[500px]"
        >
          <article className="prose prose-sm leading-normal">
            <h3 className="text-lg font-semibold">Data Extraction Pipeline</h3>
            <p>The LLM conducts the data extraction process in two stages.</p>
            <p>
              Initially, it determines the category of the document. Once
              categorized, the LLM uses a specific structure, such as a JSON
              schema, that corresponds to the identified category to extract the
              data.
            </p>
            <p>
              You are given the option to select the category manually if the
              classification fails or is incorrect.
            </p>
          </article>
        </HelpPopover>
      </TopMainContent>
      <DataExtractionPipeline id={params.id} text={data.text as string} />
    </div>
  );
}
