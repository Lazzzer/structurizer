import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/session";
import { BottomSection } from "./components/bottom-section";
import { NavSection } from "./components/nav-section";
import type { NavItem, NavSectionItems } from "types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const pipelines: NavSectionItems = {
  label: "Pipelines",
  icon: "layers",
  items: [
    {
      label: "Text Recognition",
      href: "/text-recognition",
      icon: "textSelect",
    },
    {
      label: "Data Extraction",
      href: "/data-extraction",
      icon: "braces",
    },
    {
      label: "Verification",
      href: "/verification",
      icon: "checkCircle",
    },
  ],
};

const structuredData: NavSectionItems = {
  label: "Structured Data",
  icon: "grid",
  items: [
    {
      label: "Receipts",
      href: "/receipts",
      icon: "receipt",
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: "invoice",
    },
    {
      label: "Card Statements",
      href: "/card-statements",
      icon: "creditCard",
    },
  ],
};

const bottomItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <div className="min-h-screen flex">
      {/* Sidenav */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r-2 border-slate-200 bg-white pl-8 pr-6 pb-4">
          {/* Logo */}
          <Link
            href="/dashboard"
            prefetch={false}
            className="mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 focus-visible:rounded-sm"
          >
            <Image
              className="flex shrink-0"
              priority
              src="/logo.svg"
              width={205}
              height={38}
              style={{ width: "auto", height: "auto" }}
              alt="Structurizer logo"
            />
          </Link>
          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <NavSection className="mt-20" section={pipelines} />
            <NavSection className="mt-10" section={structuredData} />
            <div className="flex flex-1 flex-col gap-y-7">
              <BottomSection
                className="mt-auto"
                username={user.name}
                items={bottomItems}
              />
            </div>
          </nav>
        </div>
      </div>
      {/* Main */}
      <main className="pl-72 w-full">{children}</main>
    </div>
  );
}
