import Link from "next/link";
import Balance from "react-wrap-balancer";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Shell } from "@/components/shell";

export default async function IndexPage() {
  return (
    <Shell className="gap-12">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-32"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Placement Management Web Application.
        </h1>
        <Balance className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
          A online platform for everything placement
        </Balance>
        <div className="space-x-4">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({
                size: "lg",
              })
            )}
          >
            Sign up
          </Link>
          <Link
            href="/signin"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              })
            )}
          >
            Sign in
          </Link>
        </div>
      </section>
    </Shell>
  );
}
