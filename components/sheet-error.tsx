"use client";

import { Icons } from "./icons";
import { Button } from "./ui/button";

export function SheetError() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center my-4 relative text-slate-700">
      <Icons.frown strokeWidth={1.8} className="w-20 h-20 mb-2" />
      <p className="font-semibold">Oops! Something went wrong...</p>
      <p className="text-sm mb-4">Please reload the page</p>
      <Button className="w-40" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
}
