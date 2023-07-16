import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "../components/auth-form";
import { HelpPopover } from "@/components/ui/help-popover";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your Structurizer account",
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center">
          <Image
            className="mx-auto"
            priority
            src="/logo.svg"
            width={302}
            height={57}
            style={{ width: "auto", height: "auto" }}
            alt="Structurizer logo"
          />
          <h1 className="text-2xl mt-8 font-semibold tracking-tight">
            Create your account
          </h1>
          <div className="text-slate-700 items-center justify-center mt-1.5 flex gap-1">
            <h2 className="font-medium">What is this about</h2>
            <HelpPopover
              iconClassName="text-slate-700 animate-pulse"
              contentClassName="max-h-[500px]"
            >
              <article className="prose prose-sm leading-normal">
                <h3 className="text-lg font-semibold">What is Structurizer?</h3>
                <p>
                  Structurizer is a tool to help you extract structured data
                  from PDF files with the power of Large Language Models (LLMs).
                </p>
                <p>
                  Currently a Proof of Concept, this application&apos;s
                  processing capability is limited to a few document categories.
                  Its primary objective is to demonstrate the potential of LLMs
                  in the field of document processing.
                </p>
                <h3 className="text-lg font-semibold">Disclaimer</h3>
                <p>
                  It uses commercial LLMs, such as GPT models, for data
                  extraction. Due to some of its features, it{" "}
                  <u>cannot fully guarantee the privacy of your data</u>.
                </p>
                <p>
                  Please use it reasonably and do not upload sensitive
                  documents.
                </p>
              </article>
            </HelpPopover>
          </div>
        </div>
        <AuthForm type="register" />
        <p className="text-center text-sm text-slate-700">
          <Link href="/login" className="hover:underline underline-offset-4">
            Already have an account?
            <span className="font-semibold"> Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
