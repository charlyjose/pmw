"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";
const API_URI = "http://localhost:8000";

import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import axios from "axios";
import { saveAs } from "file-saver";
import moment from "moment";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FrownIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { DownloadIcon } from "lucide-react";
import { ArrowDownToLineIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { ArrowUpRight } from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { set } from "date-fns";

export function MonthlyReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [applications, setApplication] = React.useState([]);
  const [axiosConfig, setAxiosConfig] = React.useState({});

  if (!session && session?.data?.user?.role != PAGE_TYPE) {
    router.push(UNAUTHORISED_REDIRECTION_LINK);
  }

  useEffect(() => {
    // Auth check
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    } else if (session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }
    const fetchData = async () => {
      setIsLoading(true);
      var toast_variant = "default";
      var toast_title = "Placement reports";
      var toast_description = "";

      var token = session?.token;
      const config = {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      };

      setAxiosConfig(config);

      await axios
        .get(`${API_URI}/api/student/jobs/applications`, config)
        .then((e) => {
          if (e.data.data?.applications?.length > 0) {
            setApplication(e.data.data.applications);
            toast_variant = "default";
            toast_title = "Job Applications";
            toast_description = "Successfully fetched all your reports";
          } else {
            toast_variant = "destructive";
            toast_title = "Placement reports";
            toast_description = "No reports found";
          }
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        })
        .catch((e) => {
          toast_variant = "destructive";
          toast_title = "Job Applications";
          toast_description = `${e.response.data.message}`;
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        });

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    setIsLoading(false);

    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Icons.spinner className="mr-2 w-20 h-20 text-lime-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">
              Fetching your applications
            </h3>
          </div>
        </div>
      )}
      {!isLoading && (
        <ApplicationsDisplay
          applications={applications}
          axiosConfig={axiosConfig}
        />
      )}
    </>
  );
}

export function ApplicationsDisplay(props) {
  const displayApplications = (props) => {
    const { applications, axiosConfig } = props;

    function downloadFile(report) {
      var config = axiosConfig;
      delete config.headers["Content-Type"];
      config.responseType = "blob";
      config.headers["accept"] = "application/json";

      var application_id = report.id;
      var fileType = report.fileType;
      var report_name = report.cvName;

      axios
        .get(
          `${API_URI}/api/student/jobs/applications/download?application_id=${application_id}`,
          config
        )
        .then((e) => {
          saveAs(e.data, `${report_name}`);
          toast({
            variant: "default",
            title: "Placement reports",
            description: "Successfully downloaded your report",
          });
        })
        .catch((e) => {
          console.log(e);
          toast({
            variant: "destructive",
            title: "Placement reports",
            description: "Error downloading your report",
          });
        });
    }

    if (applications.length > 0) {
      return (
        <>
          {applications.length == 0 && (
            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <FrownIcon className="mr-2 w-20 h-20 text-lime-600" />
                <h3 className="mt-4 text-lg font-semibold">
                  You have not submitted any reports yet.
                </h3>
              </div>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {applications.map((application) => (
              <Card
                className="transition-all hover:bg-accent hover:text-accent-foreground"
                key={application.id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-sm font-bold">{application.role}</div>
                    <div className="text-sm font-normal pt-2">
                      {application.company}
                    </div>
                  </CardTitle>
                  {application.fileType === "PDF" ? (
                    <BsFileEarmarkPdf className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}
                  {application.fileType === "DOCX" ? (
                    <BsFiletypeDocx className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}{" "}
                  {application.fileType === "DOC" ? (
                    <BsFiletypeDoc className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                      <div className="text-xs font-bold">
                        <Button variant="link" className="p-0 text-xs">
                          <ArrowUpRight className="mr-0 h-4 w-4" />
                          <div className="text-left text-xs font-normal hover:underline">
                            <Link href={`../jobs/job?id=${application.jobId}`}>
                              View
                            </Link>
                          </div>
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="text-right text-xs font-medium hover:underline">
                        <Button
                          variant="link"
                          // className="pl-0 pr-1 text-xs"
                          className="pl-0 pr-1 text-xs"
                          onClick={(e) => downloadFile(application)}
                        >
                          <ArrowDownToLineIcon className="mr-1 h-4 w-4" />
                          Download CV
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={application.id}>
                      <AccordionTrigger className="text-right text-sm font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                        <span className="font-bold text-xs">
                          + Application Details
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">Name: </span>
                            {application.name}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">Email: </span>
                            {application.email}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">File Name: </span>
                            {application.cvName}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">File Type: </span>
                            {application.fileType}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <div className="grid grid-cols-12 gap-1">
                              <div className="col-span-8">
                                <span className="font-bold">Applied On: </span>
                                {new Date(application.createdAt).toDateString()}
                              </div>

                              <div className="col-span-4 text-right">
                                <Badge variant="default" className="text-right">
                                  {moment(
                                    application.createdAt,
                                    "YYYYMMDD"
                                  ).fromNow()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      );
    } else {
      return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <FrownIcon className="mr-2 w-20 h-20 text-lime-600" />
            <h3 className="mt-4 text-lg font-semibold">
              You have not submitted any reports yet.
            </h3>
          </div>
        </div>
      );
    }
  };
  return <>{displayApplications(props)}</>;
}
