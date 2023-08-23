"use client";

import * as React from "react";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";

import { Icons } from "@/components/icons";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { PasswordInput } from "@/components/password-input";

import { toast } from "react-hot-toast";
import { CheckCircle2Icon } from "lucide-react";

import { signinFormSchema } from "../utilities/validation";

type SigninFormValues = z.infer<typeof signinFormSchema>;
const defaultValues: Partial<SigninFormValues> = {};

export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const session = useSession();
  const router = useRouter();

  const getPageRedirection = (role: string) => {
    if (role === undefined) {
      return "";
    } else {
      return role.toLowerCase();
    }
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      // Page direction based on role
      var pageRedirection = getPageRedirection(session?.data?.user?.role);
      router.push(`/${pageRedirection}`);
    }
  });

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: SigninFormValues) {
    setIsLoading(true);

    signIn("credentials", { ...data, redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error);
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully!");
      }
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading && (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Hang on! We are signing you in...
            </>
          )}
          {!isLoading && (
            <>
              <CheckCircle2Icon className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
