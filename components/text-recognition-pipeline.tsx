import MultiSteps from "./multi-steps";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";

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
    throw new Error("Failed to fetch url");
  }

  return res.json();
}

async function getText(url: string) {
  const res = await fetch(`${process.env.APP_URL}/api/text-recognition`, {
    method: "POST",
    headers: {
      Cookie: headers().get("cookie") || "",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch text");
  }

  return res.json();
}

export default async function TextRecognitionPipeline({
  uuid,
}: {
  uuid: string;
}) {
  const { url, filename } = await getS3ObjectUrl(uuid);

  console.log("server component", url);
  const { text } = await getText(url);
  console.log("server component", text);

  return (
    <div className="mx-4 h-2/5 flex flex-col">
      <MultiSteps parentStep={2} />
      <div className="text-2xl font-bold mb-4">Text Recognition</div>
      <div className="text-lg mb-4">
        <div className="mb-4">
          <span className="font-bold">File name: </span>
          {filename}
        </div>
        <div className="mb-4">
          <span className="font-bold">File URL: </span>
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </div>
        <div className="mb-4">
          <span className="font-bold">Text: </span>
          {text}
        </div>
      </div>
      <Link
        className={cn(buttonVariants(), "mb-4 mx-4")}
        href={`/data-extraction/${uuid}`}
      >
        Continue
      </Link>
    </div>
  );
}
