import MultiSteps from "./multi-steps";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";

import dynamic from "next/dynamic";
import { Textarea } from "./ui/textarea";

const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
});

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
    throw new Error("Failed to fetch url");
  }

  return res.json();
}

async function getText(url: string) {
  const res = await fetch(`${process.env.APP_URL}/api/text-recognition`, {
    method: "POST",
    headers: {
      Cookie: headers().get("cookie") ?? "",
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
  const { text } = await getText(url);

  return (
    <div className="mx-4 mb-10 flex flex-col flex-grow">
      <div className="flex flex-1 items-center justify-center gap-x-10">
        <PdfViewer url={url} scaleValue={1} />
        <div>
          <Textarea
            value={text}
            // onChange={() => {
            //   // TODO: Put in its own client component
            // }}
            className="w-96 h-96"
            placeholder="Type your message here."
          />
          <h1 className="text-2xl font-bold">{filename}</h1>

          <Link
            className={cn(buttonVariants(), "w-full")}
            href={`/data-extraction/${uuid}`}
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
