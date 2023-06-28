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
            <div>
              <h3>Issue</h3>
              <p>{correction.issue}</p>
            </div>
            <div>
              <h3>Description</h3>
              <p>{correction.description}</p>
            </div>
            <div>
              <h3>Suggestion</h3>
              <p>{correction.suggestion}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
