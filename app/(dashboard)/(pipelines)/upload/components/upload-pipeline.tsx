"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStepStore } from "@/lib/store";
import { UploadInfo } from "types";
import { Dropzone } from "./dropzone";
import { CircleCheckIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function UploadPipeline() {
  const [uploadInfos, setUploadInfos] = useState<UploadInfo>({
    nbFiles: 0,
    success: [],
  });

  const { status } = useStepStore();

  return (
    <div className="m-8 flex flex-col flex-grow 2xl:-mt-48 -mt-10">
      <div className="flex flex-col flex-1 items-center justify-center">
        <AnimatePresence mode="popLayout">
          {status === "active" && (
            <Dropzone updateUploadInfos={setUploadInfos} />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {status === "complete" && (
            <motion.div
              key="success"
              layout="position"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", delay: 0.4 },
                },
              }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center"
            >
              <CircleCheckIcon
                strokeWidth={1.5}
                className="text-green-500 w-32 h-32 my-6"
              />
              <p className="text-slate-500 mb-6">
                Your file{uploadInfos.success.length > 1 && "s"} have been
                uploaded successfully
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
                    replace
                  >
                    Continue
                  </Link>
                </div>
              )) || (
                <Link
                  className={cn(buttonVariants(), "w-40")}
                  prefetch={false}
                  href={"/dashboard"}
                >
                  Back to Dashboard
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
