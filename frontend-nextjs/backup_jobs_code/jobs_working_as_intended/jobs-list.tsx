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

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/registry/new-york/ui/button";
import { Badge } from "@/components/ui/badge";

import axios from "axios";

import Link from "next/link";

import { Job } from "./job";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function JobsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    // Validating client-side session
    if (!session) {
      router.push("/signin");
    }
    fetchJobs();
    currentJob ? setCurrentJob(currentJob) : setCurrentJob(jobs[0]);
  }, []);

  async function fetchJobs() {
    try {
      const API_URI = "http://localhost:8000";
      const res = await fetch(`${API_URI}/api/jobs`);
      const json = await res.json();
      setJobs(json);
      setCurrentJob(jobs[0]);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSelectJob = (e) => {
    e.preventDefault();
    console.log("Event: ", e);
    console.log("Event: ", e.target.key);
    console.log("Event: ", e.target.id);
  };

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

  const current_job = {
    id: "1",
    role: "Junior Software Engineer in Frontend (Contract)",
    company: "Awesome Corp",
    // description: '# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nam libero justo laoreet sit amet cursus sit amet dictum. Nec tincidunt praesent semper feugiat. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. In dictum non consectetur a erat nam. Ipsum consequat nisl vel pretium. Ultrices dui sapien eget mi. Amet cursus sit amet dictum sit amet justo. Pellentesque habitant morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet. Hendrerit dolor magna eget est lorem ipsum dolor.',
    description: "This is an awesome company. **Do apply!**",
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
    link: "https://google.com",
  };

  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-9">
        <div className="col-span-2">
          <ScrollArea className="rounded-md h-screen">
            <div className="space-y-2">
              {jobs.map((job) => (
                <a href="#" id={job.id} key={job.id} onClick={handleSelectJob}>
                  <Card>
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
                </a>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="col-span-7">
          <SelectedJob job={current_job} />
        </div>
      </div>
    </>
  );
}

const SelectedJob = ({ job }) => {
  return <Job job={job} />;
};
