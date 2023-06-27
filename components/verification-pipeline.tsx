"use client";
import Link from "next/link";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { ObjectViewer } from "./object-viewer";
import { useState } from "react";
import { motion } from "framer-motion";

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
    return {
      corrections: [],
      textAnalysis:
        "Upon analyzing the original text and the generated JSON output, I noticed two discrepancies. First, the item 'Hitachino West' with a quantity of 1 and an amount of 13.00 is missing from the items list in the generated JSON output. This item should be added to the items list to accurately represent the original text. Second, the total amount in the generated JSON output is incorrect. The output shows a total amount of 102.27, while the original text has a total amount of 82.27. The total amount in the generated JSON output should be corrected to 82.27 to match the original text.",
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

  const [isAnalyzing, setisAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button variant={"ghost"} className="h-10">
                    <Icons.sparkles width={18} height={18} className="mr-2" />
                    Show Textual Analysis
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="w-full h-full rounded-lg border border-slate-200 p-3 overflow-hidden">
              <ObjectViewer
                category={category}
                json={verifiedJson}
                setVerifiedJson={setVerifiedJson}
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
                    setisAnalyzing(true);
                    analyze()
                      .then((data) => {
                        setAnalysisResult(data);
                        setisAnalyzing(false);
                      })
                      .catch((err) => {
                        console.error(err);
                        setisAnalyzing(false);
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
              <Button className="w-40" onClick={() => {}}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
