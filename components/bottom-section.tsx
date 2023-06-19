"use client";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export function BottomSection({
  className,
  username,
}: {
  className?: string;
  username: string;
}) {
  return (
    <div
      className={cn(
        className,
        "flex items-center border rounded-md border-slate-200 py-3 px-2.5 -ml-2"
      )}
    >
      <div className="rounded-full bg-slate-900 h-10 w-10 flex flex-none items-center justify-center">
        <span className="text-slate-100 font-bold">{username.slice(0, 2)}</span>
      </div>
      <span className="ml-2 text-slate-800 text-ellipsis overflow-hidden">
        {username}
      </span>
      <div
        onClick={() => console.log("log out")}
        className="ml-auto p-2 hover:cursor-pointer hover:bg-slate-100 hover:rounded"
      >
        <Icons.logOut className="h-5 w-5 text-slate-800 hover:text-slate-600" />
      </div>
    </div>
  );
}
