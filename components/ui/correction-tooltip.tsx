import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

export function CorrectionTooltip({
  classNameTrigger,
  classNameContent,
  correction,
}: {
  classNameTrigger?: string;
  classNameContent?: string;
  correction: {
    field: string;
    issue: string;
    description: string;
    suggestion: string;
  };
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
          <div>
            <div className="mx-1 mt-2 mb-2">
              <h3 className="font-semibold ml-2 mb-0.5 text-slate-800">
                Issue
              </h3>
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
