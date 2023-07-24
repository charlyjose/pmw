"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";
const API_URI = "http://localhost:8000";

import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";

import { Button } from "@/registry/new-york/ui/button";

import axios from "axios";

import Link from "next/link";

import { FrownIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { DownloadIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";

import { toast } from "@/registry/new-york/ui/use-toast";
import { set } from "date-fns";

export function MonthlyReports() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [reports, setReports] = React.useState([]);
  const [axiosConfig, setAxiosConfig] = React.useState({});

  if (!session && session?.data?.user?.role != PAGE_TYPE) {
    router.push(UNAUTHORISED_REDIRECTION_LINK);
  }

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
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
        .get(`${API_URI}/api/student/placement/reports`, config)
        .then((e) => {
          if (e.data.data?.reports?.length > 0) {
            setReports(e.data.data.reports);
            toast_variant = "default";
            toast_title = "Placement reports";
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
          toast_title = "Placement reports";
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
              Fetching your reports
            </h3>
          </div>
        </div>
      )}
      {!isLoading && (
        <ReportsDisplay reports={reports} axiosConfig={axiosConfig} />
      )}
    </>
  );
}

export function ReportsDisplay(props) {
  const displayReports = (props) => {
    const { reports, axiosConfig } = props;

    function downloadFile(report) {
      var config = axiosConfig;
      delete config.headers["Content-Type"];
      config.responseType = "blob";
      config.headers["accept"] = "application/json";

      var report_id = report.id;
      var file_type = report.file_type;
      var report_name = report.report_name;

      axios
        .get(
          `${API_URI}/api/student/placement/reports/download?report_id=${report_id}`,
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

    if (reports.length > 0) {
      return (
        <>
          {reports.length == 0 && (
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
            {reports.map((report) => (
              <Card className="transition-all hover:bg-accent hover:text-accent-foreground" key={report.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-sm font-normal">{report.title}</div>
                    <div className="text-sm font-bold pt-2">
                      <Badge variant="default">
                        {report.month.replace("_", " ")}
                      </Badge>
                    </div>
                    {/* <div className="text-sm font-medium">
                      {report.report_name}
                    </div> */}
                  </CardTitle>
                  {report.file_type === "PDF" ? (
                    <BsFileEarmarkPdf className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}
                  {report.file_type === "DOCX" ? (
                    <BsFiletypeDocx className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}{" "}
                  {report.file_type === "DOC" ? (
                    <BsFiletypeDoc className="mr-1 w-8 h-8 text-lime-600" />
                  ) : (
                    <></>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-8 gap-2">
                    <div className="col-span-6">
                      <div className="grid gap-1">
                        <div className="text-xl font-bold">
                          {new Date(report.createdAt).toDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="grid gap-1">
                        <div className="text-right text-xs font-medium hover:underline">
                          <Button
                            variant="link"
                            className="pl-0"
                            onClick={(e) => downloadFile(report)}
                          >
                            <DownloadIcon className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
  return <>{displayReports(props)}</>;
}
