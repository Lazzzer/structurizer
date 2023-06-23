"use client";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useStepStore } from "@/lib/store";

export default function VerificationPipeline() {
  return (
    <div className="mt-8 mx-4">
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
