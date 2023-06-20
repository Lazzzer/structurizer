"use client";
import * as React from "react";
import { Step, StepType } from "./ui/step";

export default function MultiSteps({
  parentStep,
  parentStatus = "active",
}: {
  parentStep: number;
  parentStatus?: string;
}) {
  const steps: StepType[] = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Text Recognition" },
    { number: 3, title: "Data Extraction" },
    { number: 4, title: "Verification" },
  ];

  React.useEffect(() => {
    setCurrentStep(parentStep);
    setStatus(parentStatus);
  }, [parentStep, parentStatus]);

  const [currentStep, setCurrentStep] = React.useState(parentStep);
  const [status, setStatus] = React.useState(parentStatus);

  return (
    <div className="flex justify-center gap-10">
      <div
        style={{ width: "355px" }}
        className="bg-slate-200 h-1 absolute  mt-5 -z-10"
      ></div>
      {steps.map((step) => (
        <Step
          key={step.number}
          step={step}
          current={currentStep}
          status={status}
        />
      ))}
    </div>
  );
}
