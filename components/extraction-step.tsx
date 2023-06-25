import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { motion } from "framer-motion";

export function ExtractionStep({
  category,
  setLlmCall,
}: {
  category: { value: string; name: string };
  setLlmCall: (llmCall: boolean) => void;
}) {
  const [status, setStatus] = useState<"active" | "failed" | "complete">(
    "active"
  );

  useEffect(() => {
    setTimeout(() => {
      setLlmCall(true);
    }, 500);
    setTimeout(() => {
      setStatus("complete");
      setLlmCall(false);
    }, 5000);
  }, []);

  return (
    <motion.div
      layout="position"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.4 } },
      }}
      viewport={{ once: true }}
      className="-mt-12"
    >
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
              <Balancer>
                The data is being structured as
                <span className="font-semibold ml-1 text-slate-700">
                  {category.name}
                </span>
                .
              </Balancer>
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
            <span>
              <Balancer>
                A valid structure of
                <span className="font-semibold mx-1 text-slate-700">
                  {category.name}
                </span>
                has been created.
              </Balancer>
            </span>
          </div>
        )}
        {status === "failed" && (
          <div className="text-slate-400 text-xs mt-1 mb-2 w-80 leading-snug">
            <p>
              <Balancer>The data could not be extracted.</Balancer>
            </p>
            <span>
              <Balancer>Please try again.</Balancer>
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
        {status === "complete" && (
          <Button
            className={cn("w-full")}
            onClick={() => {
              setStatus("complete");
            }}
          >
            Continue
          </Button>
        )}
        {status === "failed" && (
          <Button
            className={cn("w-full")}
            onClick={() => {
              setStatus("active");
            }}
          >
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  );
}