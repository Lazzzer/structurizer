"use client";
import * as React from "react";
import MultiSteps from "./multi-steps";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DataExtractionPipeline() {
  return (
    <div className="mt-8 mx-4">
      <MultiSteps parentStep={3} />
      <Link
        className={cn(buttonVariants(), "mb-4 mx-4")}
        href={"/verification/1"}
      >
        Continue
      </Link>
    </div>
  );
}
