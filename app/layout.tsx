// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-wrap-balancer";

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
  "Structurizer is a web application that helps you extract structured data from PDF files.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`,
  },
  description: description,
  keywords: ["LLM", "langchain", "Next.js", "React"],
  authors: [
    {
      name: "lazzzer",
      url: "https://github.com/Lazzzer",
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `/site.webmanifest`,
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
        <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
