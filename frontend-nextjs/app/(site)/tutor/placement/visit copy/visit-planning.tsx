"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import { Dialog } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/registry/new-york/ui/alert-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card";

import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineEditCalendar } from "react-icons/md";

import { Icons } from "@/components/icons";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { CalendarX2 } from "lucide-react";
import {
  Flag,
  MoreHorizontal,
  Trash,
  CalendarOffIcon,
  CalendarCheckIcon,
  CalendarCheck2Icon,
} from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { LocationSearch } from "./location-search/page";

function sendResponse(appointmentId: string, response: string, config: any) {
  console.log(appointmentId, response, config);

  axios
    .post(
      `http://localhost:8000/api/appointments/response?id=${appointmentId}&status=${response.toUpperCase()}`,
      {},
      config
    )
    .then((e) => {
      hotToast.success(e.data.message, {
        style: {
          background: "#4B5563",
          color: "#F3F4F6",
        },
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch(() => {
      toast({ variant: "destructive", title: "Something went wrong!" });
    });
}

export function VisitPlanning() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [axiosConfig, setAxiosConfig] = useState({});

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    const fetchData = async () => {
      setIsLoading(true);
      var toast_variant = "default";
      var toast_title = "Appointments";
      var toast_description = "";

      const API_URI = "http://localhost:8000";
      var token = session?.token;
      const config = {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      };
      setAxiosConfig(config);

      await axios
        .get(
          `${API_URI}/api/appointments/team/future?team=${PAGE_TYPE}`,
          config
        )
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
      }, 3000);
    };

    fetchData();
  }, []);

  return (
    <div className="grid gap-2 grid-cols-12 md:grid-cols-2 lg:grid-cols-12">
      <div className="col-span-9">
        <LocationSearch
        // organisationLocationGoogleMapsAddress={
        //   setOrganisationLocationGoogleMapsAddress
        // }
        // organisationLocationGoogleMapsLat={
        //   setOrganisationLocationGoogleMapsLat
        // }
        // organisationLocationGoogleMapsLng={
        //   setOrganisationLocationGoogleMapsLng
        // }
        // searchAddress={organisationLocationGoogleMapsAddress}
        // searchLat={organisationLocationGoogleMapsLat}
        // searchLng={organisationLocationGoogleMapsLng}
        // required
        />
      </div>

      <div className="col-span-3"></div>
    </div>
  );
}

export function AppointmentsDisplay(props) {
  const [open, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayAppointments = (props) => {
    const { appointments, axiosConfig } = props;

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
                    <div className="col-span-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="link"
                            className="text-right font-medium"
                          >
                            <span className="sr-only">Actions</span>
                            Respond
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                            <CalendarCheck2Icon className="mr-2 h-4 w-4" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => setShowDeleteDialog(true)}
                            className="text-red-600"
                          >
                            <CalendarOffIcon className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <AlertDialog open={open} onOpenChange={setIsOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirm this appointment?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          variant="default"
                          onClick={() => {
                            setIsOpen(false);
                            toast({
                              title: "Appointment confirmed",
                            });
                            sendResponse(
                              appointment.id,
                              "CONFIRMED",
                              axiosConfig
                            );
                          }}
                        >
                          Confirm this appointment
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setShowDeleteDialog(false);
                            toast({
                              variant: "destructive",
                              title: "Appointment cancelled",
                            });
                            sendResponse(
                              appointment.id,
                              "CANCELLED",
                              axiosConfig
                            );
                          }}
                        >
                          Cancel this appointment
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
            <CalendarX2 className="mr-2 w-20 h-20 text-red-600" />
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