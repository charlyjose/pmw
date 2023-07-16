"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import { Separator } from "@/components/ui/separator";

import {
  CheckCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";

import { CalendarX2 } from "lucide-react";
import { toast } from "@/registry/new-york/ui/use-toast";

export function AllAppointments() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

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
      }, 3000);
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
  const displayAppointments = (props) => {
    const { appointments } = props;

    if (appointments.length > 0) {
      return (
        <>
          <ScrollArea className="rounded-md h-72 p-2">
            {appointments.map((appointment) => {
              return (
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-3 transition-all hover:bg-accent hover:text-accent-foreground">
                  {appointment.confirmed === true ? (
                    <CheckCircledIcon className="mt-px h-6 w-6 text-lime-700" />
                  ) : (
                    <QuestionMarkCircledIcon className="mt-px h-6 w-6 text-red-700" />
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {new Date(appointment.date).toDateString()} @{" "}
                      {appointment.time}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      <Badge>Duration: {appointment.duration} mins</Badge>{" "}
                      <Badge>Mode: {appointment.mode}</Badge>{" "}
                      <Badge>Team: {appointment.team.toUpperCase()}</Badge>{" "}
                      {appointment.confirmed === true ? (
                        <Badge variant="secondary">
                          Status:{" "}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Status:{" "}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      )}{" "}
                    </p>
                    {appointment.invitees.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold">Invitees: </span>
                        {appointment.invitees.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </>
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
