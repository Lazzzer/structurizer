"use client";

import { Icons } from "@/components/icons";
import { TopMainContent } from "@/components/top-main-content";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Data Extraction" step={0} />
      <div className="m-8 flex flex-col flex-grow items-center justify-center">
        <Icons.frown
          strokeWidth={1.8}
          className="w-24 h-24 mb-2 text-slate-900"
        />
        <h1 className="text-xl font-semibold mb-4 text-slate-900">
          Oops! Something went wrong...
        </h1>
        <div className="flex gap-2">
          <Button variant={"secondary"} onClick={() => reset}>
            Try again
          </Button>
          <Button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
