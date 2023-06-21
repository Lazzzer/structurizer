"use client";
import * as React from "react";
import MultiSteps from "./multi-steps";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dropzone } from "./dropzone";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { HelpTooltip } from "./ui/help-tooltip";
import Balancer from "react-wrap-balancer";

export default function UploadPipeline() {
  const [status, setStatus] = React.useState("active");

  return (
    <div className="mx-4 h-2/5 flex flex-col">
      <MultiSteps parentStep={1} parentStatus={status} />

      <div className="flex flex-col flex-1 items-center justify-center">
        {status === "active" && (
          <Dropzone updateStatus={setStatus} className="mt-4 mb-8" />
        )}

        {status === "complete" && (
          <Link
            className={cn(buttonVariants(), "mb-4 mx-4")}
            href={"/text-recognition/1"}
          >
            Continue
          </Link>
        )}
      </div>
    </div>
  );
}
