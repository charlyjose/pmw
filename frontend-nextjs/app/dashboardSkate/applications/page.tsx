'use client'

import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
// import { currentUser, useOrganizationList } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShellHeader } from "@/components/shell-header"

import { Shell } from "@/components/shell"

export const runtime = "edge"

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


export default async function StoresPage() {
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    if(!session) {
      // redirect("/login")
      router.push('/login')
    }

    console.log(session)
})

  const userStores = await db.query.stores.findMany({
    // where: eq(stores.userId, user.id),
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

      <ShellHeader
        title="Applications"
        description="Manage your applications"
        buttonText="New Application"
        buttonLink="/dashboard/applications/new"
        iconVariant="add"
        buttonVariant="default"
        size="sm"
      />

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
      </div>
    </Shell>
  )
}
