"use client";

import { useEffect, useState } from "react";
import { Icons, SparklesIcon } from "./icons";
import { Button } from "./ui/button";
import { CommandShortcut } from "./ui/command";
import { Dialog, DialogContentWithoutClose, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { cn, minDelay } from "@/lib/utils";

const variants = {
  init: {
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  removed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function AskDialog() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(true);

  async function sendQuestion(data: string) {
    setIsSent(true);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const a = `
    Your last overall expenses are as follows:

    - $8100
    - $2050
    - $234.05
    - $82.27
    - $62.3
    - $41.14`;
    setIsLoading(false);
    setAnswer(a);

    // setIsSent(true);
    // setIsLoading(true);
    // const res = await minDelay(
    //   fetch("/api/dashboard/ask", {
    //     method: "POST",
    //     body: JSON.stringify({ question: data }),
    //   }),
    //   500
    // );
    // setIsLoading(false);
    // const { answer } = await res.json();
    // setAnswer(answer);
  }

  useEffect(() => {
    console.log("useffect");
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!open) {
          setIsSent(false);
          setIsLoading(false);
          setQuestion("");
          setAnswer(null);
        }
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"glowing"}
          size={"glowing"}
          className="rounded after:rounded-md before:rounded-md hover:after:rounded-md hover:before:rounded-md"
          onClick={() => setOpen(true)}
        >
          <Icons.sparkles
            width={18}
            height={18}
            className="inline-block mr-2"
          />
          Ask
          <CommandShortcut className="ml-1.5">⌘K</CommandShortcut>
        </Button>
      </DialogTrigger>
      <DialogContentWithoutClose className="p-0 shadow-lg max-w-xl">
        <div
          className={cn(
            "rounded-md relative bg-white transition delay-300 glow after:rounded-lg before:rounded-lg",
            isLoading && "glow-active"
          )}
        >
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div
                layoutId="question-display"
                layout="size"
                initial="init"
                animate="visible"
                exit="removed"
                variants={variants}
                className="py-5 px-6"
              >
                <div className="flex gap-3 items-start pb-3">
                  <Icons.user
                    width={32}
                    height={32}
                    className="p-1.5 shrink-0 bg-slate-800 text-white rounded-md"
                  />
                  <p className="max-h-[200px] overflow-auto prose break-words prose-pre:p-0 leading-normal text-slate-600 mt-0.5">
                    {question}
                  </p>
                </div>
                <Separator />
                {isLoading ? (
                  <div className="flex gap-3 items-center pt-3">
                    <div className="p-1.5 w-8 h-8 shrink-0 bg-white border border-sky-300 rounded-md">
                      <SparklesIcon width={32} height={32} className="" />
                    </div>
                    <p className="text-slate-400 text-xs text-medium">
                      The AI is looking for an answer. Please wait, this may
                      take a while...
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3 items-start pt-3">
                    <Icons.sparkles
                      width={32}
                      height={32}
                      className="p-1.5 shrink-0 bg-white fill-slate-900  border border-slate-300 rounded-md"
                    />
                    <p>{answer}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                layoutId="question-input"
                layout="position"
                initial={false}
                animate={"visible"}
                exit={"removed"}
                variants={variants}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!question?.trim()) {
                      return;
                    }
                    await sendQuestion(question);
                  }}
                  className="flex items-center border-b px-3"
                >
                  <Icons.sparkles className="mr-2 h-4 w-4 shrink-0 text-slate-700" />
                  <input
                    type="text"
                    placeholder="Ask AI anything about your documents"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
                  />
                  <Button
                    type="submit"
                    size="iconSm"
                    className="w-[30px] h-[30px] ml-2 shrink-0"
                  >
                    <Icons.send className="h-4 w-auto" />
                  </Button>
                </form>
                <div className="px-4 pt-2.5 pb-3">
                  <h3 className="text-xs text-slate-500 font-semibold mb-1.5">
                    Suggestions
                  </h3>
                  <div className="flex justify-between items-center">
                    <Badge
                      onClick={async () => {
                        const question = "What is my most expensive receipt?";
                        setQuestion(question);
                        await sendQuestion(question);
                      }}
                      variant={"secondary"}
                      className="text-slate-500 font-medium cursor-pointer"
                    >
                      What is my most expensive receipt?
                    </Badge>
                    <Badge
                      onClick={async () => {
                        const question =
                          "How much do I spend on average in restaurants?";
                        setQuestion(question);
                        await sendQuestion(question);
                      }}
                      variant={"secondary"}
                      className="text-slate-500 font-medium cursor-pointer"
                    >
                      How much do I spend on average in restaurants?
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContentWithoutClose>
    </Dialog>
  );
}
