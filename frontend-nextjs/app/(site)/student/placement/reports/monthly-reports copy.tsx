const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";
const API_URI = "http://localhost:8000";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/registry/new-york/ui/button";

import axios from "axios";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

import { FrownIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { DownloadIcon } from "lucide-react";

export async function MonthlyReports() {
  const session = await getServerSession(authOptions);

  if (!session && session?.data?.user?.role != PAGE_TYPE) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }

  var token = session?.token;
  const config = {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bearer ${token}`,
    },
  };
  const reports = await (
    await axios.get(`${API_URI}/api/student/placement/reports`, config)
  ).data.data.reports;

  console.log(reports);


  function downloadFile(e) {
    console.log("download file");
    console.log(e.target.key);
  }


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
          <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="text-sm font-medium">{report.title}</div>
                {/* SPLIT _ from report.month */}
                <div className="text-sm font-extrabold">{report.month.replace("_", " ")}</div>
                <div className="text-sm font-medium">{report.report_name}</div>
              </CardTitle>
              <FileTextIcon className="mr-2 w-8 h-8 text-lime-600" />
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-8 gap-2">
                <div className="col-span-6">
                  <div className="grid gap-1">
                    <div className="text-xl font-extrabold">
                      {new Date(report.createdAt).toDateString()}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="grid gap-1">
                    <div className="text-right text-xs font-medium hover:underline">
                      <Button variant="link" className="pl-0">
                        <DownloadIcon className="mr-1 h-4 w-4"/>
                        {/* http://localhost:8000/api/student/placement/reports/download?report_id=64b88d5660067e8412ba8e9b
                        {API_URI}/api/student/placement/reports/download?report_id={report.id} */}
                        <Link href={`${API_URI}/api/student/placement/reports/download?report_id=${report.id}`} key={report.id} onClick={downloadFile} >Download</Link>
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
}
