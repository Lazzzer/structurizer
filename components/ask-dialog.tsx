"use client";

import { useEffect, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { CommandShortcut } from "./ui/command";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { minDelay } from "@/lib/utils";

export function AskDialog() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  async function sendQuestion() {
    setIsLoading(true);

    const res = await minDelay(
      fetch("/api/dashboard/ask", {
        method: "POST",
        body: JSON.stringify({ question }),
      }),
      500
    );
    setIsLoading(false);
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
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="relative inline-flex w-28 overflow-hidden bg-slate-100 p-[1.5px] group"
          onClick={() => setOpen(true)}
        >
          <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-slate-100 bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#80BBF8_50%,#00E1F0_100%)]" />
          <span className="inline-flex h-full w-full items-center rounded justify-center bg-slate-100 px-3 py-1 backdrop-blur-3xl">
            <Icons.sparkles
              width={18}
              height={18}
              className="inline-block mr-2"
            />
            Ask
            <CommandShortcut>⌘K</CommandShortcut>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-xl">
        <div className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 dark:[&_[cmdk-group-heading]]:text-slate-400">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion();
            }}
            className="flex items-center border-b px-3"
          >
            <Icons.sparkles className="mr-2 h-4 w-4 shrink-0 text-slate-700" />
            <input
              type="text"
              placeholder="Ask AI anything about your documents..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                width: "calc(100% - 50px)",
              }}
              className="flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
            />
          </form>
          {isLoading && <div>Loading</div>}
          {answer && <div>{answer}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
