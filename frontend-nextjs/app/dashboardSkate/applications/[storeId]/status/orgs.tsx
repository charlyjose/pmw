"use client"

// Lists all organization the user is a member of.
// Each entry can be a link to a page to manage organization
// members.

// If you create a new Organization, this list will update automatically.
import Link from "next/link"
import { useOrganizationList } from "@clerk/nextjs"
import { C } from "drizzle-orm/select.types.d-1d455120"

export default function Org() {
  const { organizationList, isLoaded } = useOrganizationList()

  if (!organizationList) {
    console.log("DAAMN")
  }

  if (organizationList) {
    console.log("DAAMN 2")
  }


  if (!isLoaded) {
    // Any loading state
    return null
  }

  return (
    <div>
      <h2>Your organizations</h2>
      {organizationList.length === 0 ? (
        <div>You do not belong to any organizations yet.</div>
      ) : (
        <ul>
          {organizationList.map(({ organization }) => (
            <li key={organization.id}>
              <a href={`/organizations/${organization.id}`} />
              <a>{organization.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
