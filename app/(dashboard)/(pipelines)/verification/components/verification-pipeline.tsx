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
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

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
      throw new Error("An error occurred while verifying the JSON object");
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
    if (!res.ok) {
      if (res.status === 422) {
        setErrorMessage(
          "Please make sure all the field values are valid and try again."
        );
      } else {
        setErrorMessage(
          "Something went wrong during verification. Please try again."
        );
      }
      throw new Error("An error occurred while sending the JSON object");
    }
  }

  return (
    <div className="m-8 flex flex-col flex-grow">
      <div className="flex flex-1 flex-col justify-center -mt-2">
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
                height: "90%",
              }}
              className="w-full flex justify-center items-start gap-x-10 -mt-12"
            >
              <Tabs
                style={{
                  height: "calc(100% - 48px)",
                }}
                defaultValue="pdf"
                className="w-[40%] 2xl:w-[30%]"
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
                      maxHeight: "60vh",
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
                            Show Verification Report
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
                              Verification Report
                            </h1>
                          </div>
                          <ReactMarkdown
                            className="w-full overflow-auto px-1 prose prose-slate prose-sm break-words text-slate-600"
                            remarkPlugins={[remarkGfm]}
                          >
                            {verificationResult.textAnalysis}
                          </ReactMarkdown>
                        </PopoverContent>
                      </Popover>
                    </motion.div>
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-500 ease-in-out w-full h-full rounded-lg relative border border-slate-200 before:rounded-lg after:rounded-lg glow",
                    isVerifying && "border-transparent glow-active"
                  )}
                >
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

                <div className="flex w-screen justify-end gap-2 items-center absolute -bottom-14 right-0">
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
                      variant={"glowing"}
                      size={"glowing"}
                      className="rounded after:rounded-md before:rounded-md hover:after:rounded-md hover:before:rounded-md"
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
                      } catch (_) {}
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
