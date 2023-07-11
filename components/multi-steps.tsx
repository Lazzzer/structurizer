"use client";

import type { StepType } from "types";
import { Step } from "./ui/step";
import { useStepStore } from "@/lib/store";

export default function MultiSteps() {
  const steps: StepType[] = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Text Recognition" },
    { number: 3, title: "Data Extraction" },
    { number: 4, title: "Verification" },
  ];

  const { current, status } = useStepStore();

  return (
    <div className="flex justify-center gap-10 py-6">
      <div
        style={{ width: "355px" }}
        className="bg-slate-200 h-1 absolute  mt-5 -z-10"
      ></div>
      {steps.map((step) => (
        <Step key={step.number} step={step} current={current} status={status} />
      ))}
    </div>
  );
}
