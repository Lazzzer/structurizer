"use client";

import { cn, minDelay } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/data-categories";

interface ExtractionStepProps {
  id: string;
  text: string;
  category: Category;
  setLlmCall: (llmCall: boolean) => void;
}

type State = "active" | "failed" | "complete";

export function ExtractionStep({
  id,
  text,
  category,
  setLlmCall,
}: ExtractionStepProps) {
  const router = useRouter();

  const [status, setStatus] = useState<State>("active");
  const [isLoading, setIsLoading] = useState(false);
  const [json, setJson] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  async function getStructuredData(category: string, text: string) {
    setTimeout(() => {
      setLlmCall(true);
    }, 500);

    const res = await fetch("/api/pipelines/data-extraction", {
      method: "POST",
      body: JSON.stringify({
        text,
        category,
      }),
    });

    setLlmCall(false);
    if (!res.ok) {
      setErrorMessage("Something went wrong. Data could not be structured.");
      throw new Error("Failed to classify text");
    }

    const json = await res.json();
    setJson(json);
  }

  async function sendJson(json: any) {
    const res = await fetch("/api/pipelines/data-extraction", {
      method: "PUT",
      body: JSON.stringify({
        id,
        json,
        category: category.value,
      }),
    });

    const data = await res.json();
    if (res.status !== 200) {
      setErrorMessage("Something went wrong. Data could not be saved.");
      throw new Error(data.message);
    }
  }

  useEffect(() => {
    const extract = async () => {
      try {
        await getStructuredData(category.value, text);
        setStatus("complete");
      } catch (e) {
        setStatus("failed");
      }
    };
    extract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key={"extraction-step"}
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
      <div
        className={cn(
          "relative bg-white border rounded-lg border-slate-200 px-5 py-3 shadow-sm glow transition-all ease-in-out before:rounded-lg after:rounded-lg",
          status === "active" && "glow-active border-0"
        )}
      >
        {/* Step Text */}
        <div className="text-slate-700 text-xl font-medium">
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
          <p className="text-slate-500 text-xs mt-1 mb-2 w-80 leading-snug">
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
          <div className="text-slate-500 text-xs mt-1 mb-2 w-80 leading-snug">
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
          <div className="text-slate-500 text-xs mt-1 mb-2 w-80 leading-snug">
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
      {errorMessage !== "" && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          variant={"secondary"}
          className="w-full"
          onClick={() => {
            window.location.href = "/data-extraction";
          }}
        >
          Cancel
        </Button>
        {status === "complete" && (
          <Button
            disabled={isLoading}
            className={cn("w-full")}
            onClick={async () => {
              setIsLoading(true);
              try {
                await minDelay(sendJson(json), 400);
                router.push(`/verification/${id}`);
              } catch (e) {
                setStatus("failed");
                setIsLoading(false);
              }
            }}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        )}
        {status === "failed" && (
          <Button
            className={cn("w-full")}
            onClick={async () => {
              setIsLoading(true);
              setErrorMessage("");
              setStatus("active");
              try {
                await getStructuredData(category.value, text);
                setStatus("complete");
              } catch (e) {
                setStatus("failed");
              }
              setIsLoading(false);
            }}
          >
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  );
}
