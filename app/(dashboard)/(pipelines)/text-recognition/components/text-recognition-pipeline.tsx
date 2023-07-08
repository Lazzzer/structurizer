"use client";

import { minDelay } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textRecognitionSchema } from "@/lib/validations/text-recognition";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";

interface TextRecognitionPipelineProps {
  id: string;
  url: string;
  text: string;
  filename: string;
}

type FormData = z.infer<typeof textRecognitionSchema>;

export default function TextRecognitionPipeline({
  id,
  url,
  text,
  filename,
}: TextRecognitionPipelineProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(textRecognitionSchema),
    defaultValues: {
      id: id,
      text: text,
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const res = await minDelay(
      fetch("/api/pipelines/text-recognition", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
      400
    );
    setIsLoading(false);

    if (res.status !== 200) {
      form.setError("text", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      return;
    }
    router.push(`/data-extraction/${id}`);
  }

  return (
    <div className="mx-8 mb-8 flex flex-col flex-grow">
      <AnimatePresence mode="wait">
        <motion.div
          key="text-recognition"
          layout="position"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", delay: 0.3 },
            },
          }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-1 items-center justify-center gap-x-10"
        >
          <object
            data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fitH`}
            type="application/pdf"
            className="bg-slate-900 rounded-lg p-2 w-[37%] h-[85%] 2xl:w-[30%] 2xl:h-4/5"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-[37%] h-[85%] 2xl:w-[30%] 2xl:h-4/5 flex flex-col justify-between"
            >
              <div className="w-full h-[72%] 2xl:h-4/5">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem className="w-full h-full">
                      <FormLabel>
                        Text From
                        <span className="ml-1 truncate overflow-hidden font-semibold">
                          {filename}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="The text extracted from the PDF cannot be empty. Please add the missing text manually."
                          className="resize-none w-full h-full rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please make sure that the text above matches the text in
                        the PDF. Feel free to remove or edit any part of the
                        text.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => {
                    window.location.href = "/text-recognition";
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="w-48">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm & Continue
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
