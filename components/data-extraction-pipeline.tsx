"use client";
import { useEffect, useState } from "react";
import { ClassificationStep } from "./classification-step";
import { ExtractionStep } from "./extraction-step";
import { SparklesIcon } from "./icons";
import { cn } from "@/lib/utils";

export default function DataExtractionPipeline({
  data,
}: {
  data: {
    uuid: string;
    filename: string;
    text: string;
  };
}) {
  const categories = [
    {
      value: "receipts",
      name: "Receipt",
    },
    {
      value: "credit card statements",
      name: "Card Statement",
    },
    {
      value: "invoices",
      name: "Invoice",
    },
  ];

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("other");
  const [llmCall, setLlmCall] = useState(true);

  useEffect(() => {
    if (category !== "other") {
      setStep(2);
    }
  }, [category]);

  return (
    <div className="mx-4 flex flex-col flex-grow items-center justify-center">
      <SparklesIcon
        className={cn(
          llmCall ? "opacity-100" : "opacity-0",
          "w-16 h-auto mb-4 transition-opacity duration-500 2xl:-mt-72 -mt-36"
        )}
      />
      <ClassificationStep
        setLlmCall={setLlmCall}
        categories={categories}
        updateCategory={setCategory}
        text={data.text}
      />
      {step === 2 && (
        <ExtractionStep
          setLlmCall={setLlmCall}
          category={categories.find((c) => c.value === category)!}
        />
      )}
      {/* <Link
        className={cn(buttonVariants(), "mb-4 mx-4")}
        href={`/verification/${data.uuid}`}
      >
        Continue
      </Link> */}
    </div>
  );
}
