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
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register";
}

type FormData = z.infer<typeof authSchema>;

export function AuthForm({ className, type }: AuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    if (type === "register") {
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
        name: data.name,
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
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid">
            <div className="mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your username"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="text"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        type="password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isLoading} type="submit" className="mt-8">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {type === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
