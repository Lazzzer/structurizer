"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

interface HelpPopoverProps {
  children: React.ReactNode;
  iconClassName?: string;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "end" | "center";
}

export function HelpPopover({
  children,
  iconClassName,
  contentClassName,
  side = "right",
  align = "center",
}: HelpPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Icons.help
          className={cn(
            "cursor-pointer w-4 h-auto text-slate-900 hover:text-slate-500 rounded-full",
            iconClassName
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn(
          "w-80 text-slate-800 max-h-56 h-full overflow-scroll",
          contentClassName
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
