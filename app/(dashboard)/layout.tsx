import { BottomSection } from "@/components/bottom-section";
import { NavSection, NavSectionItems } from "@/components/nav-section";
import Image from "next/image";
import Link from "next/link";

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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Sidenav */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r-2 border-slate-200 bg-white pl-8 pr-6 pb-4">
          {/* Logo */}
          <Link href="/dashboard">
            <Image
              className="flex mt-8 shrink-0"
              priority
              src="/logo.svg"
              width={205}
              height={38}
              alt="Structurizer logo"
            />
          </Link>
          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <NavSection className="mt-20" section={pipelines} />
            <NavSection className="mt-10" section={structuredData} />
            <div className="flex flex-1 flex-col gap-y-7">
              <BottomSection className="mt-auto" username="Lazzzer" />
            </div>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
