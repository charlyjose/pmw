"use client";

import Link from "next/link";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/registry/new-york/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function JobListSidebarNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Validating client-side session
    if (!session) {
      router.push("/signin");
    }
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const API_URI = "http://localhost:8000";
      const res = await fetch(`${API_URI}/api/jobs`);
      const json = await res.json();
      setJobs(json);

      console.log("JOBS: ", jobs);
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <>
      {jobs.map((job) => (
        <Link key={job.link} href={job.link} className="p-1">
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
                    {/* {daysLeft(new Date(job.deadline))} */}
                    {dayjs(job.deadline).fromNow(true) + " left"}
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
    </>
  );
}
