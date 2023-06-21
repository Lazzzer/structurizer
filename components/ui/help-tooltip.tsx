import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

export function HelpTooltip({
  children,
  classNameTrigger,
  classNameContent,
}: {
  children: React.ReactNode;
  classNameTrigger?: string;
  classNameContent?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(classNameTrigger, "rounded-full")}
          >
            <Icons.help />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={cn(classNameContent)}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
