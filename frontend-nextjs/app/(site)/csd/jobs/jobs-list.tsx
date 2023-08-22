"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import { JobFilter } from "./jobs-filter";
import { App } from "./jobs";

export function JobsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [token, setToken] = useState(session?.token);

  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    setToken(session?.token);
  }, []);

  return (
    <>
      <JobFilter filterQuery={setFilterQuery} />
      <>
        {filterQuery}
        <App token={token} filterQuery={filterQuery} />
        {/* <JobsDisplay token={token} filterQuery={filterQuery} /> */}
      </>
    </>
  );
}

export function JobsDisplay(props) {
  return <App props={props} />;
}
