import TextRecognitionPipeline from "@/components/text-recognition-pipeline";
import { TopMainContent } from "@/components/top-main-content";

import { headers } from "next/headers";

async function getS3ObjectUrl(uuid: string) {
  const res = await fetch(
    `${process.env.APP_URL}/api/signed-url?uuid=${uuid}`,
    {
      method: "GET",
      headers: {
        Cookie: headers().get("cookie") ?? "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getText(url: string) {
  const res = await fetch(
    `${process.env.LLM_STRUCTURIZER_URL}/v1/parsers/pdf/url`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (res.status === 422) {
    return "";
  }

  if (!res.ok) {
    throw new Error("Failed to do text recognition");
  }

  const { content } = await res.json();
  return content;
}

export default async function TextRecognitionPipelinePage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const { url, filename } = await getS3ObjectUrl(params.uuid);
  const text = await getText(url);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" step={2} />
      <TextRecognitionPipeline
        uuid={params.uuid}
        url={url}
        text={text}
        filename={filename}
      />
    </div>
  );
}
