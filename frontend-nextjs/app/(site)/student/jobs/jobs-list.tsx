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
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
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

async function fetchProjects(page = 0) {
  const API_URI = "http://localhost:8000";
  const { data } = await axios.get(`${API_URI}/api/jobs/page/${page}`);
  console.log("DATA: ", data);
  return data;
}

function Jobs() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);

  const { status, data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["projects", page],
    queryFn: () => fetchProjects(page),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // Prefetch the next page!
  React.useEffect(() => {
    if (!isPreviousData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["projects", page + 1],
        queryFn: () => fetchProjects(page + 1),
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
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Company</TableHead>
                <TableHead className="font-medium">Salary</TableHead>
                <TableHead className="font-medium">Mode</TableHead>
                <TableHead className="font-medium">Location</TableHead>
                <TableHead className="font-medium">Deadline</TableHead>
                {/* <TableHead className="font-medium">View</TableHead> */}

                {/* <TableHead className="text-right">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.role}</TableCell>
                  <TableCell className="font-light">
                    {project.company}
                  </TableCell>
                  <TableCell className="font-light">{project.salary}</TableCell>
                  <TableCell className="font-medium">{project.mode}</TableCell>
                  <TableCell className="font-light">
                    {/* {project.location} */}
                    {/* {project.location.length > 0 && ( */}
                    {project.location.join(", ")}
                    {/* )} */}
                  </TableCell>
                  <TableCell className="font-medium">
                    {project.deadline}
                  </TableCell>
                  <TableCell className="font-light">
                    <DialogDemo job={project} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-1"></div>
        <div className="grid gap-1">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Current Page: {page + 1}
          </div>
        </div>
        <div className="grid gap-1">
          <Button
            variant="outline"
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
          >
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
          </Button>
        </div>
      </div>
 */}

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
          Page: {page + 1}
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
