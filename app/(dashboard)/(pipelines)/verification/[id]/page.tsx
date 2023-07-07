import { TopMainContent } from "@/components/top-main-content";
import { getExtractionData, getS3ObjectUrl } from "@/lib/requests";
import { Status } from "@prisma/client";
import VerificationPipeline from "../components/verification-pipeline";
import { Metadata } from "next";

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
  const { category, text, json } = await getExtractionData(
    params.id,
    Status.TO_VERIFY
  );
  const { url } = await getS3ObjectUrl(params.id);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Verification" step={4} />
      <VerificationPipeline
        id={params.id}
        url={url}
        category={category as string}
        text={text as string}
        json={json}
      />
    </div>
  );
}
