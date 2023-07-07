"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { categories } from "@/lib/data-categories";

interface ClassificationStepProps {
  text: string;
  updateCategory: (category: string) => void;
  setLlmCall: (llmCall: boolean) => void;
}

interface ClassificationResult {
  classification: string;
  confidence: number;
}

type State = "active" | "failed" | "complete" | "confirmed";

async function getClassification(text: string) {
  const res = await fetch("/api/pipelines/data-extraction/classification", {
    method: "POST",
    body: JSON.stringify({
      text,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to classify text");
  }

  const { classification, confidence } =
    (await res.json()) as ClassificationResult;

  if (confidence < 60 || !categories.has(classification)) {
    return "other";
  }

  return classification;
}

export function ClassificationStep({
  text,
  updateCategory,
  setLlmCall,
}: ClassificationStepProps) {
  const [status, setStatus] = useState<State>("active");
  const [classification, setClassification] = useState("other");

  useEffect(() => {
    async function classify() {
      try {
        const category = await getClassification(text);
        setClassification(category);
        setStatus("complete");
      } catch (e) {
        setStatus("failed");
      }
      setLlmCall(false);
    }
    classify();
  }, []);

  return (
    <motion.div>
      <motion.div
        layout="position"
        className="border rounded-lg border-slate-200 px-5 py-3 bg-white"
      >
        {/* Step Text */}
        <div
          className={cn(
            status === "confirmed" ? "text-slate-400" : "text-slate-700",
            "text-xl  font-medium"
          )}
        >
          <span className="font-bold">Step 1 : </span>
          <span>Text Classification</span>
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
          <p className="text-slate-400 text-xs mt-1 mb-2 w-64 leading-snug">
            <span>
              <Balancer>
                The text is being classified. This might take a few seconds.
              </Balancer>
            </span>
          </p>
        )}
        {status === "complete" && (
          <div className="text-slate-400 text-xs mt-1 mb-2 w-64 leading-snug">
            <p>
              <Balancer>
                Text classified as
                <span className="font-semibold ml-1 text-slate-700">
                  {categories.get(classification)?.name ?? "Other"}.
                </span>
              </Balancer>
            </p>
            <p>
              {(classification === "other" && (
                <span>
                  <Balancer>Please specify the correct category.</Balancer>
                </span>
              )) || (
                <span>
                  <Balancer>Please confirm if it&apos;s correct.</Balancer>
                </span>
              )}
            </p>
          </div>
        )}
        {status === "confirmed" && (
          <div className="text-slate-400 text-xs mt-1 mb-2 w-64 leading-snug">
            <p>
              <Balancer>
                Text classified as
                <span className="font-semibold ml-1 text-slate-700">
                  {categories.get(classification)!.name}.
                </span>
              </Balancer>
            </p>
          </div>
        )}
        {status === "failed" && (
          <div className="text-slate-400 text-xs mt-1 mb-2 w-64 leading-snug">
            <p></p>
            <Balancer>The text could not be classified.</Balancer>
            <p>Please specify the correct category.</p>
          </div>
        )}
        {/* Step Dropdown (not displayed when classifying) */}
        {status !== "active" && status !== "confirmed" && (
          <Select
            onValueChange={(value) => {
              if (status === "failed") {
                setStatus("complete");
              }
              setClassification(value);
            }}
            defaultValue={
              classification === "other" ? undefined : classification
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(categories.entries()).map(([key, category]) => (
                <SelectItem key={key} value={key}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </motion.div>

      {/* Step Actions */}
      <div className="flex gap-2 mt-3">
        {status !== "confirmed" && (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            href={`/dashboard`}
            prefetch={false}
          >
            Cancel
          </Link>
        )}
        {status !== "active" && status !== "confirmed" && (
          <Button
            disabled={categories.get(classification) === undefined}
            className={cn("w-full")}
            onClick={() => {
              updateCategory(classification);
              setStatus("confirmed");
            }}
          >
            Confirm
          </Button>
        )}
      </div>
    </motion.div>
  );
}
