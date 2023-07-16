"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/new-york/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/registry/new-york/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";


interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  jobs: {
    role: string;
    link: string;
    company: string;
    salary: string;
    deadline: string;
  }[];
}

export function JobListSidebarNav({
  className,
  jobs,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  console.log("JOBS SIDEBAR: ", jobs);


  const daysLeft = (EndDate: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;

    const end = Date.UTC(
      EndDate.getFullYear(),
      EndDate.getMonth(),
      EndDate.getDate()
    );

    const StartDate = new Date();
    const start = Date.UTC(
      StartDate.getFullYear(),
      StartDate.getMonth(),
      StartDate.getDate()
    );

    const days = (end - start) / oneDay;

    const human_readable_deadline =
      days > 0 ? `${days} days to apply` : "Last day to apply";

    return [human_readable_deadline];
  };



  return (
    <nav
      className={cn(
        // "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {jobs.map((job) => (
        <Link
          key={job.link}
          href={job.link}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === job.link
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            // "justify-start"
          )}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-bold">{job.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1">
                <div className="text-left text-sm font-medium">
                  {job.company}
                </div>
                <div className="text-left">
                  {job.salary ? (
                    <Badge variant="outline">
                      <div className="text-left text-xs font-light">
                        {job.salary}
                      </div>
                    </Badge>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between space-x-2">
              {job.deadline ? (
                <Badge variant="destructive">
                  <div className="text-center text-xs font-light">
                    {daysLeft(new Date(job.deadline))}
                  </div>
                </Badge>
              ) : (
                <div></div>
              )}
              <div className="grid gap-2">
                <Button variant="link">
                  <ArrowUpRight className="mr-0 h-4 w-4" />
                  <div className="text-right text-xs font-normal hover:underline">
                    <Link href={job.link}>Apply</Link>
                  </div>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </nav>

    // <nav
    //   className={cn(
    //     "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
    //     className
    //   )}
    //   {...props}
    // >
    //   {items.map((item) => (
    //     <Link
    //       key={item.link}
    //       href={item.link}
    //       className={cn(
    //         buttonVariants({ variant: "ghost" }),
    //         pathname === item.link
    //           ? "bg-muted hover:bg-muted"
    //           : "hover:bg-transparent hover:underline",
    //         "justify-start"
    //       )}
    //     >
    //       {item.role}
    //     </Link>
    //   ))}
    // </nav>
  );
}
