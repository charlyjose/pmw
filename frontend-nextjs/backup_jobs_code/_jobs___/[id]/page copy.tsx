"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/registry/new-york/ui/button";

import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Job({ job }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Validating client-side session
    if (!session) {
      router.push("/signin");
    }

    console.log("CURRENT JOB CALL WITH: ", job);
  }, []);


return(
  <>HI</>
)

  // return job ? (
  //   <Card>
  //     <CardHeader className="bg-slate-50">
  //       <CardTitle>{job.id}</CardTitle>
  //       <CardTitle>{job.role}</CardTitle>
  //       <CardDescription>{job.company}</CardDescription>
  //     </CardHeader>
  //     <CardContent className="p-0">
  //       <ScrollArea className="rounded-md h-screen max-h-screen">
  //         <div className="p-5">
  //           {job.description ? (
  //             <>
  //               {/* {job.description} */}
  //               <ReactMarkdown
  //                 children={job.description}
  //                 remarkPlugins={[remarkGfm]}
  //               />
  //             </>
  //           ) : (
  //             <></>
  //           )}
  //         </div>
  //       </ScrollArea>
  //     </CardContent>
  //     <CardFooter className="grid gap-6 bg-slate-50 pt-6">
  //       <div className="text-left text-lg font-bold">
  //         <span className="px-1 bg-lime-300 mr-2"></span>
  //         More Details
  //         <Separator className="my-1" />
  //       </div>
  //       <div className="grid grid-cols-4 gap-4">
  //         {job.salary ? (
  //           <div className="grid gap-1">
  //             <div className="text-xs font-light">
  //               <span className="px-1 bg-lime-300 mr-2"></span>
  //               SALARY
  //             </div>
  //             <div className="text-sm font-normal">{job.salary}</div>
  //           </div>
  //         ) : (
  //           <div></div>
  //         )}

  //         {job.deadline ? (
  //           <div className="grid gap-1">
  //             <div className="text-xs font-light">
  //               <span className="px-1 bg-lime-300 mr-2"></span>
  //               DEADLINE
  //             </div>
  //             <div className="text-sm font-normal">{job.deadline}</div>
  //           </div>
  //         ) : (
  //           <div></div>
  //         )}

  //         {job.locations ? (
  //           <div className="grid gap-1">
  //             <div className="text-xs font-light">
  //               <span className="px-1 bg-lime-300 mr-2"></span>
  //               LOCATIONS
  //             </div>
  //             <div className="text-sm font-normal">
  //               {job.locations.map((location, id) => (
  //                 <span>
  //                   {location}
  //                   {id !== job.locations.length - 1 ? ", " : ""}
  //                 </span>
  //               ))}
  //             </div>
  //           </div>
  //         ) : (
  //           <div></div>
  //         )}

  //         <div className="grid gap-1">
  //           <div className="text-right text-xs font-medium hover:underline">
  //             <Button className="bg-lime-400 text-black hover:bg-black hover:text-white">
  //               <ExternalLink className="mr-2 h-4 w-4" />
  //               <Link href={job.link} className="">
  //                 Apply
  //               </Link>
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </CardFooter>
  //   </Card>
  // ) : (
  //   <></>
  // );



}
