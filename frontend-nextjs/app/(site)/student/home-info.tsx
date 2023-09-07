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

export function HomeInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [axiosConfig, setAxiosConfig] = useState({});

  const [placement_application, set_placement_application] = useState(false);



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

            if (data.placement_application != null) {
              set_placement_application(data.placement_application);
            }

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
        {placement_application && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Placement Application Status
              </CardTitle>
              <ScrollText className="mr-2 w-5 h-5 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{placement_application}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
