"use client";

const PAGE_TYPE = "STUDENT";
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
      <Jobs />
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
    await axios.get(`${API_URI}/api/jobs?page=${page + 1}`, config)
  ).data;

  return data;
}

function Jobs() {
  const { data: session, status: sessionStatus } = useSession();
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

    // Auth check
    if (sessionStatus === "loading") return; // Do nothing while loading
    if (!session) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    } else if (session?.user?.role != PAGE_TYPE) {
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
            <Icons.spinner className="mr-2 w-20 h-20 text-lime-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">Fetching jobs</h3>
          </div>
        </div>
      ) : status === "error" ? (
        <>
          {/* <div>Error: {error.message}</div> */}
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <FrownIcon className="mr-2 w-20 h-20 text-lime-600" />
              <h3 className="mt-4 text-lg font-semibold">
                Error fetching jobs. Please try again later.
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
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Company</TableHead>
                <TableHead className="font-medium">Salary</TableHead>
                <TableHead className="font-medium">Mode</TableHead>
                <TableHead className="font-medium">Location</TableHead>
                <TableHead className="font-medium">Deadline</TableHead>
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
