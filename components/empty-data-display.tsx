"use client";

import { Icons } from "./icons";

export function EmptyDataDisplay() {
  return (
    <div className="w-full h-full">
      <div className="h-64 2xl:h-96 w-full border border-dashed rounded-lg border-slate-300 bg-slate-50/75 flex flex-col items-center justify-center">
        <Icons.pieChart
          strokeWidth={1.4}
          className="w-8 h-auto text-slate-400"
        />
        <p className="text-lg mt-1 text-slate-400 text-center">
          No data to display.
        </p>
      </div>
    </div>
  );
}
