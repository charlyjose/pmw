import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Applications",
  description: "Manage your applications",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
    with: {
      products: {
        columns: {
          id: true,
        },
      },
    },
  })

  return (
    <Shell layout="dashboard">
      <Header title="Applications" description="Manage your applications" size="sm" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {userStores.map((store) => (
          <Card key={store.id} className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">{store.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {store.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link key={store.id} href={`/dashboard/applications/${store.id}`}>
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  View application
                  <span className="sr-only">View {store.name} store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
        {userStores.length < 3 && (
          <Card className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">Create a new application</CardTitle>
              <CardDescription className="line-clamp-2">
                Create a new application to start selling your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/applications/new">
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  Create an application
                  <span className="sr-only">Create a new application</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Shell>
  )
}
