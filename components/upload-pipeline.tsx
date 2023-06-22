"use client";
import { useState } from "react";
import MultiSteps from "./multi-steps";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dropzone } from "./dropzone";
import { Icons } from "./icons";

export type UploadInfo = {
  nbFiles: number;
  success: [string, string][]; // [filename, uuid][]
  failed: string[];
};

export default function UploadPipeline() {
  const [status, setStatus] = useState("active");
  const [uploadInfos, setUploadInfos] = useState<UploadInfo | null>(null);

  return (
    <div className="mx-4 h-2/5 flex flex-col">
      <MultiSteps parentStep={1} parentStatus={status} />

      <div className="flex flex-col flex-1 items-center justify-center">
        {status === "active" && (
          <Dropzone
            updateStatus={setStatus}
            updateUploadInfos={setUploadInfos}
            className="mt-4 mb-8"
          />
        )}

        {status === "complete" && (
          <>
            <Icons.checkCircleInside
              strokeWidth={1.4}
              className="text-green-500 w-32 h-32 my-6"
            />
            <p className="text-center text-slate-500 mb-6">
              Your file{uploadInfos!.success.length > 1 && "s"} have been
              uploaded successfully{" "}
              {uploadInfos!.nbFiles > 1 && " and will be processed shortly"}
            </p>
            {(uploadInfos!.nbFiles === 1 && (
              <div className="flex gap-4">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-40"
                  )}
                  href={"/dashboard"}
                >
                  Back
                </Link>
                <Link
                  className={cn(buttonVariants(), "w-40")}
                  href={`/text-recognition/${uploadInfos!.success[0][1]}`}
                >
                  Continue
                </Link>
              </div>
            )) || (
              <Link
                className={cn(buttonVariants(), "w-40")}
                href={"/dashboard"}
              >
                Back to Dashboard
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
