import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "../components/auth-form";

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
