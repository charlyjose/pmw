const PAGE_TYPE = "CSD";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";


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

export async function MonthlyReports() {
  const session = await getServerSession(authOptions);

  if (!session && session?.data?.user?.role != PAGE_TYPE) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }

  const API_URI = "http://localhost:8000";
  const reports = await (
    await axios.get(`${API_URI}/api/csd/placement/reports`)
  ).data;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {report.title}
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(report.submission_date).toDateString()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="ml-auto mr-4">
                <Button variant="link">
                  <Link href={report.file_link}>Download</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
