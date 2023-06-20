"use client";
import * as React from "react";
import MultiSteps from "./multi-steps";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function VerificationPipeline() {
  const [status, setStatus] = React.useState("active");
  return (
    <div className="mt-8 mx-4">
      <MultiSteps parentStep={4} parentStatus={status} />
      <Button onClick={() => setStatus("complete")}>Process End</Button>
      <Link className={cn(buttonVariants(), "mb-4 mx-4")} href={"/dashboard"}>
        Confirm
      </Link>
    </div>
  );
}
