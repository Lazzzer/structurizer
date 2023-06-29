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
import { useStepStore } from "@/lib/store";

export default function VerificationPipeline({
  uuid,
  url,
  text,
  category,
  json,
}: {
  uuid: string;
  url: string;
  text: string;
  category: string;
  json: any;
}) {
  async function sendJson(json: any) {
    const res = await fetch("/api/verification", {
      method: "POST",
      body: JSON.stringify({
        uuid,
        json: JSON.stringify(verifiedJson),
      }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.message);
    }
  }

  async function analyze() {
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
  const [isUpdating, setUpdating] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{
    corrections: any[];
    textAnalysis: string;
  } | null>(null);
  const [verifiedJson, setVerifiedJson] = useState(JSON.parse(json));
  return (
    <div className="mx-4 mb-4 flex flex-col flex-grow">
      <div className="flex flex-1 flex-col justify-center">
        {isProcessed ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Icons.checkCircleInside
              strokeWidth={1.4}
              className="text-green-500 w-32 h-32 my-6"
            />
            <p className="text-center text-slate-500 mb-6">
              Your file has been processed successfully!
            </p>
            <Link className={cn(buttonVariants(), "w-40")} href={"/dashboard"}>
              Back to Dashboard
            </Link>
          </div>
        ) : (
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
                          maxHeight: "550px",
                        }}
                        className="px-4 py-2 h-auto mr-20 overflow-scroll"
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

              <div className="flex w-screen justify-end gap-2 items-center absolute -bottom-12 right-0">
                {errorMsg !== "" && (
                  <div className="text-sm text-red-500">{errorMsg}</div>
                )}
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
                    className="relative inline-flex w-36 overflow-hidden bg-slate-100 p-[1.5px] group"
                    onClick={() => {
                      setIsAnalyzing(true);
                      setErrorMsg("");
                      analyze()
                        .then((data) => {
                          setAnalysisResult(data);
                          setIsAnalyzing(false);
                        })
                        .catch((err) => {
                          console.error(err);
                          setErrorMsg(
                            "Something went wrong during analysis. Please try again."
                          );
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
                  disabled={isAnalyzing || isUpdating}
                  className="w-36"
                  onClick={() => {
                    setUpdating(true);
                    setErrorMsg("");
                    sendJson(json)
                      .then(() => {
                        setIsProcessed(true);
                        useStepStore.setState({ status: "complete" });
                        setUpdating(false);
                      })
                      .catch(() => {
                        setErrorMsg("Something went wrong, please try again");
                        setUpdating(false);
                      });
                  }}
                >
                  {isUpdating && (
                    <Icons.spinner
                      width={18}
                      height={18}
                      className="mr-2 animate-spin inline-block"
                    />
                  )}
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
