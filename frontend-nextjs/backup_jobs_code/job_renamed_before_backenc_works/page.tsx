"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Separator } from "@/registry/new-york/ui/separator";

import { jobSchema } from "./data/schema";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function JobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Auth check
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const API_URI = "http://localhost:8000";
      const data = (await axios.get(`${API_URI}/api/jobs`)).data;
      const new_jobs = z.array(jobSchema).parse(data);

      setJobs(new_jobs);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
            Jobs</h3>
          <p className="text-sm text-muted-foreground">
            Here you can view all the curated jobs from Career Service
          </p>
        </div>
        <Separator />
        <div className="p-2">
          <DataTable data={jobs} columns={columns} />
        </div>
      </div>
    </>
  );
}
