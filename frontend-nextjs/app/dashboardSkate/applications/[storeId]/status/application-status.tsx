"use client"

import { PageFour } from "./components/PageFour/PageFour"
import { PageOne } from "./components/PageOne/PageOne"
import { PageThree } from "./components/PageThree/PageThree"
import { PageTwo } from "./components/PageTwo/PageTwo"
import { currentUser, useOrganization } from "@clerk/nextjs"

import "./App.css"

import React, { useState } from "react"

import MultiStepProgressBar from "./components/MultiStepProgressBar/MultiStepProgressBar"

import "./index.css"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ApplicationStatus() {
  // const { organizationList, isLoaded } = useOrganizationList();
  // console.log("role:::")
  // console.log(organizationList)

  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();


  console.log(currentOrganization)
  console.log("ROLE:")
  console.log(membership?.role)

  // const isAdmin = membership.role === "admin";




  const [page, setPage] = useState("pageone")

  const nextPage = (page: any) => {
    setPage(page)
  }

  const nextPageNumber = (pageNumber: any) => {
    switch (pageNumber) {
      case "1":
        setPage("pageone")
        break
      case "2":
        setPage("pagetwo")
        break
      case "3":
        setPage("pagethree")
        break
      case "4":
        setPage("pagefour")
        break
      default:
        setPage("1")
    }
  }

  return (
    <Card>
      <MultiStepProgressBar page={page} onPageNumberClick={nextPageNumber} />
      {
        {
          pageone: <PageOne />,
          pagetwo: <PageTwo />,
          pagethree: <PageThree />,
          pagefour: <PageFour />,
        }[page]
      }
    </Card>
  )
}
