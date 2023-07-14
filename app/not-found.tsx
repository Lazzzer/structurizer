import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-screen h-screen grid place-items-center place-content-center text-slate-800">
      <Image
        priority
        src="/logo.svg"
        width={75}
        height={25}
        style={{ width: "auto", height: "auto" }}
        alt="Structurizer logo"
      />
      <h1 className="text-2xl font-cal mt-4 mb-2">404 - Not Found</h1>
      <Link
        className={cn(
          buttonVariants({
            variant: "link",
          })
        )}
        href="/dashboard"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
