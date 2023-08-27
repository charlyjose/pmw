"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";

import {
  Users,
  CalendarRange,
  ScrollText,
  UserCheck,
  CalendarClock,
} from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

export function HomeInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [axiosConfig, setAxiosConfig] = useState({});

  const [number_of_students, set_number_of_students] = useState(0);
  const [number_of_future_appointments, set_number_of_future_appointments] =
    useState(0);
  const [
    number_of_placement_applications_not_yet_approved,
    set_number_of_placement_applications_not_yet_approved,
  ] = useState(0);
  const [
    number_of_students_currently_in_placements,
    set_number_of_students_currently_in_placements,
  ] = useState(0);
  const [
    number_of_students_ending_placements_in_the_next_3_months,
    set_number_of_students_ending_placements_in_the_next_3_months,
  ] = useState(0);
  const [
    number_of_scheduled_placement_visits,
    set_number_of_scheduled_placement_visits,
  ] = useState(0);

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };
    setAxiosConfig(config);

    const fetchData = async () => {
      var toast_variant = "default";
      var toast_title = "Home Info";
      var toast_description = "";

      await axios
        .get(`${API_URI}/api/home`, config)
        .then((e) => {
          const data = e.data.data;

          if (data != null) {
            set_number_of_students(data.number_of_students);
            set_number_of_future_appointments(
              data.number_of_future_appointments
            );
            set_number_of_placement_applications_not_yet_approved(
              data.number_of_placement_applications_not_yet_approved
            );
            set_number_of_students_currently_in_placements(
              data.number_of_students_currently_in_placements
            );
            set_number_of_students_ending_placements_in_the_next_3_months(
              data.number_of_students_ending_placements_in_the_next_3_months
            );
            set_number_of_scheduled_placement_visits(
              data.number_of_scheduled_placement_visits
            );
          } else {
            toast_variant = "destructive";
            toast_title = "Home Info";
            toast_description = "No data to display";

            toast({
              variant: toast_variant,
              title: toast_title,
              description: toast_description,
            });
          }
        })
        .catch((e) => {
          toast_variant = "destructive";
          toast_title = "Home Info";
          toast_description = "Error fetching data";
          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
          });
        });
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{number_of_students}</div>
            <p className="text-xs text-muted-foreground">
              Students under your supervision
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarRange className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_future_appointments}
            </div>
            <p className="text-xs text-muted-foreground">
              Your future appointments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Placement Applications
            </CardTitle>
            <ScrollText className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_placement_applications_not_yet_approved}
            </div>
            <p className="text-xs text-muted-foreground">
              Applications to be reviewed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Placement Students
            </CardTitle>
            <Users className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_students_currently_in_placements}
            </div>
            <p className="text-xs text-muted-foreground">
              Students currently on placement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student finishing placement
            </CardTitle>
            <UserCheck className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_students_ending_placements_in_the_next_3_months}
            </div>
            <p className="text-xs text-muted-foreground">
              Students finishing placement in the next 3 months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Placement Visits
            </CardTitle>
            <CalendarClock className="mr-2 w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_scheduled_placement_visits}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled placement visits
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
