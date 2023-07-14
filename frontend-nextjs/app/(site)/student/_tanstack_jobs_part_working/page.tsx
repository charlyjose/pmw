"use client";

import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Separator } from "@/registry/new-york/ui/separator";

import { jobSchema } from "./data/schema";

const jobs_data = [
  {
    id: "JOB-8782",
    title: "Sales Development Representative (SDR) Placement",
    description:
      "**APPLY TODAY!** This is a description for the job placement for SDR. This jobs is for the people who are interested in sales and marketing. This is a description for the job placement for SDR. This jobs is for the people who are interested in sales and marketing. This is a description for the job placement for SDR. This jobs is for the people who are interested in sales and marketing. This is a description for the job placement for SDR. This jobs is for the people who are interested in sales and marketing.",
    salary: "£20,000",
    company: "Awesome Company",
    placement: "remote",
    location: ["London", "Manchester", "Leeds"],
    label: "bug",
    deadline: "12 July 2023",
    link: "https://google.com",
  },
  {
    id: "JOB-7878",
    title: "9 Months Accounting Executive Internship",
    // description:
    //   "This is a description for the job placement for Accounting Executive.",
    description: `A paragraph with *emphasis* and **strong importance**.

    > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
    
    * Lists
    * [ ] todo
    * [x] done
    
    A table:
    
    | a | b |
    | - | - |


    // | a | b |
    // | - | - |
    
    A paragraph with *emphasis* and **strong importance**.

    > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
    
    * Lists
    * [ ] todo
    * [x] done
    
    A table:
    
    | a | b |
    | - | - |


    A paragraph with *emphasis* and **strong importance**.

    > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
    
    * Lists
    * [ ] todo
    * [x] done
    
    A table:
    
    | a | b |
    | - | - |

    `,
    salary: "£25,000",
    company: "Perfect Company Corporation",
    placement: "hybrid",
    location: ["Glasgow", "Sheffield"],
    label: "documentation",
    deadline: "15 July 2023",
    link: "https://google.com",
  },
  {
    id: "JOB-5562",
    title: "6 Months Software Engineer Internship",
    description:
      "This is a description for the job placement for Software Engineer.",
    salary: "£30,000",
    company: "Incredible Company Ltd.",
    placement: "office",
    location: ["Cardiff"],
    label: "feature",
    deadline: "20 July 2023",
    link: "https://google.com",
  },
];

// Simulate a database read for tasks.
async function getJobs() {
  // const data = await fs.readFile(
  //   path.join("./data/jobs.json")
  // )

  const API_URI = "http://localhost:8000";
  const res = await fetch(`${API_URI}/api/jobs`);
  const json = await res.json();
  return z.array(jobSchema).parse(json);

  // WORKING PIECE OF CODE
  // const data = JSON.stringify(jobs_data);
  // const jobs = JSON.parse(data.toString());
  // return z.array(jobSchema).parse(jobs);
}

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
const queryClient = new QueryClient();

export default async function JobPage() {
  // const jobs = await getJobs();

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Jobs</h3>
          <p className="text-sm text-muted-foreground">
            Here you can view all the curated jobs from career service.
          </p>
        </div>
        <Separator />
        <div className="p-2">
          {/* <DataTable data={jobs} columns={columns} /> */}
          <QueryClientProvider client={queryClient}>
            <DataTable columns={columns} />
          </QueryClientProvider>
        </div>
      </div>
    </>
  );
}
