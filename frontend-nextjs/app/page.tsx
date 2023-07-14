import Link from "next/link";
import Balance from "react-wrap-balancer";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Shell } from "@/components/shell";

export default async function IndexPage() {
  // return (
  //   <div className="grid place-items-center h-screen">
  //     <h1 className="text-9xl font-extrabold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-justify d:text-5xl lg:text-6xl lg:leading-[1.1]">
  //       Placement Management Web Application.
  //     </h1>
  //     <Balance className="text-muted-foreground">
  //       A online platform for everything placement
  //     </Balance>
  //   </div>
  // );

  return (
    <Shell className="gap-12">
      {/* <div className="relative before:absolute before:w-full before:h-full before:-z-10 before:bg-gradient-to-r before:from-[#ffa4a4] before:to-[#fc9fff] before:left-0 before:top-0 before:blur-[100px]"> */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-32"
        >
          {/* <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Placement Management Web Application.
        </h1> */}

          <div className="relative before:absolute before:w-full before:h-full before:-z-10 before:bg-gradient-to-r before:from-[#ffa4a4] before:to-[#fc9fff] before:left-0 before:top-0 before:blur-[100px]">
          {/* <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> */}
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400">
          {/* <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl"> */}
            Placement Management Web Application.
          </h1>
          {/* </h1> */}
          <Balance className="max-w-[46rem] text-lg text-muted-background sm:text-xl">
            A online platform for everything career
          </Balance>
          </div>
          <div className="space-x-4">
            {/* <Link
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
          </Link> */}

            <a
              href="/signup"
              className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
            >
              <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
              <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
              </span>
              <span className="relative text-white font-bold">
                Signup today!
              </span>
            </a>
            {/* 
          <a
            href="/signup"
            className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
          >
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
              <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
            </span>
            <span className="relative text-black font-bold">
              Signup today!
              <div className="blur-md bg-red-400 text-white">Signup today!</div>
            </span>
          </a>
           */}
            {/* 
          <div className="w-56 h-56 relative before:absolute before:w-full before:h-full before:-z-10 before:bg-gradient-to-r before:from-[#f80000] before:to-[#fc9fff] before:left-0 before:top-0 before:blur-[50px]">
          </div> */}

            {/* <div className="relative before:absolute before:w-full before:h-full before:-z-10 before:bg-gradient-to-r before:from-[#f80000] before:to-[#fc9fff] before:left-0 before:top-0 before:blur-[50px]">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Placement Management Web Application.
            </h1>
          </div> */}

            {/* <div className="relative before:absolute before:w-full before:h-full before:-z-10 before:bg-gradient-to-r before:from-[#ffa4a4] before:to-[#fc9fff] before:left-0 before:top-0 before:blur-[50px]">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Placement Management Web Application.
            </h1>
          </div> */}
            {/* 
          <a
            href="/signin"
            className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-md shadow-2xl group"
          >
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
              <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
            </span>
            <span className="relative text-white font-bold">Sign In</span>
          </a> */}

            {/* <a
            href="#_"
            class="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
          >
            <span class="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
            <span class="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span class="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
              <span class="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
            </span>
            <span class="relative text-white">Button Text for now</span>
          </a> */}
          </div>
        </section>
      {/* </div> */}
    </Shell>
  );
}
