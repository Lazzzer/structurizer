import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";
import { Textarea } from "./ui/textarea";

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
    <div className="mx-4 mb-4 flex flex-col flex-grow">
      <div className="flex flex-1 items-center justify-center gap-x-10">
        <object
          data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
          type="application/pdf"
          className="bg-slate-900 rounded-lg p-2 w-3/8 h-6/7 2xl:w-3/10 2xl:h-3/4"
        />
        <div>
          <Textarea
            value={text}
            // onChange={() => {
            //   // TODO: Put in its own client component
            // }}
            className="w-96 h-96"
            placeholder="Type your message here."
          />

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
