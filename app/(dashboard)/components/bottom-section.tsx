"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Icons } from "@/components/icons";
import type { NavItem } from "types";

interface BottomSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  items: NavItem[];
}

export function BottomSection({
  className,
  username,
  items,
}: BottomSectionProps) {
  const path = usePathname();
  return (
    <div className={className}>
      <div className="flex">
        <div className="ml-2.5 h-12 w-0.5 bg-slate-300 rounded-full" />
        <ul role="list" className="mt-1">
          {items.map((item, index) => {
            const Icon = Icons[item.icon];
            return (
              <Link
                className="flex items-center ml-4 my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 focus-visible:rounded-sm"
                key={index}
                href={item.href}
                prefetch={false}
              >
                <span
                  className={cn(
                    path.includes(item.href) ? "bg-slate-800" : "bg-slate-300",
                    "absolute rounded-full  h-2 w-2"
                  )}
                  style={{ marginLeft: "-21px" }}
                ></span>
                <Icon
                  width={20}
                  height={20}
                  strokeWidth={2.5}
                  className="inline-block stroke-slate-800"
                />
                <span
                  className={cn(
                    path.includes(item.href) ? "font-bold" : "font-medium",
                    "ml-2 text-slate-800"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </ul>
      </div>
      <div
        className={cn(
          "flex items-center border rounded-md border-slate-200 py-3 px-2.5 -ml-4"
        )}
      >
        <div className="rounded-full bg-slate-900 h-10 w-10 flex flex-none items-center justify-center">
          <span className="text-slate-100 font-bold">
            {`${username.slice(0, 1).toUpperCase()}${username.slice(1, 2)}`}
          </span>
        </div>
        <span className="ml-2 text-slate-800 truncate overflow-hidden">
          {username}
        </span>
        <div
          onClick={() => {
            signOut({
              callbackUrl: "/login",
            });
          }}
          className="ml-auto p-2 hover:cursor-pointer hover:bg-slate-100 hover:rounded"
        >
          <Icons.logOut className="h-5 w-5 text-slate-800 hover:text-slate-600" />
        </div>
      </div>
    </div>
  );
}
