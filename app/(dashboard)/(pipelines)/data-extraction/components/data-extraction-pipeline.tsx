"use client";

import { useEffect, useState } from "react";
import { ClassificationStep } from "./classification-step";
import { ExtractionStep } from "./extraction-step";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "@/components/icons";
import { categories } from "@/lib/data-categories";

interface DataExtractionPipelineProps {
  id: string;
  text: string;
}

type Step = "classification" | "extraction";

export default function DataExtractionPipeline({
  id,
  text,
}: DataExtractionPipelineProps) {
  const [step, setStep] = useState<Step>("classification");
  const [category, setCategory] = useState("other");
  const [llmCall, setLlmCall] = useState(false);

  useEffect(() => {
    if (categories.has(category)) {
      setStep("extraction");
    }
  }, [category]);

  return (
    <div className="m-8 flex flex-col flex-grow items-center justify-center">
      <SparklesIcon
        className={cn(
          llmCall ? "opacity-100" : "opacity-0",
          "w-16 h-auto mb-4 transition-opacity duration-500 2xl:-mt-72 -mt-36"
        )}
      />
      <ClassificationStep
        text={text}
        updateCategory={setCategory}
        setLlmCall={setLlmCall}
      />
      {step === "extraction" && (
        <ExtractionStep
          id={id}
          text={text}
          category={categories.get(category)!}
          setLlmCall={setLlmCall}
        />
      )}
    </div>
  );
}
