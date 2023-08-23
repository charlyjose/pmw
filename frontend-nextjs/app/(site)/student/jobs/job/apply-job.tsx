"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Separator } from "@/registry/new-york/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Icons } from "@/components/icons";
import { toast } from "@/registry/new-york/ui/use-toast";

import { FrownIcon } from "lucide-react";

import { JobApplicationDialog } from "./application-dialog";

export function ApplyJob() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [axiosConfig, setAxiosConfig] = useState(null);

  useEffect(() => {
    // Auth check
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    } else if (session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    var jobId = searchParams?.get("id");
    var token = session?.token;
    const axiosConfig = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };

    setAxiosConfig(axiosConfig);

    // Fetch the job details
    const fetchJob = async () => {
      setIsLoading(true);
      var toast_variant = "default";
      var toast_title = "Job";
      var toast_description = "";

      const API_URI = "http://localhost:8000";
      await axios
        .get(`${API_URI}/api/jobs/${jobId}`, axiosConfig)
        .then((e) => {
          let job = e.data.data.job;
          if (job) {
            setJob(job);

            toast_variant = "default";
            toast_description = "Successfully fetched job details";
          } else {
            toast_variant = "destructive";
            toast_description = "No job found";
          }
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        })
        .catch((e) => {
          toast_variant = "destructive";
          toast_description = "Error fetching job details";
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        });

      setTimeout(() => {
        setIsLoading(false);
        // router.push("/student/jobs")
      }, 1000);
    };

    fetchJob();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Icons.spinner className="mr-2 w-20 h-20 text-lime-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">Fetching job details</h3>
          </div>
        </div>
      )}
      {!isLoading && <JobDisplay job={job} axiosConfig={axiosConfig} />}
    </>
  );
}

export function JobDisplay(props) {
  const displayJob = (props) => {
    const { job, axiosConfig } = props;

    if (job) {
      return (
        <>
          <div className="pt-1 text-xl font-bold">{job.role}</div>
          <div className="pt-2 text-xl font-light">{job.company}</div>

          <div className="text-left pt-10">
            <ScrollArea className="rounded-md h-[530px]">
              <ReactMarkdown
                children={job.description}
                remarkPlugins={[remarkGfm]}
              />
            </ScrollArea>
          </div>

          <div className="pt-10">
            <div className="text-left text-lg font-bold">
              <span className="px-1 bg-lime-300 mr-2 "></span>
              More Details
              <Separator className="my-1" />
            </div>
            <div className="grid grid-cols-5 gap-4 pt-5">
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
                  <div className="text-sm font-normal">
                    {new Date(job.deadline).toDateString()}
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {job.location ? (
                <div className="grid gap-1">
                  <div className="text-xs font-light">
                    <span className="px-1 bg-lime-300 mr-2"></span>
                    LOCATIONS
                  </div>
                  <div className="text-sm font-normal">
                    <span>{job.location.join(", ")}</span>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {job.mode ? (
                <div className="grid gap-1">
                  <div className="text-xs font-light">
                    <span className="px-1 bg-lime-300 mr-2"></span>
                    WORKING MODE
                  </div>
                  <div className="text-sm font-normal">
                    <span>
                      {job.mode.charAt(0).toUpperCase() +
                        job.mode.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {job.link ? (
                <JobApplicationDialog job={job} axiosConfig={axiosConfig} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <FrownIcon className="mr-2 w-20 h-20 text-lime-600" />
            <h3 className="mt-4 text-lg font-semibold">
              Job details not found
            </h3>
          </div>
        </div>
      );
    }
  };
  return <>{displayJob(props)}</>;
}
