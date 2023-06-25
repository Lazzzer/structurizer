import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export function ExtractionStep() {
  const [status, setStatus] = useState<
    "active" | "failed" | "complete" | "confirmed"
  >("complete");

  return (
    <div>
      {/* Step Text */}
      <div
        className={cn(
          status === "complete" || status === "confirmed"
            ? "text-slate-400"
            : "text-slate-700",
          "text-xl  font-medium"
        )}
      >
        <span className="font-bold">Step 2 : </span>
        <span>Extracting structured data</span>
        {status === "active" && (
          <Icons.spinner className="w-6 ml-3 mb-0.5 h-auto animate-spin inline-block " />
        )}
        {(status === "complete" || status === "confirmed") && (
          <Icons.checkCircleInside
            strokeWidth={2}
            className="text-green-500 w-6 ml-3 mb-0.5 h-auto inline-block"
          />
        )}
        {status === "failed" && (
          <Icons.close
            strokeWidth={2}
            className="text-red-500 w-6 ml-3 mb-0.5 h-auto inline-block"
          />
        )}
      </div>
      {/* Step Description */}
      {status === "active" && (
        <p className="text-slate-400 text-xs mt-1 mb-2 w-80 leading-snug">
          <span>
            <Balancer>The data is being extracted and structured.</Balancer>
          </span>
          <span>
            <Balancer>
              This might take a while depending the size of the text.
            </Balancer>
          </span>
        </p>
      )}
      {status === "complete" && (
        <div className="text-slate-700 text-xs mt-1 mb-2 w-80 leading-snug">
          <p>
            <Balancer>
              The data has been correctly extracted and structured.
            </Balancer>
          </p>
        </div>
      )}
      {status === "confirmed" && (
        <div className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
          <p>
            <Balancer></Balancer>
          </p>
        </div>
      )}
      {status === "failed" && (
        <div className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
          <p></p>
          <Balancer>The text could not be classified.</Balancer>
          <p>Please specify the correct category.</p>
        </div>
      )}
      {/* Step Actions */}
      <div className="flex gap-2 mt-3">
        {status !== "confirmed" && (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            href={`/dashboard`}
          >
            Cancel
          </Link>
        )}
        {status !== "active" && status !== "confirmed" && (
          <Button
            className={cn("w-full")}
            onClick={() => {
              setStatus("confirmed");
            }}
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
}
