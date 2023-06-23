import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";
import MultiSteps from "./multi-steps";

export function TopMainContent({
  title,
  step = null,
  displayUploadButton = false,
}: {
  title: string;
  displayUploadButton?: boolean;
  step?: number | null;
}) {
  return (
    <div className="border-slate-200 border-b-2 flex-none flex items-end justify-center relative h-32">
      <h1
        className={cn(
          step !== null ? "text-3xl " : "text-4xl",
          "hidden lg:block mb-6 ml-10 absolute font-cal left-0 bottom-0"
        )}
      >
        {title}
      </h1>
      {step !== null && <MultiSteps parentStep={step} />}

      {displayUploadButton && (
        <Link
          className={cn(
            buttonVariants(),
            "mb-6 mr-4 absolute right-0 bottom-0"
          )}
          href={"/upload"}
        >
          <Icons.upload
            width={18}
            height={18}
            className="mr-2 stroke-slate-100"
          />
          Upload Files
        </Link>
      )}
    </div>
  );
}
