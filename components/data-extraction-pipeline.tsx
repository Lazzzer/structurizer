"use client";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import { ClassificationStep } from "./classification-step";
import { ExtractionStep } from "./extraction-step";

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

  useEffect(() => {
    if (category !== "other") {
      setStep(2);
    }
  }, [category]);

  return (
    <div className="mx-4 flex flex-col flex-grow items-center justify-center">
      <Icons.sparkles
        strokeWidth={0}
        className="w-24 mb-4 h-auto 2xl:-mt-64 -mt-32"
      />
      <ClassificationStep
        categories={categories}
        updateCategory={setCategory}
        text={data.text}
      />
      {step === 2 && (
        <ExtractionStep
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
