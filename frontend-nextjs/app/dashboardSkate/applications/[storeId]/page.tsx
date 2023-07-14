import type { Metadata } from "next"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { and, eq, not } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
// import { Label } from "@/components/ui/label"
import { Label } from "@/app/registry/new-york/ui/label"
import { Input } from "@/app/registry/new-york/ui/input"
import { Textarea } from "@/app/registry/new-york/ui/textarea"



export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store",
}

interface UpdateStorePageProps {
  params: {
    storeId: string
  }
}

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const storeId = Number(params.storeId)

  async function updateStore(fd: FormData) {
    "use server"

    const name = fd.get("name") as string
    const description = fd.get("description") as string

    const storeWithSameName = await db.query.stores.findFirst({
      where: and(eq(stores.name, name), not(eq(stores.id, storeId))),
      columns: {
        id: true,
      },
    })

    if (storeWithSameName) {
      throw new Error("Store name already taken")
    }

    await db
      .update(stores)
      .set({ name, description })
      .where(eq(stores.id, storeId))

    revalidatePath(`/dashboard/applications/${storeId}`)
  }

  async function deleteStore() {
    "use server"

    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
      columns: {
        id: true,
      },
    })

    if (!store) {
      throw new Error("Store not found")
    }

    await db.delete(stores).where(eq(stores.id, storeId))

    const path = "/dashboard/applications"
    revalidatePath(path)
    redirect(path)
  }

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

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update your application</CardTitle>
        <CardDescription>
          Update your application name and description, or delete it
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          action={updateStore}
          className="grid w-full max-w-xl gap-5"
        >
          <fieldset className="grid gap-2.5">
            <Label htmlFor="update-store-name">Name</Label>
            <Input
              id="update-store-name"
              aria-describedby="update-store-name-description"
              name="name"
              required
              minLength={3}
              maxLength={50}
              placeholder="Type store name here."
              defaultValue={store.name}
            />
          </fieldset>
          <fieldset className="grid gap-2.5">
            <Label htmlFor="update-store-description">Description</Label>
            <Textarea
              id="update-store-description"
              aria-describedby="update-store-description-description"
              name="description"
              minLength={3}
              maxLength={255}
              placeholder="Type store description here."
              defaultValue={store.description ?? ""}
            />
          </fieldset>
          <div className="flex space-x-2">
            <LoadingButton>
              Update Application
              <span className="sr-only">Update Aplication</span>
            </LoadingButton>
            <LoadingButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              formAction={deleteStore}
              variant="destructive"
            >
              Delete Application
              <span className="sr-only">Delete Aplication</span>
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
