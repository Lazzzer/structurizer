import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export function ExtractionStep() {
  const [status, setStatus] = useState<"active" | "failed" | "complete">(
    "active"
  );

  return (
    <div className="-mt-16 2xl:-mt-12">
      <div className="border rounded-lg border-slate-200 px-5 py-3 drop-shadow-custom bg-white">
        {/* Step Text */}
        <div className="text-slate-700 text-xl  font-medium">
          <span className="font-bold">Step 2 : </span>
          <span>Structured Data Extraction</span>
          {status === "active" && (
            <Icons.spinner className="w-6 ml-3 mb-0.5 h-auto animate-spin inline-block " />
          )}
          {status === "complete" && (
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
          <div className="text-slate-400 text-xs mt-1 mb-2 w-80 leading-snug">
            <p>
              <Balancer>
                The data has been correctly extracted and structured.
              </Balancer>
            </p>
          </div>
        )}
        {status === "failed" && (
          <div className="text-slate-400 text-xs mt-1 mb-2 w-80 leading-snug">
            <p>
              <Balancer>The data could not be extracted.</Balancer>
            </p>
            <span>
              <Balancer>
                This might take a while depending the size of the text.
              </Balancer>
            </span>
          </div>
        )}
      </div>
      {/* Step Actions */}
      <div className="flex gap-2 mt-3">
        <Link
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          href={`/dashboard`}
        >
          Cancel
        </Link>
        {status !== "active" && (
          <Button
            className={cn("w-full")}
            onClick={() => {
              setStatus("complete");
            }}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
