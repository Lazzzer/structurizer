import { TopMainContent } from "@/components/top-main-content";
import VerificationPipeline from "@/components/verification-pipeline";
import { getExtractionData, getS3ObjectUrl } from "@/lib/requests";
import { Status } from "@prisma/client";

export default async function VerificationPipelinePage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const data = await getExtractionData(params.uuid, Status.TO_VERIFY);
  const { url } = await getS3ObjectUrl(params.uuid);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Verification" step={4} />
      <VerificationPipeline
        uuid={params.uuid}
        url={url}
        category={data.category as string}
        text={data.text as string}
        json={data.json}
      />
    </div>
  );
}
