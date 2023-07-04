import { TopMainContent } from "@/components/top-main-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full">
      <TopMainContent title="Settings" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <div>
          <Skeleton className="h-[32px] w-[330px] mb-2" />
          <Skeleton className="h-[783px] w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-[32px] w-[105px] mb-2" />
          <Skeleton className="h-[139px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
