"use client";

const PAGE_TYPE = "CSD";
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

  const [graduate_students, set_graduate_students] = useState(0);
  const [undergraduate_students, set_undergraduate_students] = useState(0);
  const [
    students_currently_in_placements,
    set_students_currently_in_placements,
  ] = useState(0);
  const [future_appointments, set_future_appointments] = useState(0);

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
            set_graduate_students(data.graduate_students);
            set_undergraduate_students(data.undergraduate_students);
            set_students_currently_in_placements(
              data.students_currently_in_placements
            );
            set_future_appointments(data.future_appointments);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Graduate Students
            </CardTitle>
            <Users className="mr-2 w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graduate_students}</div>
            <p className="text-xs text-muted-foreground">
              Total number of graduate students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Under Graduate Students
            </CardTitle>
            <Users className="mr-2 w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{undergraduate_students}</div>
            <p className="text-xs text-muted-foreground">
              Total number of undergraduate students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Placement Students
            </CardTitle>
            <Users className="mr-2 w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students_currently_in_placements}
            </div>
            <p className="text-xs text-muted-foreground">
              Students currently on placement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarRange className="mr-2 w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{future_appointments}</div>
            <p className="text-xs text-muted-foreground">
              Your future appointments
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
