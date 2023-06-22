import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";

export function TopMainContent({
  title,
  displayUploadButton = false,
}: {
  title: string;
  displayUploadButton?: boolean;
}) {
  return (
    <div className="h-1/5 border-slate-200 border-b-2 flex items-end justify-between">
      <h1 className="mb-4 ml-10 font-cal text-4xl">{title}</h1>
      {displayUploadButton && (
        <Link className={cn(buttonVariants(), "mb-4 mr-4")} href={"/upload"}>
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
