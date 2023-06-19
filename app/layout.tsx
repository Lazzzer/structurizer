// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthStatus from "@/components/auth-status";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const calSans = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal-sans",
});

const title = "Next.js Prisma Postgres Auth Starter";
const description =
  "This is a Next.js starter kit that uses Next-Auth for simple email + password login and a Postgres database to persist the data.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          calSans.variable
        )}
      >
        <Toaster />
        <Suspense fallback="Loading...">
          <AuthStatus />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
