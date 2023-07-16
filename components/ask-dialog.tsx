"use client";

import React, { useEffect, useState } from "react";
import { Icons, SparklesIcon } from "./icons";
import { Button } from "./ui/button";
import { CommandShortcut } from "./ui/command";
import { Dialog, DialogContentWithoutClose, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn, minDelay } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { useTypewriterEffect } from "./hooks/typewriter";
import { motion } from "framer-motion";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import TextareaAutosize from "react-textarea-autosize";

export function AskDialog() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function resetDialog() {
    setIsSent(false);
    setIsLoading(false);
    setQuestion("");
    setAnswer("");
  }

  async function sendQuestion(data: string) {
    setIsSent(true);
    setIsLoading(true);
    const res = await minDelay(
      fetch("/api/dashboard/ask", {
        method: "POST",
        body: JSON.stringify({ question: data }),
      }),
      500
    );
    setIsLoading(false);

    if (!res.ok) {
      setAnswer("Sorry, I cannot process your question.");
      return;
    }

    const { answer } = await res.json();
    setAnswer(answer);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const typedAnswer = useTypewriterEffect(answer, 20);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <AskButton setOpen={setOpen} />
      </DialogTrigger>
      <DialogContentWithoutClose
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="p-0 shadow-lg max-w-2xl focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0"
      >
        <div
          className={cn(
            "relative rounded-md bg-white transition delay-300 glow after:rounded-lg before:rounded-lg focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0",
            isLoading && "glow-active"
          )}
        >
          {isSent ? (
            <QuestionAnswerDisplay
              isLoading={isLoading}
              question={question}
              answer={answer}
              typedAnswer={typedAnswer}
              reset={(closing) => {
                setIsSent(false);
                setQuestion("");
                setAnswer("");
                if (closing) {
                  setOpen(false);
                }
              }}
            />
          ) : (
            <QuestionTextArea
              sendQuestion={sendQuestion}
              question={question}
              setQuestion={setQuestion}
            />
          )}
        </div>
      </DialogContentWithoutClose>
    </Dialog>
  );
}

const variants = {
  init: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
  removed: {
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

interface AskButtonProps {
  setOpen: (open: boolean) => void;
}

const AskButton = React.forwardRef<HTMLButtonElement, AskButtonProps>(
  ({ setOpen }, ref) => {
    return (
      <Button
        ref={ref}
        variant={"glowing"}
        size={"glowing"}
        className="rounded after:rounded-md before:rounded-md hover:after:rounded-md hover:before:rounded-md"
        onClick={() => setOpen(true)}
      >
        <Icons.sparkles width={18} height={18} className="inline-block mr-2" />
        Ask
        <CommandShortcut className="ml-1.5">⌘K</CommandShortcut>
      </Button>
    );
  }
);
AskButton.displayName = "AskButton";

interface QuestionAnswerDisplayProps {
  isLoading: boolean;
  question: string;
  answer: string;
  typedAnswer: string;
  reset: (closed: boolean) => void;
}

function QuestionAnswerDisplay({
  isLoading,
  question,
  answer,
  typedAnswer,
  reset,
}: QuestionAnswerDisplayProps) {
  return (
    <div className="py-5 px-6 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
      <div className="flex gap-3 items-start mb-5">
        <Icons.user
          width={32}
          height={32}
          className="p-1.5 shrink-0 bg-slate-800 text-white rounded-md"
        />
        <p className="max-h-[100px] w-full max-w-xl overflow-auto px-1 prose prose-slate prose-sm break-words text-slate-600">
          {question}
        </p>
      </div>
      <Separator />
      <div className="flex gap-3 mt-5">
        <div
          className={cn(
            "p-1.5 w-8 h-8 shrink-0 border rounded-md",
            isLoading
              ? "border-sky-300 bg-white"
              : "border-slate-300 fill-slate-900"
          )}
        >
          {isLoading ? (
            <SparklesIcon width={32} height={32} />
          ) : (
            <Icons.sparkles className="w-full h-full" />
          )}
        </div>
        <div
          className={cn(
            "min-h-[32px] w-full flex flex-col",
            isLoading ? "justify-center" : "justify-start"
          )}
        >
          {isLoading ? (
            <p className="text-slate-500 text-xs text-medium animate-pulse">
              The AI is looking for an answer. Please wait, this may take a
              while...
            </p>
          ) : (
            <>
              <ReactMarkdown
                className="max-h-[500px] w-full max-w-xl overflow-auto px-1 prose prose-slate prose-sm break-words text-slate-600"
                remarkPlugins={[remarkGfm]}
              >
                {typedAnswer}
              </ReactMarkdown>
              {answer.length === typedAnswer.length && (
                <motion.div
                  variants={variants}
                  initial="init"
                  animate="visible"
                  exit="removed"
                  transition={{ delay: 0.3 }}
                  className="flex w-full gap-2 justify-end"
                >
                  <Button
                    className="mt-4 text-slate-800"
                    size="sm"
                    variant={"ghost"}
                    onClick={() => reset(true)}
                  >
                    Close
                  </Button>
                  <Button
                    className="mt-4 text-slate-800"
                    size="sm"
                    variant={"outline"}
                    onClick={() => reset(false)}
                  >
                    <Icons.sparkles
                      width={14}
                      height={14}
                      className="inline-block mr-2"
                    />
                    Ask
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuestionTextAreaProps {
  sendQuestion: (data: string) => Promise<void>;
  question: string;
  setQuestion: (data: string) => void;
}

export function QuestionTextArea({
  sendQuestion,
  question,
  setQuestion,
}: QuestionTextAreaProps) {
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!question?.trim()) {
            return;
          }
          await sendQuestion(question);
        }}
        className="flex items-center border-b px-4 py-1 max-h-44 overflow-auto"
      >
        <Icons.sparkles
          width={20}
          height={20}
          className="mr-3 shrink-0 text-slate-700"
        />
        <TextareaAutosize
          tabIndex={0}
          rows={1}
          placeholder="Ask AI anything about your documents"
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!question?.trim()) {
                return;
              }
              sendQuestion(question);
            }
          }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="max-h-40 w-full grow resize-none rounded-md bg-transparent my-3 py-1 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
        />
        <Button
          type="submit"
          size="iconSm"
          className="w-[32px] h-[32px] ml-2 shrink-0"
        >
          <Icons.send className="h-4 w-auto" />
        </Button>
      </form>
      <Suggestions sendQuestion={sendQuestion} setQuestion={setQuestion} />
    </div>
  );
}

interface SuggestionsProps {
  sendQuestion: (data: string) => Promise<void>;
  setQuestion: (data: string) => void;
}

function Suggestions({ sendQuestion, setQuestion }: SuggestionsProps) {
  const suggestions = [
    "What is my most expensive receipt?",
    "How much do I spend on average in restaurants?",
  ];

  return (
    <div className="px-4 pt-2.5 pb-3">
      <h3 className="text-xs text-slate-500 font-semibold mb-1.5">
        Suggestions
      </h3>
      <div className="flex gap-2 items-center">
        {suggestions.map((suggestion) => (
          <Badge
            key={suggestion}
            onClick={async () => {
              setQuestion(suggestion);
              await sendQuestion(suggestion);
            }}
            variant={"secondary"}
            className="text-slate-500 font-medium cursor-pointer"
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
}
