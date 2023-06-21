import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "../icons";

export function HelpTooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-2">
            <Icons.help className="h-8 w-8" />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-72 px-6 py-4 text-slate-600 text-center">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
