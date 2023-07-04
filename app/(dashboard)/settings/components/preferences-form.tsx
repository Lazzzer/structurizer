"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { preferencesSchema } from "@/lib/validations/preferences";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Balancer from "react-wrap-balancer";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Extraction, Preferences } from "@prisma/client";
import { ExtractionSelect } from "./extraction-select";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { minDelay } from "@/lib/utils";

interface PreferencesFormProps {
  preferences: Preferences;
  extractions: Extraction[];
}

export function PreferencesForm({
  preferences,
  extractions,
}: PreferencesFormProps) {
  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      classificationModel: preferences.classificationModel,
      extractionModel: preferences.extractionModel,
      analysisModel: preferences.analysisModel,
      enableReceiptsOneShot: !!preferences.receiptExampleExtractionId,
      enableInvoicesOneShot: !!preferences.invoiceExampleExtractionId,
      enableCardStatementsOneShot:
        !!preferences.cardStatementExampleExtractionId,
      receiptExampleExtractionId: preferences.receiptExampleExtractionId,
      invoiceExampleExtractionId: preferences.invoiceExampleExtractionId,
      cardStatementExampleExtractionId:
        preferences.cardStatementExampleExtractionId,
    },
  });

  const [isUpdating, setUpdating] = useState(false);

  async function onSubmit(values: z.infer<typeof preferencesSchema>) {
    setUpdating(true);
    const request = fetch("/api/account", {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const res = await minDelay(request, 500);
    setUpdating(false);

    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Your preferences could not be updated. Please try again.",
      });
    } else {
      toast({
        title: "Preferences updated.",
        description: (
          <span className="flex items-center gap-2">
            Your preferences have been updated.
            <Icons.checkCircleInside
              strokeWidth={2}
              width={24}
              height={24}
              className="text-green-500 inline-block"
            />
          </span>
        ),
      });
    }

    console.log(values);
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <Form {...form}>
        <h2 className="font-bold text-slate-800 text-lg">
          Select Language Model
        </h2>
        <p className="text-slate-600 text-sm">
          You can choose between multiple language models for each step of the
          data extraction process.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          {/* Text Classification */}
          <FormField
            control={form.control}
            name="classificationModel"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Text Classification</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      <SelectItem value="gpt-3.5-turbo">
                        gpt-3.5-turbo
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo-16k">
                        gpt-3.5-turbo-16k
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription className="text-slate-500 text-xs w-4/5">
                  <Balancer>
                    The model classifies the text into the three main categories
                    available in the app. This task is handled very well by most
                    models.
                  </Balancer>
                  <span className="text-slate-400 text-xs mt-1 w-3/5 inline-block">
                    Recommended:{" "}
                    <span className="font-medium">gpt-3.5-turbo-16k</span>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Data Extraction */}
          <FormField
            control={form.control}
            name="extractionModel"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Data Extraction</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      <SelectItem value="gpt-3.5-turbo">
                        gpt-3.5-turbo
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo-16k">
                        gpt-3.5-turbo-16k
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription className="text-slate-500 text-xs w-3/5">
                  <Balancer>
                    The model is structuring the data from the text following a
                    schema of the chosen category. Models with larger context
                    window are better suited for the task if the provided
                    documents are long and complex.
                  </Balancer>
                  <span className="text-slate-400 text-xs mt-1 w-4/5 inline-block">
                    Recommended:{" "}
                    <span className="font-medium">gpt-3.5-turbo-16k</span>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Analysis */}
          <FormField
            control={form.control}
            name="analysisModel"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Analysis</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      <SelectItem value="gpt-3.5-turbo-16k">
                        gpt-3.5-turbo-16k
                      </SelectItem>
                      <SelectItem value="gpt-4">gpt-4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription className="text-slate-500 text-xs w-3/5">
                  <Balancer>
                    The model analyzes the extracted data to find errors by
                    comparing it to the schema and the original text. This task
                    should be handled by the most capable models to ensure the
                    best results and reduce inaccuracies.
                  </Balancer>
                  <span className="text-slate-400 text-xs mt-1 w-4/5 inline-block">
                    Recommended: <span className="font-medium">gpt-4</span>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6">
            <h2 className="font-bold text-slate-800 text-lg">
              One-Shot Learning
            </h2>
            <p className="text-slate-600 text-sm mb-2">
              You can define an existing Data Extraction as example for the next
              extractions of the same category.
            </p>
            <p className="text-slate-500 text-xs mt-1 w-3/5">
              <Balancer>
                This technique can greatly improve the accuracy of the models if
                your documents are similar. It is recommended to use a model
                with a context window large enough to process the example and
                the new document.
              </Balancer>
            </p>
            <p className="text-slate-500 text-xs mt-1 w-3/5">
              <Balancer>
                The feature is available while there is at least one extraction
                of the corresponding category.
              </Balancer>
            </p>
            {/* Enable One-Shot Learning for Receipts */}
            <FormField
              control={form.control}
              name="enableReceiptsOneShot"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center mt-4">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      disabled={
                        extractions.filter(
                          (extraction) => extraction.category === "receipts"
                        ).length === 0
                      }
                    />
                  </FormControl>
                  <FormLabel>Enable For Receipts</FormLabel>
                </FormItem>
              )}
            />
            {form.getValues("enableReceiptsOneShot") && (
              <ExtractionSelect
                form={form}
                name="receiptExampleExtractionId"
                extractions={extractions.filter(
                  (extraction) => extraction.category === "receipts"
                )}
              />
            )}
            {/* Enable One-Shot Learning for Invoices */}
            <FormField
              control={form.control}
              name="enableInvoicesOneShot"
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center mt-4">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      disabled={
                        extractions.filter(
                          (extraction) => extraction.category === "invoices"
                        ).length === 0
                      }
                    />
                  </FormControl>
                  <FormLabel className="inline-block">
                    Enable For Invoices
                  </FormLabel>
                </FormItem>
              )}
            />
            {form.getValues("enableInvoicesOneShot") && (
              <ExtractionSelect
                form={form}
                name="invoiceExampleExtractionId"
                extractions={extractions.filter(
                  (extraction) => extraction.category === "invoices"
                )}
              />
            )}
            {/* Enable One-Shot Learning for Card Statements */}
            <FormField
              control={form.control}
              name="enableCardStatementsOneShot"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center mt-4">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      disabled={
                        extractions.filter(
                          (extraction) =>
                            extraction.category === "credit card statements"
                        ).length === 0
                      }
                    />
                  </FormControl>
                  <FormLabel>Enable For Card Statements</FormLabel>
                </FormItem>
              )}
            />
            {form.getValues("enableCardStatementsOneShot") && (
              <ExtractionSelect
                form={form}
                name="cardStatementExampleExtractionId"
                extractions={extractions.filter(
                  (extraction) =>
                    extraction.category === "credit card statements"
                )}
              />
            )}
          </div>
          <Button disabled={isUpdating} className="w-44 mt-8" type="submit">
            {isUpdating && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Preferences
          </Button>
        </form>
      </Form>
    </div>
  );
}
