"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";

import { toast } from "react-hot-toast";
import { CheckCircle2Icon } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const session = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

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

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
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
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@domain.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="*********"
              type="password"
              autoCapitalize="none"
              autoComplete="none"
              autoCorrect="off"
              disabled={isLoading}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Signing you in...
              </>
            )}
            {!isLoading && (
              <>
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
