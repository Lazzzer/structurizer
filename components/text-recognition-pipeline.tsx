"use client";

import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Icons } from "./icons";
import { Balancer } from "react-wrap-balancer";
import { useRouter } from "next/navigation";

export default function TextRecognitionPipeline({
  uuid,
  url,
  text,
  filename,
}: {
  uuid: string;
  url: string;
  text: string;
  filename: string;
}) {
  async function sendText(text: string) {
    setUpdating(true);
    const res = await fetch("/api/text-recognition/save", {
      method: "POST",
      body: JSON.stringify({
        uuid,
        text: verifiedText,
      }),
    });

    const data = await res.json();

    setUpdating(false);

    console.log(data);
    console.log(res.status);

    if (res.status !== 200) {
      throw new Error(data.message);
    }
  }

  const router = useRouter();
  const [isUpdating, setUpdating] = useState(false);
  const [verifiedText, setVerifiedText] = useState(text);

  return (
    <div className="mx-4 mb-4 flex flex-col flex-grow">
      <div className="flex flex-1 items-center justify-center gap-x-10">
        <object
          data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
          type="application/pdf"
          className="bg-slate-900 rounded-lg p-2 w-3/8 h-6/7 2xl:w-3/10 2xl:h-3/4"
        />
        <div className="w-3/8 h-6/7 2xl:w-3/10 2xl:h-3/4 flex flex-col justify-between">
          <div className="w-full h-3/4">
            <h1 className="mb-1 text-sm text-slate-700 overflow-hidden">
              Text from{" "}
              <span className="text-ellipsis font-semibold">{filename}</span>
            </h1>
            <Textarea
              value={text}
              onChange={(e) => setVerifiedText(e.target.value)}
              className="w-full h-full rounded-lg"
              placeholder="Type your message here."
            />

            <div className="flex gap-2 items-center justify-center w-full mt-4">
              <Icons.help
                width={20}
                height={20}
                className="inline-block text-slate-500 flex-none"
              />
              <p className="text-sm text-slate-500">
                <Balancer>
                  Please make sure that the text above matches the text in the
                  PDF. Feel free to remove or edit any part of the text.
                </Balancer>
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Link
              className={cn(
                buttonVariants({
                  variant: "secondary",
                })
              )}
              href="/dashboard"
            >
              Cancel
            </Link>
            <Button
              disabled={isUpdating}
              className="w-48"
              onClick={() =>
                sendText(verifiedText)
                  .then(() => router.push(`/data-extraction/${uuid}`))
                  .catch((e) => {
                    alert(e.message);
                  })
              }
            >
              {isUpdating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
