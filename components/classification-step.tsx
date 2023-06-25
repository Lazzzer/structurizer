import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export function ClassificationStep({
  text,
  updateCategory,
}: {
  text: string;
  updateCategory: (category: string) => void;
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

  async function getClassification() {
    return "receipts";
    const res = await fetch("/api/classification", {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to classify text");
    }

    const { classification, confidence } = (await res.json()) as {
      classification: string;
      confidence: number;
    };

    if (confidence < 50) return "other";
    return classification;
  }

  const [status, setStatus] = useState<
    "active" | "failed" | "complete" | "confirmed"
  >("active");
  const [classification, setClassification] = useState("other");

  useEffect(() => {
    const classify = async () => {
      try {
        const category = await getClassification();
        setClassification(category);
        setStatus("complete");
      } catch (e) {
        setStatus("failed");
      }
    };
    classify();
  }, []);

  return (
    <div>
      {/* Step Text */}
      <div
        className={cn(
          status === "complete" || status === "confirmed"
            ? "text-slate-400"
            : "text-slate-700",
          "text-xl  font-medium"
        )}
      >
        <span className="font-bold">Step 1 : </span>
        <span>Classifying text</span>
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
        <p className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
          <span>
            <Balancer>
              The text is being classified. This might take a few seconds.
            </Balancer>
          </span>
        </p>
      )}
      {status === "complete" && (
        <div className="text-slate-700 text-sm mt-1 mb-2 w-64 leading-snug">
          <p>
            <Balancer>
              Text classified as
              <span className="font-semibold ml-1">
                {categories.find((c) => c.value === classification)?.name ??
                  "Other"}
                .
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
        <div className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
          <p>
            <Balancer>
              Text classified as
              <span className="font-semibold ml-1 text-slate-500">
                {categories.find((c) => c.value === classification)?.name ??
                  "Other"}
              </span>
            </Balancer>
          </p>
        </div>
      )}
      {status === "failed" && (
        <div className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
          <p></p>
          <Balancer>The text could not be classified.</Balancer>
          <p>Please specify the correct category.</p>
        </div>
      )}
      {/* Step Dropdown (not displayed when classifying) */}
      {status !== "active" && status !== "confirmed" && (
        <Select
          onValueChange={(value) => {
            if (status === "failed") setStatus("complete");
            setClassification(value);
          }}
          defaultValue={classification === "other" ? undefined : classification}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {/* Step Actions */}
      <div className="flex gap-2 mt-3">
        {status !== "confirmed" && (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            href={`/dashboard`}
          >
            Cancel
          </Link>
        )}
        {status !== "active" && status !== "confirmed" && (
          <Button
            disabled={
              categories.find((c) => c.value === classification) === undefined
            }
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
    </div>
  );
}
