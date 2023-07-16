import { TopMainContent } from "@/components/top-main-content";
import { getExtraction, getObjectUrl } from "@/lib/server-requests";
import { Status } from "@prisma/client";
import VerificationPipeline from "../components/verification-pipeline";
import { Metadata } from "next";
import { HelpPopover } from "@/components/ui/help-popover";

export const metadata: Metadata = {
  title: "Verification",
  description: "Pipeline where the user can verify the extracted data",
};

export default async function VerificationPipelinePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { category, text, json } = await getExtraction(
    params.id,
    Status.TO_VERIFY
  );
  const { url } = await getObjectUrl(params.id);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Verification" step={4}>
        <HelpPopover
          align="start"
          iconClassName="w-6 h-6 text-slate-900 stroke-[2.5] -mt-1 ml-1.5 inline-block"
          contentClassName="max-h-[500px]"
        >
          <article className="prose prose-sm leading-normal">
            <h3 className="text-lg font-semibold">Verification Pipeline</h3>
            <p>This pipeline is the final step of the structuring process.</p>
            <p>
              LLMs may have generated inaccuracies or hallucinations during the
              previous stages. This pipeline gives you the opportunity to have
              the final say on the extracted data.
            </p>
            <p>
              An additional feature you can use is automatic verification
              provided by the LLM.
            </p>
            <p>
              However, please be aware that it may{" "}
              <u>generate false positives or overlook certain errors</u>. This
              feature solely relies on the text for its analysis. So, subtle
              errors within the text may likely go undetected.
            </p>
          </article>
        </HelpPopover>
      </TopMainContent>
      <VerificationPipeline
        id={params.id}
        url={url}
        category={category as string}
        text={text as string}
        json={json as string}
      />
    </div>
  );
}
