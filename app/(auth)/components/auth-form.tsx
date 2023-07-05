"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn, minDelay } from "@/lib/utils";
import { authSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register";
}

type FormData = z.infer<typeof authSchema>;

export function AuthForm({ className, ...props }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
  });

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    if (props.type === "register") {
      const res = await minDelay(
        fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(data),
        }),
        500
      );

      if (res.status !== 201) {
        setIsLoading(false);
        return toast({
          title: "Failed to sign up",
          description: "Your sign up request failed.",
          variant: "destructive",
        });
      }
    }

    const res = await minDelay(
      signIn("credentials", {
        name: data.name.toLowerCase(),
        password: data.password,
        redirect: false,
      }),
      500
    );

    if (!res || res.error) {
      setIsLoading(false);
      return toast({
        title: "Failed to sign in.",
        description:
          res?.error ?? "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              placeholder="Your username"
              type="text"
              autoCapitalize="none"
              autoComplete="text"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Your password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button className="mt-2" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.type === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
