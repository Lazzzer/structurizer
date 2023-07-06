import { TopMainContent } from "@/components/top-main-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" step={0} />
      <div className="mx-8 mb-8 flex flex-col flex-grow">
        <div className="flex flex-1 items-center justify-center gap-x-10">
          <Skeleton className="rounded-lg p-2 w-[37%] h-[85%] 2xl:w-[30%] 2xl:h-4/5" />
          <div className="w-[37%] h-[85%] 2xl:w-[30%] 2xl:h-4/5 flex flex-col justify-between">
            <div className="w-full h-[72%] 2xl:h-4/5">
              <div className="w-full h-full">
                <Skeleton className="w-[200px] ml-1 h-[17px] mt-1 rounded" />
                <Skeleton className="w-full h-full rounded-lg mt-[9px]" />
                <Skeleton className="w-[95%] h-[40px] rounded-lg mt-[9px]" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Skeleton className="w-[78px] h-[40px]" />
              <Skeleton className="w-48 h-[40px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
