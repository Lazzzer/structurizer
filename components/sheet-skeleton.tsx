"use client";

import { Skeleton } from "./ui/skeleton";

export function SheetSkeleton() {
  return (
    <div className="h-full w-full my-4 relative">
      <Skeleton className="h-8 w-[100px] rounded-md" />
      <div className="w-full">
        <div className="mt-10 flex justify-between items-center">
          <Skeleton className="h-6 w-[100px] rounded-md" />
          <Skeleton className="h-4 w-[100px] rounded" />
        </div>
        <div className="mt-6 flex justify-between">
          <div>
            <Skeleton className="h-5 w-[65px] rounded mb-1" />
            <Skeleton className="h-4 w-[150px] rounded" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-5 w-[65px] rounded mb-1" />
            <Skeleton className="h-4 w-[50px] rounded" />
          </div>
        </div>
        <div className="mt-3">
          <div>
            <Skeleton className="h-5 w-[80px] rounded mb-1" />
            <Skeleton className="h-4 w-[150px] rounded" />
          </div>
        </div>
        <div className="mt-6">
          <div>
            <Skeleton className="h-6 w-[65px] rounded-md" />
            <div className="mt-2 w-full">
              <Skeleton className="h-5 w-full rounded-md" />
            </div>
            <div className="h-52 2xl:h-96 overflow-scroll mt-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[65px] rounded" />
            <Skeleton className="h-4 w-[100px] rounded" />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Skeleton className="h-5 w-[65px] rounded" />
            <Skeleton className="h-4 w-[100px] rounded" />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Skeleton className="h-5 w-[65px] rounded" />
            <Skeleton className="h-4 w-[100px] rounded" />
          </div>
        </div>
        <div className="mt-8 flex flex-col items-end">
          <Skeleton className="h-8 w-[65px] rounded-md mb-2" />
          <Skeleton className="h-5 w-[100px] rounded" />
        </div>
      </div>
      <div className="w-full flex gap-2 items-center justify-between absolute bottom-2 right-0">
        <Skeleton className="h-6 w-[125px] rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
