import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import Org from "./orgs"

import { useOrganizationList } from "@clerk/nextjs";

import ApplicationStatus from "./application-status"

export const metadata: Metadata = {
  title: "Application Status",
  description: "View application status",
}

interface ApplicationStatusProps {
  params: {
    storeId: string
  }
}

export default async function ApplicationStatusPage({
  params,
}: ApplicationStatusProps) {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  // console.log("STATUS")
  // console.log(user)


  // const { organizationList, isLoaded } = useOrganizationList();
  // console.log("ORGANISATION")
  // console.log(organizationList)

  

  const storeId = Number(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) {
    notFound()
  }

  return <ApplicationStatus />

}
