"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card";
import { Button } from "@/registry/new-york/ui/button";

import { Icons } from "@/components/icons";
import {
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { CalendarX2 } from "lucide-react";

import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineEditCalendar } from "react-icons/md";

import { toast } from "@/registry/new-york/ui/use-toast";

export function AllAppointments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // // Validating client-side session
    // if (!session && session?.user?.role != PAGE_TYPE) {
    //   router.push(UNAUTHORISED_REDIRECTION_LINK);
    // }


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
      var toast_title = "Appointments";
      var toast_description = "";

      const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
      var token = session?.token;
      const config = {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      };

      await axios
        .get(`${API_URI}/api/appointments/me/future`, config)
        .then((e) => {
          if (e.data.data?.appointments?.length > 0) {
            setAppointments(e.data.data.appointments);

            toast_variant = "default";
            toast_title = "Appointments";
            toast_description = "Successfully fetched all your appointments";
          } else {
            toast_variant = "destructive";
            toast_title = "Appointments";
            toast_description = "No appointments found";
          }
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        })
        .catch((e) => {
          toast_variant = "destructive";
          toast_title = "Appointments";
          toast_description = "Error fetching your appointments";
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        });

      setTimeout(() => {
        setIsLoading(false);
        // router.push("/student/appointments")
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Future appointments
          <Separator className="my-2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {/* Put Item to the center */}
        {isLoading && (
          <>
            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <Icons.spinner className="mr-2 w-20 h-20 text-lime-600 animate-spin" />
                <h3 className="mt-4 text-lg font-semibold">
                  Fetching your appointments
                </h3>
              </div>
            </div>
          </>
        )}
        {!isLoading && <AppointmentsDisplay appointments={appointments} />}
      </CardContent>
    </Card>
  );
}

export function AppointmentsDisplay(props) {
  const [open, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayAppointments = (props) => {
    const { appointments } = props;

    if (appointments.length > 0) {
      return (
        <ScrollArea className="rounded-md h-96 p-2">
          {appointments.map((appointment) => {
            return (
              <div className="grid grid-cols-12 gap-4 pb-5 rounded-md p-3 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="col-span-1">
                  {appointment.status.toUpperCase() === "CONFIRMED" ? (
                    <CheckCircledIcon className="mt-px h-6 w-6 text-lime-700" />
                  ) : appointment.status.toUpperCase() === "CANCELLED" ? (
                    <CrossCircledIcon className="mt-px h-6 w-6 text-red-700" />
                  ) : (
                    <QuestionMarkCircledIcon className="mt-px h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div className="col-span-11">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-4">
                      <p className="leading-none">
                        <span className="text-xl font-extrabold">
                          {new Date(appointment.date).toDateString()}
                        </span>
                        <span className="text-md font-light"> @ </span>
                        <span className="text-md font-extrabold">
                          {appointment.time}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-1">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="link"
                            className="text-right font-medium"
                          >
                            View
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">
                                Description
                              </h4>
                              <p className="text-sm">
                                {appointment.description}
                              </p>
                              <div className="flex items-center pt-2">
                                <MdOutlineCalendarMonth className="mr-1 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                  Created on{" "}
                                  {new Date(
                                    appointment.createdAt
                                  ).toDateString()}
                                </span>
                              </div>
                              <div className="flex items-center pt-1">
                                <MdOutlineEditCalendar className="mr-1 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                  Updated on{" "}
                                  {new Date(
                                    appointment.createdAt
                                  ).toDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 pt-2">
                    <div className="col-span-4">
                      <p className="text-sm font-medium leading-none">
                        <Badge variant="outline">{appointment.mode}</Badge>{" "}
                        <Badge variant="outline">
                          {appointment.agenda.replace("_", " ")}
                        </Badge>{" "}
                        <Badge variant="outline">
                          MEETING WITH {appointment.team.toUpperCase()}
                        </Badge>{" "}
                        {appointment.status.toUpperCase() === "CONFIRMED" ? (
                          <Badge variant="default">CONFIRMED</Badge>
                        ) : appointment.status.toUpperCase() === "CANCELLED" ? (
                          <Badge variant="secondary">CANCELLED</Badge>
                        ) : (
                          <Badge variant="destructive">PENDING</Badge>
                        )}
                      </p>
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      );
    } else {
      return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <CalendarX2 className="mr-2 w-20 h-20 text-lime-600" />
            <h3 className="mt-4 text-lg font-semibold">
              No future appointments
            </h3>
          </div>
        </div>
      );
    }
  };
  return <>{displayAppointments(props)}</>;
}
