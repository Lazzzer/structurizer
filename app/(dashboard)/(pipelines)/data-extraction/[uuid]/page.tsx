import DataExtractionPipeline from "@/components/data-extraction-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Status } from "@prisma/client";

async function getExtractionData(uuid: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }
  const userUUID = session?.user.id;

  const extractionData = await prisma.extraction.findFirst({
    where: {
      id: uuid,
      userId: userUUID,
      status: Status.TO_EXTRACT,
    },
  });

  if (!extractionData) {
    throw new Error("Failed to fetch data");
  }

  return {
    filename: extractionData.filename,
    text: extractionData.text as string,
  };
}

export default async function DataExtractionUUIDPage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const data = await getExtractionData(params.uuid);

  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={3} />
      <DataExtractionPipeline
        data={{
          uuid: params.uuid,
          filename: data.filename,
          text: data.text,
        }}
      />
    </div>
  );
}
