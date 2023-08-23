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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontItalicIcon } from "@radix-ui/react-icons";
import { CheckCircle2Icon } from "lucide-react";

import { Toggle } from "@/registry/new-york/ui/toggle";

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

  console.log("Filter: ", filterQuery);

  const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
  let url = `${API_URI}/api/jobs?page=${page + 1}`;
  if (filterQuery != "") {
    url = url + filterQuery;
  }
  const { data } = await (await axios.get(url, config)).data;
  return data;
}

function Jobs() {
  const { data: session } = useSession();
  const router = useRouter();

  const [industryFilter, setIndustryFilter] = React.useState("");
  const [functionFilter, setFunctionFilter] = React.useState("");
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
  }, [data, isPreviousData, page, queryClient]);

  const updateFilter = async (status) => {
    console.log("Filter status: ", status);

    let applyFilter =
      industryFilter != "" || functionFilter != "" ? true : false;

    if (status == true && applyFilter == true) {
      let newQuery = "";
      if (industryFilter != "") {
        newQuery = `&industry=${industryFilter}`;
      }
      if (functionFilter != "") {
        newQuery = newQuery + `&function=${functionFilter}`;
      }

      console.log("New query: ", newQuery);

      setFilterQuery(newQuery);

      setPage(0);
      queryClient.prefetchQuery({
        queryKey: ["jobs", page + 1],
        queryFn: () =>
          fetchJobs(page + 1, token, newQuery).then((res) => {
            console.log("Filtered data: ", res);
            return res;
          }),
      });
    } else {
      setFilterQuery("");
    }
  };

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
        <div>Error: {error.message}</div>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data

        <>
          <div className="flex items-center justify-items-start">
            <span className="text-md font-normal">Filters</span>
            <div className="pl-2">
              <Select onValueChange={(value) => setIndustryFilter(value)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Job Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="SOFTWARE_DEVELOPMENT">
                      Software Development
                    </SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="CONSULTING">Consulting</SelectItem>
                    <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="RETAIL">Retail</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="pl-2">
              <Select onValueChange={(value) => setFunctionFilter(value)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Job Function" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="INFORMATION_TECHNOLOGY">
                      Information Technology
                    </SelectItem>
                    <SelectItem value="ENGINEERING">Engineering</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="CONSULTING">Consulting</SelectItem>
                    <SelectItem value="SALES">Sales</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="BUSINESS_DEVELOPMENT">
                      Business Development
                    </SelectItem>
                    <SelectItem value="ANALYST">Analyst</SelectItem>
                    <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="pl-2">
              <Toggle
                aria-label="Toggle filters"
                size="sm"
                disabled={
                  industryFilter == "" && functionFilter == "" ? true : false
                }
                defaultPressed={false}
                onPressedChange={(e) => {
                  if (e) {
                    updateFilter(
                      industryFilter != "" || functionFilter != ""
                        ? true
                        : false
                    );
                    setFilter(
                      industryFilter != "" || functionFilter != ""
                        ? true
                        : false
                    );

                    // updateFilter(true);
                    // setFilter(true);
                  } else {
                    updateFilter(false);
                    setFilter(false);
                  }
                }}
                variant={filter == true ? "outline" : "default"}
              >
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                {filter == true ? (
                  <span>Reset Filters</span>
                ) : (
                  <span>Apply Filters</span>
                )}
              </Toggle>{" "}
            </div>
          </div>

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
