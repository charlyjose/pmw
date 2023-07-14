import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { AddStoreForm } from "@/components/forms/add-store-form"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "New Application",
  description: "Add a new application",
}

export default async function NewStorePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <Header
        title="New Application"
        description="New application for your account."
        size="sm"
      />
      <AddStoreForm userId={user.id} />
    </section>
  )
}
