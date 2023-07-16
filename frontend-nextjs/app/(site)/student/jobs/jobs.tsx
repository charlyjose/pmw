"use client";

import React from "react";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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
    <>
      <Table className="rounded-md border">
        <TableCaption>A list of your recent projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Projects</TableHead>
            {/* <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.projects.map((project) => (
            <TableRow>
              <TableCell className="font-medium" key={project.id}>
                {project.name}
              </TableCell>
              {/* <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>Current Page: {page + 1}</div>
      <Button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </Button>{" "}
      <Button
        onClick={() => {
          setPage((old) => (data?.hasMore ? old + 1 : old));
        }}
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </Button>
      {
        // Since the last page's data potentially sticks around between page requests,
        // we can use `isFetching` to show a background loading
        // indicator since our `status === 'loading'` state won't be triggered
        isFetching ? <span> Loading...</span> : null
      }{" "}
    </>
  );

  /*
  return (
      <div>
        <p>
          In this example, each page of data remains visible as the next page is
          fetched. The buttons and capability to proceed to the next page are
          also supressed until the next page cursor is known. Each page is
          cached as a normal query too, so when going to previous pages, you'll
          see them instantaneously while they are also refetched invisibly in
          the background.
        </p>
        {status === "loading" ? (
          <div>Loading...</div>
        ) : status === "error" ? (
          <div>Error: {error.message}</div>
        ) : (
          // `data` will either resolve to the latest page's data
          // or if fetching a new page, the last successful page's data
          <div>
            {data.projects.map((project) => (
              <p key={project.id}>{project.name}</p>
            ))}
          </div>
        )}
        <div>Current Page: {page + 1}</div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 0}
        >
          Previous Page
        </button>{" "}
        <button
          onClick={() => {
            setPage((old) => (data?.hasMore ? old + 1 : old));
          }}
          disabled={isPreviousData || !data?.hasMore}
        >
          Next Page
        </button>
        {
          // Since the last page's data potentially sticks around between page requests,
          // we can use `isFetching` to show a background loading
          // indicator since our `status === 'loading'` state won't be triggered
          isFetching ? <span> Loading...</span> : null
        }{" "}
      </div>
  );

*/
}