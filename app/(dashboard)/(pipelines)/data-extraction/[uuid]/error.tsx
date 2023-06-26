"use client";

import { Icons } from "@/components/icons";
import { TopMainContent } from "@/components/top-main-content";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={0} />
      <div className="m-4 flex flex-col flex-grow items-center justify-center">
        <Icons.frown
          strokeWidth={1.8}
          className="w-24 h-24 mb-2 text-slate-900"
        />
        <h1 className="text-2xl font-bold text-slate-900">
          Oops! Something went wrong...
        </h1>
        <p className="text-slate-700 text-sm mt-2 mb-4">
          <span className="font-semibold">Error</span> : {error.message}
        </p>
        <div className="flex gap-2">
          <Button variant={"secondary"} onClick={reset}>
            Try again
          </Button>
          <Link className={cn(buttonVariants())} href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
