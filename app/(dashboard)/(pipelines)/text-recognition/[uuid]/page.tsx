import TextRecognitionPipeline from "@/components/text-recognition-pipeline";
import { TopMainContent } from "@/components/top-main-content";
import { headers } from "next/headers";

export type FileInfos = {
  uuid: string;
  filename: string;
  url: string;
};

async function getS3ObjectUrl(uuid: string) {
  const res = await fetch(
    `${process.env.APP_URL}/api/signed-url?uuid=${uuid}`,
    {
      method: "GET",
      headers: {
        Cookie: headers().get("cookie") || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function TextRecognitionUUIDPage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const fileInfos = (await getS3ObjectUrl(params.uuid)) as FileInfos;

  return (
    <>
      <TopMainContent title="Text Recognition" />
      <TextRecognitionPipeline infos={fileInfos} />
    </>
  );
}
