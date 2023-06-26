"use client";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useStepStore } from "@/lib/store";

export default function VerificationPipeline({
  uuid,
  url,
  text,
  category,
  json,
  filename,
}: {
  uuid: string;
  url: string;
  text: string;
  category: string;
  json: any;
  filename: string;
}) {
  return (
    <div className="mx-4 mb-4 flex flex-col flex-grow">
      <div className="flex flex-1 items-center justify-center gap-x-10">
        <object
          data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
          type="application/pdf"
          className="bg-slate-900 rounded-lg p-2 w-3/8 h-6/7 2xl:w-3/10 2xl:h-3/4"
        />
      </div>
      <Button
        onClick={() =>
          useStepStore.setState(() => ({
            status: "complete",
          }))
        }
      >
        Process End
      </Button>
      <Link className={cn(buttonVariants(), "mb-4 mx-4")} href={"/dashboard"}>
        Confirm
      </Link>
    </div>
  );
}
