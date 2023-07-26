"use client";

const PAGE_TYPE = "TUTOR";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DialogDemo } from "./dialog";

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

  const API_URI = "http://localhost:8000";
  const { data } = await (
    await axios.get(`${API_URI}/api/jobs?page=${page + 1}`, config)
  ).data;

  return data;
}

function PlacementApplications() {
  const { data: session } = useSession();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);
  const [token, setToken] = React.useState(session?.token);

  const { status, data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["jobs", page, token],
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
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Student</TableHead>
                <TableHead className="font-medium">Level</TableHead>
                <TableHead className="font-medium">Locality</TableHead>
                <TableHead className="font-medium">Submission Date</TableHead>
                <TableHead className="font-medium">Start Date</TableHead>
                <TableHead className="font-medium">End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.role}</TableCell>
                  <TableCell className="font-light">{job.company}</TableCell>
                  <TableCell className="font-light">{job.salary}</TableCell>
                  <TableCell className="font-medium">
                    {" "}
                    {job.mode.charAt(0).toUpperCase() +
                      job.mode.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell className="font-light">
                    {job.location.join(", ")}
                  </TableCell>

                  <TableCell className="font-medium">
                    {new Date(job.deadline).toDateString()}
                  </TableCell>
                  <TableCell className="font-light">
                    <DialogDemo job={job} />
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
