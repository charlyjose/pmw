"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";
const API_URI = "http://localhost:8000";

import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import axios from "axios";
import { saveAs } from "file-saver";
import moment from "moment";

import { Switch } from "@/registry/new-york/ui/switch";
import { Label } from "@/registry/new-york/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FrownIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { DownloadIcon } from "lucide-react";
import { ArrowDownToLineIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { ArrowUpRight } from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

export function PlacementVisit() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [applications, setApplication] = React.useState([]);
  const [axiosConfig, setAxiosConfig] = React.useState({});

  if (!session && session?.data?.user?.role != PAGE_TYPE) {
    router.push(UNAUTHORISED_REDIRECTION_LINK);
  }

  useEffect(() => {
    // Auth check
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    } else if (session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }
    const fetchData = async () => {
      setIsLoading(true);
      var toast_variant = "default";
      var toast_title = "Job Applications";
      var toast_description = "";

      var token = session?.token;
      const config = {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      };

      setAxiosConfig(config);

      await axios
        .get(`${API_URI}/api/student/placement/visit/itinerary`, config)
        .then((e) => {
          if (e.data.data?.placement_visit_itinerary?.length > 0) {
            setApplication(e.data.data.placement_visit_itinerary);
            toast_variant = "default";
            toast_description = "Successfully fetched placement visits";
          } else {
            toast_variant = "destructive";
            toast_description = "No placement visits found";
          }
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        })
        .catch((e) => {
          toast_variant = "destructive";
          toast_title = "Placement Visits";
          toast_description = `${e.response.data.message}`;
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    setIsLoading(false);

    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Icons.spinner className="mr-2 w-20 h-20 text-lime-600 animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">
              Fetching visit details
            </h3>
          </div>
        </div>
      )}
      {!isLoading && (
        <ApplicationsDisplay
          applications={applications}
          axiosConfig={axiosConfig}
        />
      )}
    </>
  );
}

export function ApplicationsDisplay(props) {
  const displayApplications = (props) => {
    const { applications, axiosConfig } = props;

    const [visitCompleted, setVisitCompleted] = React.useState(
      applications[0].completed
    );

    const updateCompleteVisitStatus = async (status, placement_id) => {
      console.log("Updating visit status to: " + status);

      const API_URI = "http://localhost:8000";
      axios
        .put(
          `${API_URI}/api/student/placement/visit/itinerary/status?id=${placement_id}&status=${status}`,
          {
            status: status,
          },
          axiosConfig
        )
        .then((e) => {
          const toast_variant = "default";
          const toast_title = "Placement Visit";
          const toast_description = `Application status updated to ${
            status ? "Completed" : "Pending"
          }`;
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });

          hotToast.success(e.data.message, {
            style: {
              background: "#4B5563",
              color: "#F3F4F6",
            },
          });
        })
        .catch((e) => {
          toast({
            variant: "destructive",
            title: "Something went wrong!",
            description: e.response?.data?.message
              ? e.response.data.message
              : "",
          });
        });
    };

    if (applications.length > 0) {
      return (
        <>
          {applications.map((placement) => (
            <div className="pb-2">
              <Card
                className="transition-all hover:bg-accent hover:text-accent-foreground"
                key={placement.id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="text-md font-normal">
                      <span className="text-xl font-bold">
                        {placement.tutorName}{" "}
                      </span>
                      <span className="text-md font-normal">
                        planned a visit on{" "}
                      </span>
                      <span className="text-md font-bold">
                        {new Date(placement.visitDate).toDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-normal pt-2">
                      {placement.placements[0].orgName}
                    </div>
                    <div className="text-sm font-normal pt-2">
                      {placement.placements[0].address}
                    </div>
                  </CardTitle>

                  <div className="flex items-center space-x-2">
                    {/* <Switch
                      id="STATUS"
                      defaultChecked={visitCompleted}
                      onCheckedChange={(e) => {
                        if (e) {
                          updateCompleteVisitStatus(true, placement.id);
                          setVisitCompleted(true);
                        } else {
                          updateCompleteVisitStatus(false, placement.id);
                          setVisitCompleted(false);
                        }
                      }}
                      className="hover:bg-accent hover:border-accent-foreground"
                    />
                    <Label htmlFor="text-left">
                      {visitCompleted ? (
                        <span>Cancel Visit</span>
                      ) : (
                        <span>Confirm Visit</span>
                      )}
                    </Label> */}
                    {placement.placements[0].visitStatus === "PENDING" ? (
                      <Badge variant="secondary" className="font-bold text-md">
                        <span className="text-yellow-600">Pending</span>
                      </Badge>
                    ) : placement.placements[0].visitStatus === "SCHEDULED" ? (
                      <Badge variant="default" className="font-bold text-md">
                        <span className="text-green-200">Scheduled</span>
                      </Badge>
                    ) : placement.placements[0].visitStatus === "CONFIRMED" ? (
                      <Badge variant="secondary" className="font-bold text-md">
                        <span className="text-purple-600">Confirmed</span>
                      </Badge>
                    ) : placement.placements[0].visitStatus === "COMPLETED" ? (
                      <Badge variant="secondary" className="font-bold text-md">
                        <span className="text-green-600">Completed</span>
                      </Badge>
                    ) : placement.placements[0].visitStatus === "CANCELLED" ? (
                      <Badge variant="secondary" className="font-bold text-md">
                        <span className="text-red-600">Cancelled</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="font-bold text-md">
                        <span className="text-yellow-600">Unknown</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={placement.id}>
                      <AccordionTrigger className="text-right text-sm font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                        <span className="font-bold text-xs">
                          + Additional Details
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">Role: </span>
                            {placement.placements[0].roleTitle}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">Started On: </span>
                            {new Date(
                              placement.placements[0].startDate
                            ).toDateString()}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-xs font-medium">
                            <span className="font-bold">Ending On: </span>
                            {new Date(
                              placement.placements[0].endDate
                            ).toDateString()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <FrownIcon className="mr-2 w-20 h-20 text-lime-600" />
            <h3 className="mt-4 text-lg font-semibold">
              You have no visits scheduled.
            </h3>
          </div>
        </div>
      );
    }
  };
  return <>{displayApplications(props)}</>;
}
