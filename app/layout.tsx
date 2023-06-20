// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const calSans = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal-sans",
});

const title = "Structurizer";
const description =
  "Structurizer is a web application that helps you exctract structured data from unstructured text.";

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
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
        {children}
      </body>
    </html>
  );
}
