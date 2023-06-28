"use client";
import Link from "next/link";
import { Icons, SparklesIcon } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { ObjectViewer } from "./object-viewer";
import { useState } from "react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function VerificationPipeline({
  uuid,
  url,
  text,
  category,
  json,
  filename,
}: {
  uuid: string;
  url: string;
  text: string;
  category: string;
  json: any;
  filename: string;
}) {
  async function analyze() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      corrections: [
        {
          field: "from",
          issue: "Incorrect total amount",
          description:
            "The total amount in the generated JSON is 102.27, but according to the original text, the total amount should be 82.27. The discrepancy might be due to a processing error.",
          suggestion: "Change the total amount to 82.27",
        },
        {
          field: "category",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "number",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "date",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "time",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "items",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "subtotal",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "tax",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "tip",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
        {
          field: "total",
          issue: "Missing item",
          description:
            "The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight.",
          suggestion:
            "Add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list.",
        },
      ],
      textAnalysis:
        "The first discrepancy I noticed was in the 'total' field. The total amount in the generated JSON is 102.27, but according to the original text, the total amount should be 82.27. This discrepancy might be due to a processing error where the total amount was incorrectly calculated or transcribed. My suggestion for correction is to change the total amount to 82.27 to match the original text.\n\nThe second discrepancy I noticed was in the 'items' field. The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight where the item was not included in the JSON output. My suggestion for correction is to add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list to match the original text. The first discrepancy I noticed was in the 'total' field. The total amount in the generated JSON is 102.27, but according to the original text, the total amount should be 82.27. This discrepancy might be due to a processing error where the total amount was incorrectly calculated or transcribed. My suggestion for correction is to change the total amount to 82.27 to match the original text.\n\nThe second discrepancy I noticed was in the 'items' field. The item 'Hitachino West' with a quantity of 1 and amount of 13.00 is missing in the generated JSON. This might be due to a processing error or oversight where the item was not included in the JSON output. My suggestion for correction is to add the item 'Hitachino West' with a quantity of 1 and amount of 13.00 to the items list to match the original text.",
    };
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        category,
        json: JSON.stringify(verifiedJson),
      }),
    });
    if (!res.ok) {
      throw new Error("An error occurred while analyzing the JSON object");
    }
    const data = await res.json();
    return data;
  }

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    corrections: any[];
    textAnalysis: string;
  } | null>(null);
  const [verifiedJson, setVerifiedJson] = useState(JSON.parse(json));
  return (
    <div className="mx-4 mb-4 flex flex-col flex-grow">
      <div className="flex flex-1 flex-col justify-center">
        <div
          style={{
            height: "80%",
          }}
          className="w-full flex justify-center items-start gap-x-10 -mt-12"
        >
          <Tabs
            style={{
              height: "calc(100% - 48px)",
            }}
            defaultValue="pdf"
            className="w-3/8 2xl:w-3/10"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pdf">PDF View</TabsTrigger>
              <TabsTrigger value="text">Text View</TabsTrigger>
            </TabsList>
            <TabsContent
              value="pdf"
              className="p-2 w-full h-full bg-slate-900 rounded-lg"
            >
              <object
                data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fitH`}
                type="application/pdf"
                className="w-full h-full rounded-md"
              />
            </TabsContent>
            <TabsContent
              value="text"
              className="w-full h-full border p-4 border-slate-200 rounded-lg"
            >
              <div
                style={{
                  maxHeight: "57vh", // preformatted elements really don't like height: 100%, so here we are...
                }}
                className="w-full text-xs text-slate-700 whitespace-break-spaces overflow-auto"
              >
                {text}
              </div>
            </TabsContent>
          </Tabs>
          <div className="w-2/5 h-full flex flex-col justify-center relative">
            <div className="mb-2 flex justify-between">
              <h1 className="text-2xl mb-2 font-bold text-slate-800">
                Extracted Data
              </h1>
              <SparklesIcon
                className={cn(
                  isAnalyzing ? "opacity-100" : "opacity-0",
                  "w-12 h-auto mb-4 transition-opacity duration-500 absolute right-14 -top-2"
                )}
              />
              {analysisResult !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"ghost"} className="h-10">
                        <Icons.sparkles
                          width={18}
                          height={18}
                          className="mr-2"
                        />
                        Show Textual Analysis
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      style={{
                        width: "400px",
                        height: "550px",
                      }}
                      className="px-4 py-2 mr-20 overflow-scroll"
                    >
                      <h1 className="text-lg font-bold text-slate-800 mb-2">
                        Textual Analysis
                      </h1>
                      <p className="w-full text-sm whitespace-pre-wrap text-justify text-slate-600 mb-2 leading-snug">
                        {analysisResult.textAnalysis}
                      </p>
                    </PopoverContent>
                  </Popover>
                </motion.div>
              )}
            </div>

            <div className="w-full h-full rounded-lg p-[1px] overflow-hidden relative">
              <span
                className={cn(
                  isAnalyzing
                    ? "bg-white bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#80BBF8_50%,#00E1F0_100%)]"
                    : "bg-slate-200",
                  "absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                )}
              />
              <ObjectViewer
                category={category}
                json={verifiedJson}
                setVerifiedJson={setVerifiedJson}
                corrections={analysisResult?.corrections ?? []}
              />
            </div>

            <div className="flex justify-end gap-2 items-center absolute -bottom-12 right-0">
              <Link
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                  })
                )}
                href="/dashboard"
              >
                Cancel
              </Link>
              {analysisResult === null && (
                <Button
                  disabled={isAnalyzing}
                  variant={"secondary"}
                  className="relative inline-flex w-40 overflow-hidden bg-slate-100 p-[1.5px] group"
                  onClick={() => {
                    setIsAnalyzing(true);
                    analyze()
                      .then((data) => {
                        setAnalysisResult(data);
                        setIsAnalyzing(false);
                      })
                      .catch((err) => {
                        console.error(err);
                        setIsAnalyzing(false);
                      });
                  }}
                >
                  <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-slate-100 group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#80BBF8_50%,#00E1F0_100%)]" />
                  <span className="inline-flex h-full w-full items-center rounded justify-center bg-slate-100 px-3 py-1 backdrop-blur-3xl">
                    {(isAnalyzing && (
                      <Icons.spinner
                        width={18}
                        height={18}
                        className="mr-2 animate-spin inline-block"
                      />
                    )) || (
                      <Icons.sparkles
                        width={18}
                        height={18}
                        className="inline-block mr-2"
                      />
                    )}
                    Analyze
                  </span>
                </Button>
              )}
              <Button
                disabled={isAnalyzing}
                className="w-40"
                onClick={() => {}}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
