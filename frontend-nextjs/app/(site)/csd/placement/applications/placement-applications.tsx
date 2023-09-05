"use client";

const PAGE_TYPE = "CSD";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Icons } from "@/components/icons";
import { FrownIcon } from "lucide-react";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";

import { Badge } from "@/registry/new-york/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ApplicationDialog } from "./application-dialog";

const queryClient = new QueryClient();

export async function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlacementApplications />
    </QueryClientProvider>
  );
}

async function fetchJobs(page = 1, token) {
  const config = {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bearer ${token}`,
    },
  };

  const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
  const { data } = await (
    await axios.get(
      `${API_URI}/api/csd/placement/applications/approved?page=${page + 1}`,
      config
    )
  ).data;

  return data;
}

function PlacementApplications() {
  const { data: session } = useSession();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);
  const [token, setToken] = React.useState(session?.token);

  const axiosConfig = {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bearer ${token}`,
    },
  };

  const { status, data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["applications", page, token],
    queryFn: () => fetchJobs(page, token),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // Prefetch the next page!
  React.useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    setToken(session?.token);

    if (!isPreviousData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["jobs", page + 1],
        queryFn: () => fetchJobs(page + 1, token),
      });
    }
  }, [data, isPreviousData, page, queryClient]);

  return (
    <div className="space-y-4">
      {status === "loading" ? (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Icons.spinner className="mr-2 w-20 h-20 text-purple-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">
              Fetching applications
            </h3>
          </div>
        </div>
      ) : status === "error" ? (
        <>
          {/* <div>Error: {error.message}</div> */}
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <FrownIcon className="mr-2 w-20 h-20 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold">
                Error fetching applications. Please try again later.
              </h3>
            </div>
          </div>
        </>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Student</TableHead>
                <TableHead className="font-medium">Level</TableHead>
                <TableHead className="font-medium">Placement</TableHead>
                <TableHead className="font-medium">Student Visa</TableHead>
                <TableHead className="font-medium">Role Start</TableHead>
                <TableHead className="font-medium">Last Update</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.declarationName}
                  </TableCell>
                  <TableCell className="font-light">
                    {application.studentLevel
                      .toUpperCase()
                      .replace("_", " ")
                      .charAt(0) +
                      application.studentLevel.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {application.placementOverseas ? "Overseas" : "Local"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {application.studentVisa ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Date(application.roleStartDate).toDateString()}
                  </TableCell>
                  <TableCell className="font-light">
                    {new Date(application.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell className="font-light">
                    {application.status.toUpperCase() === "APPROVED" ? (
                      <Badge variant="outline">APPROVED</Badge>
                    ) : application.status.toUpperCase() === "REVIEW" ? (
                      <Badge variant="secondary">REVIEW</Badge>
                    ) : application.status.toUpperCase() === "REJECTED" ? (
                      <Badge variant="destructive">REJECTED</Badge>
                    ) : (
                      <Badge variant="default">PENDING</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-light">
                    <ApplicationDialog
                      application={application}
                      axiosConfig={axiosConfig}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {page + 1}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2"></div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium"></div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage((old) => Math.max(old - 1, 0))}
              disabled={page === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Page
            </Button>{" "}
            <Button
              variant="outline"
              onClick={() => {
                setPage((old) => (data?.hasMore ? old + 1 : old));
              }}
              disabled={isPreviousData || !data?.hasMore}
            >
              Next Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
