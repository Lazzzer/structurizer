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
  const [isBulkProcessing, setBulkProcessing] = React.useState(false);

  return (
    <div className="mx-4 h-4/5 border border-red-200 flex flex-col">
      <MultiSteps parentStep={1} parentStatus={status} />
      <div className="flex flex-col flex-1 border border-red-100 items-center justify-center">
        <div className="flex items-center gap-2">
          <Switch
            id="bulk-processing"
            disabled
            onCheckedChange={() =>
              setBulkProcessing((previousState) => !previousState)
            }
            checked={isBulkProcessing}
          />
          <Label htmlFor="bulk-processing">Bulk Processing</Label>
          <HelpTooltip>
            <Balancer>
              <p className="mb-4">
                Bulk processing allows you to upload multiple files at once.
              </p>
              <p>
                It will automatically process the files and stop at its current
                pipeline when it encounters an error.
              </p>
            </Balancer>
          </HelpTooltip>
        </div>
        <Dropzone />
      </div>

      {/* <Button onClick={() => setStatus("complete")}>Process End</Button>
      <Link
        className={cn(buttonVariants(), "mb-4 mx-4")}
        href={"/text-recognition/1"}
      >
        Continue
      </Link> */}
    </div>
  );
}
