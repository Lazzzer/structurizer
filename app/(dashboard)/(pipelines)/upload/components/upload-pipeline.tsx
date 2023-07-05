"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStepStore } from "@/lib/store";
import { UploadInfo } from "types";
import { Dropzone } from "./dropzone";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function UploadPipeline() {
  const [uploadInfos, setUploadInfos] = useState<UploadInfo>({
    nbFiles: 0,
    success: [],
  });

  const { status } = useStepStore();

  return (
    <div className="m-8 flex flex-col flex-grow 2xl:-mt-48 -mt-10">
      <div className="flex flex-col flex-1 items-center justify-center">
        {status === "active" && (
          <Dropzone updateUploadInfos={setUploadInfos} className="mt-4 mb-8" />
        )}
        {status === "complete" && (
          <>
            <Icons.checkCircleInside
              strokeWidth={1.4}
              className="text-green-500 w-32 h-32 my-6"
            />
            <p className="text-center text-slate-500 mb-6">
              Your file{uploadInfos.success.length > 1 && "s"} have been
              uploaded successfully{" "}
              {uploadInfos.nbFiles > 1 && " and will be processed shortly"}
            </p>
            {(uploadInfos.nbFiles === 1 && (
              <div className="flex gap-4">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-40"
                  )}
                  prefetch={false}
                  href={"/dashboard"}
                >
                  Back
                </Link>
                <Link
                  className={cn(buttonVariants(), "w-40")}
                  href={`/text-recognition/${uploadInfos.success[0][1]}`}
                >
                  Continue
                </Link>
              </div>
            )) || (
              <Link
                className={cn(buttonVariants(), "w-40")}
                replace
                prefetch={false}
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
