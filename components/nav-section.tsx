"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Icons;
};

export type NavSectionItems = {
  label: string;
  icon: keyof typeof Icons;
  items: NavItem[];
};

export function NavSection({
  className,
  section,
}: {
  className?: string;
  section: NavSectionItems;
}) {
  const path = usePathname();
  const SectionIcon = Icons[section.icon];
  return (
    <div className={className}>
      <div className="flex items-center">
        <SectionIcon
          width={22}
          height={22}
          strokeWidth={2.8}
          className="inline-block stroke-slate-900"
        />
        <span className="ml-2 text-xl font-bold text-slate-900">
          {section.label}
        </span>
      </div>
      <div className="flex">
        <div className="ml-2.5 h-32 w-0.5 bg-slate-300 rounded-full"></div>
        <ul role="list" className="mt-1">
          {section.items.map((item, index) => {
            const Icon = Icons[item.icon];
            return (
              <Link
                className="flex items-center ml-4 my-3"
                key={index}
                href={item.href}
              >
                <span
                  className={cn(
                    path === item.href ? "bg-slate-800" : "bg-slate-300",
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
                    path === item.href ? "font-bold" : "font-medium",
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
    </div>
  );
}
