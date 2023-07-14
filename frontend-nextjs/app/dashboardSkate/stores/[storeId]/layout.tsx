import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import { StoreTabs } from "@/components/store-tabs"

import { ShellHeader } from "@/components/shell-header"


interface StoreLayoutProps {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const storeId = Number(params.storeId)

  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <Shell layout="dashboard">
      <Header title={store.name} size="sm" />
      <ShellHeader
        title={store.name}
        description="New application."
        buttonText="Cancel"
        buttonLink="/dashboard/applications"
        iconVariant="cancel"
        buttonVariant="destructive"
        size="sm"
      />

      <div className="space-y-4 overflow-hidden">
        <StoreTabs storeId={storeId} />
        {children}
      </div>
    </Shell>
  )
}
