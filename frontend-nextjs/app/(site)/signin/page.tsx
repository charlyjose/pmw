import { UserAuthForm } from "./components/user-auth-form";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";

export default function SignInPage() {
  return (
    <Shell layout="auth">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <UserAuthForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
