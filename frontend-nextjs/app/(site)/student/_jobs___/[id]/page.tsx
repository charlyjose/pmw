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

interface JobProps {
  params: {
    id: string;
  };
}

interface JobProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

import axios from "axios";
import { toast } from "@/registry/new-york/ui/use-toast";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function JobDescriptionLayout({
  children,
  params,
}: JobProps) {
  const session = await getServerSession(authOptions);
  const PAGE_TYPE = "STUDENT";
  const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";
  console.log("SESSION: ", session);
  console.log("SESSION_ROLE: ", session?.user?.role);

  // SESSION CHECK
  // User not Logged In
  if (!session) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }
  // Unauthorised routes
  if (session?.user?.role != PAGE_TYPE) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }

  const API_URI = "http://localhost:8000";
  const res = await fetch(`${API_URI}/api/jobs`);
  const json = await res.json();
  const job = json;

  return job ? (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle>{job.id}</CardTitle>
        <CardTitle>{job.role}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="rounded-md h-screen max-h-screen">
          <div className="p-5">
            {job.description ? (
              <>
                {/* {job.description} */}
                <ReactMarkdown
                  children={job.description}
                  remarkPlugins={[remarkGfm]}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="grid gap-6 bg-slate-50 pt-6">
        <div className="text-left text-lg font-bold">
          <span className="px-1 bg-lime-300 mr-2"></span>
          More Details
          <Separator className="my-1" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {job.salary ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                SALARY
              </div>
              <div className="text-sm font-normal">{job.salary}</div>
            </div>
          ) : (
            <div></div>
          )}

          {job.deadline ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                DEADLINE
              </div>
              <div className="text-sm font-normal">{job.deadline}</div>
            </div>
          ) : (
            <div></div>
          )}

          {job.locations ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                LOCATIONS
              </div>
              <div className="text-sm font-normal">
                {job.locations.map((location, id) => (
                  <span>
                    {location}
                    {id !== job.locations.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="grid gap-1">
            <div className="text-right text-xs font-medium hover:underline">
              <Button className="bg-lime-400 text-black hover:bg-black hover:text-white">
                <ExternalLink className="mr-2 h-4 w-4" />
                <Link href="" className="">
                  Apply
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  ) : (
    <></>
  );
}

// return (<>{job}</>)

//   console.log("CURRENT JOB CALL WITH: ", params);
//   console.log("JOB: ", job);

//   return job ? (
//     <Card>
//       <CardHeader className="bg-slate-50">
//         <CardTitle>{job.id}</CardTitle>
//         <CardTitle>{job.role}</CardTitle>
//         <CardDescription>{job.company}</CardDescription>
//       </CardHeader>
//       <CardContent className="p-0">
//         <ScrollArea className="rounded-md h-screen max-h-screen">
//           <div className="p-5">
//             {job.description ? (
//               <>
//                 {/* {job.description} */}
//                 <ReactMarkdown
//                   children={job.description}
//                   remarkPlugins={[remarkGfm]}
//                 />
//               </>
//             ) : (
//               <></>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//       <CardFooter className="grid gap-6 bg-slate-50 pt-6">
//         <div className="text-left text-lg font-bold">
//           <span className="px-1 bg-lime-300 mr-2"></span>
//           More Details
//           <Separator className="my-1" />
//         </div>
//         <div className="grid grid-cols-4 gap-4">
//           {job.salary ? (
//             <div className="grid gap-1">
//               <div className="text-xs font-light">
//                 <span className="px-1 bg-lime-300 mr-2"></span>
//                 SALARY
//               </div>
//               <div className="text-sm font-normal">{job.salary}</div>
//             </div>
//           ) : (
//             <div></div>
//           )}

//           {job.deadline ? (
//             <div className="grid gap-1">
//               <div className="text-xs font-light">
//                 <span className="px-1 bg-lime-300 mr-2"></span>
//                 DEADLINE
//               </div>
//               <div className="text-sm font-normal">{job.deadline}</div>
//             </div>
//           ) : (
//             <div></div>
//           )}

//           {job.locations ? (
//             <div className="grid gap-1">
//               <div className="text-xs font-light">
//                 <span className="px-1 bg-lime-300 mr-2"></span>
//                 LOCATIONS
//               </div>
//               <div className="text-sm font-normal">
//                 {job.locations.map((location, id) => (
//                   <span>
//                     {location}
//                     {id !== job.locations.length - 1 ? ", " : ""}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div></div>
//           )}

//           <div className="grid gap-1">
//             <div className="text-right text-xs font-medium hover:underline">
//               <Button className="bg-lime-400 text-black hover:bg-black hover:text-white">
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 <Link href="" className="">
//                   Apply
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   ) : (
//     <></>
//   );
// }

// interface JobProps {
//   params: {
//     id: string;
//   };
// }

// import { FC } from "react";

// const page: FC<JobProps> = ({ params }) => {
//   console.log("CURRENT JOB CALL WITH: ", params)
//   return (<>{params.id}</>)
// }

// export default page;

// export function JobListSidebarNav({
//   className,
//   job,
//   ...props
// }: JobProps) {
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     // Validating client-side session
//     if (!session) {
//       router.push("/signin");
//     }

//     console.log("CURRENT JOB CALL WITH: ", job);
//   }, []);

// return(
//   <>{job.r}</>
// )
// }

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
// }
