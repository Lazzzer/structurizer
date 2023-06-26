"use client";
import Link from "next/link";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";

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
            <h1 className="text-2xl mb-1 font-bold text-slate-800">
              Extracted Data
            </h1>
            <div className="bg-red-200 w-full h-full">json structure</div>
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
              <Button
                variant={"secondary"}
                className="relative inline-flex w-40 overflow-hidden bg-slate-100 p-[1.5px] group"
              >
                <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-slate-100 group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#FD95FF_0%,#FD95FF_50%,#00E1F0_100%)]" />
                <span className="inline-flex h-full w-full items-center rounded justify-center bg-slate-100 px-3 py-1 backdrop-blur-3xl">
                  <Icons.sparkles
                    width={18}
                    height={18}
                    className="inline-block mr-2 group-hover:pulse"
                  />
                  Analyze
                </span>
              </Button>
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
