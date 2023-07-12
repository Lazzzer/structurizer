"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";
import MultiSteps from "./multi-steps";
import { useStepStore } from "@/lib/store";
import { AskDialog } from "./ask-dialog";

interface TopMainContentProps {
  title: string;
  displayUploadButton?: boolean;
  step?: number;
}

export function TopMainContent({
  title,
  displayUploadButton = false,
  step = undefined,
}: TopMainContentProps) {
  useEffect(() => {
    useStepStore.setState(() => ({
      current: step ?? 0,
      status: "active",
    }));
  }, [step]);

  return (
    <div className="border-slate-200 border-b-2 flex-none flex items-end justify-center relative h-32">
      <h1
        className={cn(
          step !== undefined ? "lg:text-3xl " : "lg:text-4xl",
          "hidden lg:block mb-6 ml-8 absolute font-cal left-0 bottom-0"
        )}
      >
        {title}
      </h1>
      {step !== undefined && <MultiSteps />}

      {displayUploadButton && (
        <div className="flex gap-2 mb-6 mr-8 absolute right-0 bottom-0">
          <AskDialog />
          <Link className={cn(buttonVariants(), "")} href={"/upload"}>
            <Icons.upload
              width={18}
              height={18}
              className="mr-2 stroke-slate-100"
            />
            Upload Files
          </Link>
        </div>
      )}
    </div>
  );
}
