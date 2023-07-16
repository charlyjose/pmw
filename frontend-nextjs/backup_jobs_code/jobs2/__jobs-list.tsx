import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/registry/new-york/ui/button";
import { Badge } from "@/components/ui/badge";

import axios from "axios";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

import { Job } from "./job";




export async function JobsList() {
  const session = await getServerSession(authOptions);

  console.log(session);

  if (!session) {
    redirect("/signin?callbackUrl=/protected/server");
  }

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
    console.log("start: ", start);
    console.log("end: ", end);
    console.log("days: ", days);

    const human_readable_deadline =
      days > 0 ? `${days} days to apply` : "Last day to apply";

    const badge_type = days > 2 ? "secondary" : "destructive";

    return [human_readable_deadline];
  };

  const API_URI = "http://localhost:8000";
  const jobs = await (await axios.get(`${API_URI}/api/jobs`)).data;


  const current_job = {
    role: "Junior Software Engineer in Frontend (Contract)",
    company: "Awesome Corp",
    // description: '# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nam libero justo laoreet sit amet cursus sit amet dictum. Nec tincidunt praesent semper feugiat. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. In dictum non consectetur a erat nam. Ipsum consequat nisl vel pretium. Ultrices dui sapien eget mi. Amet cursus sit amet dictum sit amet justo. Pellentesque habitant morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet. Hendrerit dolor magna eget est lorem ipsum dolor.',
    description: 'This is an awesome company. **Do apply!**',
    // description: `A paragraph with *emphasis* and **strong importance**.

    // > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
    
    // * Lists
    // * [ ] todo
    // * [x] done
    
    // A table:
    
    // | a | b |
    // | - | - |
    // `,
    salary: "£30,000",
    deadline: "31 July 2023",
    locations: ["London", "Manchester", "Leeds"],
    link: "https://google.com"
  }

  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-9">
        <div className="col-span-2">
          <ScrollArea className="rounded-md h-screen">
            <div className="space-y-2">
              {jobs && jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold">
                      {job.role}
                    </CardTitle>
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
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="col-span-7">
          <Job job={current_job}/>
        </div>
      </div>
    </>
  );
}
