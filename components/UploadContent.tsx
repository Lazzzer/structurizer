"use client";
import * as React from "react";
import MultiSteps from "./multi-steps";
import { Button } from "./ui/button";

export default function UploadContent() {
  const [currentStep, setCurrentStep] = React.useState(1);
  return (
    <div className="mt-8 mx-4">
      <MultiSteps parentStep={currentStep} />
      <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
    </div>
  );
}
