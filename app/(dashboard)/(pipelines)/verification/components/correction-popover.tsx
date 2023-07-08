"use client";

import { Icons } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Correction } from "types";

interface CorrectionPopoverProps {
  iconClassName?: string;
  contentClassName?: string;
  correction: Correction;
}

export function CorrectionPopover({
  iconClassName,
  contentClassName,
  correction,
}: CorrectionPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Icons.alertCircle
          className={cn(
            "cursor-pointer  text-red-500 rounded-full h-5 w-5 p-0.5 hover:bg-red-100 hover:text-red-600",
            iconClassName
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        align="center"
        hideWhenDetached
        className={cn(
          "p-2 w-80 text-slate-800 max-h-[500px] h-full overflow-scroll",
          contentClassName
        )}
      >
        <div className="mx-1 mt-1 mb-2">
          <h3 className="font-semibold ml-2 mb-0.5 text-slate-800">Issue</h3>
          <p className="text-slate-600 px-2.5 py-1.5 text-sm bg-slate-50 rounded leading-snug text-justify">
            {correction.issue}
          </p>
        </div>
        <div className="mx-1 my-1">
          <h3 className="font-semibold ml-2 mb-0.5 text-slate-800">
            Description
          </h3>
          <p className="text-slate-600 px-2.5 py-1.5 text-sm bg-slate-50 rounded leading-snug text-justify">
            {correction.description}
          </p>
        </div>
        <div className="mx-1 mt-2 mb-2">
          <h3 className="font-semibold ml-2 mb-0.5 text-slate-800">
            Suggestion
          </h3>
          <p className="text-slate-600 px-2.5 py-1.5 text-sm bg-slate-50 rounded leading-snug text-justify">
            {correction.suggestion}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
