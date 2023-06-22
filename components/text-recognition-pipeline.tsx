"use client";
import MultiSteps from "./multi-steps";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileInfos } from "@/app/(dashboard)/(pipelines)/text-recognition/[uuid]/page";

export default function TextRecognitionPipeline({
  infos,
}: {
  infos: FileInfos;
}) {
  return (
    <div className="mx-4 h-2/5 flex flex-col">
      <MultiSteps parentStep={2} />
      <div className="text-2xl font-bold mb-4">Text Recognition</div>
      <div className="text-lg mb-4">
        <div className="mb-4">
          <span className="font-bold">File name: </span>
          {infos.filename}
        </div>
        <div className="mb-4">
          <span className="font-bold">File URL: </span>
          <a href={infos.url} target="_blank" rel="noreferrer">
            {infos.url}
          </a>
        </div>
      </div>
      <Link
        className={cn(buttonVariants(), "mb-4 mx-4")}
        href={`/data-extraction/${infos.uuid}`}
      >
        Continue
      </Link>
    </div>
  );
}
