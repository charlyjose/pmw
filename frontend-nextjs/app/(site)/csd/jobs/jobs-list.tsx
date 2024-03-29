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

import { JobFilter } from "./jobs-filter";

const queryClient = new QueryClient();

export async function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Jobs />
    </QueryClientProvider>
  );
}

async function fetchJobs(page = 1, token, filterQuery) {
  const config = {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bearer ${token}`,
    },
  };

  const API_URI = process.env.NEXT_PUBLIC_API_URL as string;

  let url = `${API_URI}/api/jobs?page=${page + 1}`;
  if (filterQuery != "") {
    url = url + filterQuery;
  }

  console.log("filterQuery: ", filterQuery);

  const { data } = await (await axios.get(url, config)).data;
  return data;
}

function Jobs() {
  const { data: session } = useSession();
  const router = useRouter();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [filter, setFilter] = React.useState(false);

  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);
  const [token, setToken] = React.useState(session?.token);

  const { status, data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["jobs", page, token],
    queryFn: () => fetchJobs(page, token, filterQuery),
    keepPreviousData: true,
    staleTime: 5000,
    // Refetch the data interval in milliseconds
    // refetchInterval: 1500,
    // Refetch the data every time the window regains focus
    refetchOnWindowFocus: true,

    // Add cacheTime to keep the data in the cache for longer
    // cacheTime: 5000,

    // Enable automatic refetching on stale queries by default
    // refetchOnMount: "always",
    // refetchOnReconnect: "always",
    // refetchOnWindowFocus: "always",

    // The query will not execute until the query mount window has been in focus for at least this long.
    // refetchIntervalInBackground: 1000
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
        queryFn: () => fetchJobs(page + 1, token, filterQuery),
      });
    }

    // On filter change -> reset page to 0 and refetch data
    // if (filter == true) {
    //   setPage(0);
    //   queryClient.prefetchQuery({
    //     queryKey: ["jobs", page],
    //     queryFn: () => fetchJobs(page, token, filterQuery),
    //   });
    //   setFilter(false);
    // }

    // On filter is removed -> reset page to 0 and refetch data
    // if (filterQuery == "" || filterQuery == undefined || filter == false) {
    //   setPage(0);
    //   queryClient.prefetchQuery({
    //     queryKey: ["jobs", page],
    //     queryFn: () => fetchJobs(page, token, filterQuery),
    //   });
    // }
  }, [data, isPreviousData, page, queryClient, filterQuery, filter]);

  return (
    <div className="space-y-4">
      {status === "loading" ? (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Icons.spinner className="mr-2 w-20 h-20 text-purple-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">Fetching jobs</h3>
          </div>
        </div>
      ) : status === "error" ? (
        <>
          {/* <div>Error: {error.message}</div> */}
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <FrownIcon className="mr-2 w-20 h-20 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold">
                Error fetching jobs. Please try again later.
              </h3>
            </div>
          </div>
        </>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data

        <>
          <JobFilter filterQuery={setFilterQuery} filter={setFilter} />
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
        </>
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
