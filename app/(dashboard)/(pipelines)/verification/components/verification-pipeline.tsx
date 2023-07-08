"use client";

import { CircleCheckIcon, Icons, SparklesIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, minDelay } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStepStore } from "@/lib/store";
import { ObjectViewer } from "./object-viewer";
import { Correction } from "types";

interface VerificationPipelineProps {
  id: string;
  url: string;
  text: string;
  category: string;
  json: string;
}

interface VerificationResult {
  corrections: Correction[];
  textAnalysis: string;
}

export default function VerificationPipeline({
  id,
  url,
  text,
  category,
  json,
}: VerificationPipelineProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verifiedJson, setVerifiedJson] = useState(JSON.parse(json));

  async function verify() {
    const res = await fetch("/api/pipelines/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        category,
        json: verifiedJson,
      }),
    });
    if (!res.ok) {
      throw new Error("An error occurred while analyzing the JSON object");
    }
    const data = (await res.json()) as VerificationResult;
    return data;
  }

  async function sendJson() {
    const res = await fetch("/api/pipelines/verification", {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        category: category,
        json: verifiedJson,
      }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.message);
    }
  }

  return (
    <div className="m-8 flex flex-col flex-grow">
      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {isCompleted && (
            <motion.div
              key="success"
              layout="position"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", delay: 0.4 },
                },
              }}
              viewport={{ once: true }}
              className="w-full h-full flex flex-col justify-center items-center 2xl:-mt-48 -mt-10"
            >
              <CircleCheckIcon
                strokeWidth={1.5}
                className="text-green-500 w-32 h-32 my-6"
              />
              <p className="text-center text-slate-500 mb-6">
                Your file has been processed successfully!
              </p>
              <Button
                type="button"
                className="w-40"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Back to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {!isCompleted && (
            <motion.div
              key="verification"
              layout="position"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring" },
                },
              }}
              transition={{ duration: 0.3 }}
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
                className="w-[37%] 2xl:w-[30%]"
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
                    className="w-full text-sm text-slate-700 whitespace-break-spaces overflow-auto"
                  >
                    {text}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="w-2/5 h-full flex flex-col justify-center relative">
                <div className="mb-2 flex justify-between">
                  <h1 className="text-2xl mb-1 mt-1 font-bold text-slate-800">
                    Structured Data
                  </h1>
                  <SparklesIcon
                    className={cn(
                      isVerifying ? "opacity-100" : "opacity-0",
                      "w-12 h-auto mb-4 transition-opacity duration-500 absolute right-14 -top-2"
                    )}
                  />
                  {verificationResult !== null && (
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
                            Show Verification Breakdown
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          style={{
                            width: "400px",
                            maxHeight: "550px",
                          }}
                          className="p-4 h-auto overflow-scroll"
                        >
                          <div className="flex items-center gap-2  mb-3">
                            <Icons.sparkles width={24} height={24} />
                            <h1 className="text-lg font-bold text-slate-800">
                              Verification Breakdown
                            </h1>
                          </div>

                          <p className="w-full text-sm whitespace-pre-wrap text-justify text-slate-600 mb-2 leading-snug">
                            {verificationResult.textAnalysis}
                          </p>
                        </PopoverContent>
                      </Popover>
                    </motion.div>
                  )}
                </div>

                <div className="w-full h-full rounded-lg p-[1px] overflow-hidden relative">
                  <span
                    className={cn(
                      isVerifying
                        ? "bg-white bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#80BBF8_50%,#00E1F0_100%)]"
                        : "bg-slate-200",
                      "absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                    )}
                  />
                  <ObjectViewer
                    category={category}
                    json={verifiedJson}
                    setVerifiedJson={setVerifiedJson}
                    corrections={
                      verificationResult?.corrections
                        ? new Map(
                            verificationResult.corrections.map((correction) => [
                              correction.field.replace(/\[.*\]/g, ""),
                              correction,
                            ])
                          )
                        : new Map<string, Correction>()
                    }
                  />
                </div>

                <div className="flex w-screen justify-end gap-2 items-center absolute -bottom-12 right-0">
                  {errorMessage !== "" && (
                    <div className="text-sm text-red-500">{errorMessage}</div>
                  )}
                  <Button
                    type="button"
                    variant={"secondary"}
                    onClick={() => {
                      window.location.href = "/verification";
                    }}
                  >
                    Cancel
                  </Button>
                  {verificationResult === null && (
                    <Button
                      disabled={isVerifying}
                      variant={"secondary"}
                      className="relative inline-flex w-36 overflow-hidden bg-slate-100 p-[1.5px] group"
                      onClick={async () => {
                        setIsVerifying(true);
                        setErrorMessage("");
                        try {
                          const data = await minDelay(verify(), 400);
                          setVerificationResult(data);
                        } catch (e) {
                          setErrorMessage(
                            "Something went wrong during verification. Please try again."
                          );
                        }
                        setIsVerifying(false);
                      }}
                    >
                      <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-slate-100 group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#80BBF8_50%,#00E1F0_100%)]" />
                      <span className="inline-flex h-full w-full items-center rounded justify-center bg-slate-100 px-3 py-1 backdrop-blur-3xl">
                        {(isVerifying && (
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
                        Verify
                      </span>
                    </Button>
                  )}
                  <Button
                    disabled={isVerifying || isLoading}
                    className="w-36"
                    onClick={async () => {
                      setErrorMessage("");
                      setIsLoading(true);
                      try {
                        await minDelay(sendJson(), 400);
                        setIsCompleted(true);
                        useStepStore.setState({ status: "complete" });
                      } catch (e) {
                        setErrorMessage(
                          e instanceof Error
                            ? e.message
                            : "Something went wrong, please try again"
                        );
                      }
                      setIsLoading(false);
                    }}
                  >
                    {isLoading && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
