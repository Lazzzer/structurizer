"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Extraction } from "@prisma/client";

interface ExtractionSelectProps {
  form: any;
  name: string;
  extractions: Extraction[];
}

export function ExtractionSelect({
  form,
  name,
  extractions,
}: ExtractionSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>Extraction UUID</FormLabel>
          <Select
            onValueChange={field.onChange as (value: string) => void}
            defaultValue={field.value ?? undefined}
          >
            <FormControl>
              <SelectTrigger className="w-[550px]">
                <SelectValue placeholder="Select an extraction as example" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Extractions</SelectLabel>
                {extractions.map((extraction) => (
                  <SelectItem key={extraction.id} value={extraction.id}>
                    {extraction.id} - {extraction.filename}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
