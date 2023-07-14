"use client"
"use client"

import { useEffect, useState } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { authSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"
import { Input } from "@/app/registry/new-york/ui/input"

type Inputs = z.infer<typeof authSchema>

export function SignInForm() {

  
  const session = useSession()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [data, setData] = useState({
    email: "",
    password: "",
  })

  // Already Logged In
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard")
    }
  })




/*

Invalid `prisma.user.findUnique()` invocation: error: Error validating datasource `db`: the URL must start with the protocol `mongo`. --> schema.prisma:10 | 9 | provider = "mongodb" 10 | url = env("DATABASE_URL") | Validation Error Count: 1

*/

  const loginUser = async (e) => {
    e.preventDefault()



    signIn("credentials", { ...data, redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error)
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully!")
      }
    })


    
  }





  // Disabled ZOD
  // react-hook-form
  const form = useForm<Inputs>({
    // resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {

        signIn("credentials", { ...data, redirect: false }).then((callback) => {
          if (callback?.error) {
            toast.error(callback.error)
          }
    
          if (callback?.ok && !callback?.error) {
            toast.success("Logged in successfully!")
          }
        })


      } catch (error) {
        const unknownError = "Something went wrong, please try again."
        toast.success(unknownError)


      }
    })
  }




  // function onSubmit(data: Inputs) {
  //   console.log(data)

  //   if (!isLoaded) return

  //   startTransition(async () => {
  //     try {
  //       const result = await signIn.create({
  //         identifier: data.email,
  //         password: data.password,
  //       })

  //       console.log(data)
  //       console.log(result)

  //       if (result.status === "complete") {
  //         await setActive({ session: result.createdSessionId })

  //         router.push(`${window.location.origin}/`)
  //       } else {
  //         /*Investigate why the login hasn't completed */
  //         console.log(result)
  //       }
  //     } catch (error) {
  //       const unknownError = "Something went wrong, please try again."

  //       isClerkAPIResponseError(error)
  //         ? toast.error(error.errors[0]?.longMessage ?? unknownError)
  //         : toast.error(unknownError)
  //     }
  //   })
  // }







  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="**********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}
