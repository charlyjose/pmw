"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { JobListSidebarNav } from "./components/sidebar-nav-jobs-list";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function JobsLayout({
  children,
}: SettingsLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // SESSION CHECK
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const API_URI = "http://localhost:8000";
      const res = await fetch(`${API_URI}/api/jobs`);
      const json = await res.json();
      setJobs(json);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-9">
        <div className="col-span-2">
          <ScrollArea className="rounded-md h-screen">
            <div className="space-y-2">
              <JobListSidebarNav jobs={jobs} />
            </div>
          </ScrollArea>
        </div>

        <div className="col-span-7">
          {children}
        </div>
      </div>
    </>
  );
}
