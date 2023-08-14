"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Button } from "@/registry/new-york/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/registry/new-york/ui/input";
import { Calendar } from "@/registry/new-york/ui/calendar";

import { Button as ShadcnButton } from "@/registry/new-york/ui/button";

import { CalendarIcon, CheckCircle2Icon } from "lucide-react";
import { Icons } from "@/components/icons";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { LocationSearch } from "./location-search/page";

export const placementStartDeclarationFormSchema = z.object({
  roleTitle: z
    .string()
    .min(2, {
      message: "Role Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Role Title must not be longer than 100 characters.",
    }),
  startDate: z
    .date({
      required_error: "Role Start Date is required",
    })
    .refine(
      (data) => {
        const today = new Date();
        const selectedDate = new Date(data);
        return selectedDate <= today;
      },
      {
        message: "Role Start Date must not be in the future",
      }
    ),
  endDate: z
    .date({
      required_error: "Role End Date is required",
    })
    .refine(
      (data) => {
        const today = new Date();
        const selectedDate = new Date(data);
        return selectedDate >= today;
      },
      {
        message: "Role End Date must be in the future",
      }
    ),
  orgName: z
    .string()
    .min(2, {
      message: "Name of Organisation must be at least 2 characters.",
    })
    .max(100, {
      message: "Name of Organisation must not be longer than 100 characters.",
    }),
});

type PlacementStartDeclarationFormValues = z.infer<
  typeof placementStartDeclarationFormSchema
>;

export function PlacementStartDeclaration() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [
    organisationLocationGoogleMapsAddress,
    setOrganisationLocationGoogleMapsAddress,
  ] = useState("");
  const [
    organisationLocationGoogleMapsLat,
    setOrganisationLocationGoogleMapsLat,
  ] = useState(52.620674);
  const [
    organisationLocationGoogleMapsLng,
    setOrganisationLocationGoogleMapsLng,
  ] = useState(-1.125511);

  const defaultValues: Partial<PlacementStartDeclarationFormValues> = {};
  const form = useForm<PlacementStartDeclarationFormValues>({
    resolver: zodResolver(placementStartDeclarationFormSchema),
    defaultValues,
  });

  const [isDeclaration, setIsDeclaration] = useState(false);

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    // Fetching data from API
    const fetchData = async () => {
      var toast_variant = "default";
      var toast_title = "Placement Start Declaration";
      var toast_description = "";

      const API_URI = "http://localhost:8000";
      var token = session?.token;
      const config = {
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get(`${API_URI}/api/student/placement/declaration`, config)
        .then((e) => {
          const applications = e.data.data.placement_declaration;
          console.log(applications);
          if (applications.length > 0) {
            const application = applications[0];

            const formValues = {
              ...application,
              startDate: new Date(application.startDate),
              endDate: new Date(application.endDate),
            };
            form.reset(formValues);

            // Set the location search values
            setOrganisationLocationGoogleMapsAddress(application.address);
            setOrganisationLocationGoogleMapsLat(application.latitude);
            setOrganisationLocationGoogleMapsLng(application.longitude);

            setIsDeclaration(true);

            toast_variant = "default";
            toast_title = "Placement Application";
            toast_description = "Successfully fetched your application";
          } else {
            toast_variant = "destructive";
            toast_description = "No application found";
          }

          toast({
            variant: toast_variant,
            title: toast_title,
            description: toast_description,
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

    fetchData();
  }, []);

  function onSubmit(data: PlacementStartDeclarationFormValues) {
    setIsLoading(true);

    const placementStartDeclarationData = {
      ...data,
      address: organisationLocationGoogleMapsAddress,
      latitude: organisationLocationGoogleMapsLat,
      longitude: organisationLocationGoogleMapsLng,
    };

    console.log(placementStartDeclarationData);

    const API_URI = "http://localhost:8000";
    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        `${API_URI}/api/student/placement/declaration`,
        placementStartDeclarationData,
        config
      )
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Placement Start Declaration";
        const toast_description = "Successfully submitted your application";
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

        setTimeout(() => {
          setIsLoading(false);
          // router.push("/student/appointments");
        }, 1000);
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: e.response?.data?.message ? e.response.data.message : "",
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }

  return (
    <>
      <div className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                    <span>
                      Placement Start Declaration{" "}
                      <span className="text-xs font-medium text-left">
                        {isDeclaration
                          ? "(Already submitted) ✅"
                          : "(Not yet submitted) ❌"}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-1 pt-10 pb-10">
                    <div className="flex flex-col space-y-3">
                      <div className="grid grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="roleTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Role Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="pb-2">
                                Role Start Date
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Start date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      // Disable dates in the future
                                      date > new Date()
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="pb-2">
                                Role End Date
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>End date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      // Disable dates in the past
                                      date < new Date()
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="orgName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name of Organisation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Placement Provider"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-10">
                      <div className="grid grid-cols-1 gap-4">
                        <LocationSearch
                          organisationLocationGoogleMapsAddress={
                            setOrganisationLocationGoogleMapsAddress
                          }
                          organisationLocationGoogleMapsLat={
                            setOrganisationLocationGoogleMapsLat
                          }
                          organisationLocationGoogleMapsLng={
                            setOrganisationLocationGoogleMapsLng
                          }
                          searchAddress={organisationLocationGoogleMapsAddress}
                          searchLat={organisationLocationGoogleMapsLat}
                          searchLng={organisationLocationGoogleMapsLng}
                          required
                        />
                      </div>
                    </div>

                    <div className="text-right pt-5">
                      <Button disabled={isLoading} type="submit">
                        {isLoading && (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Hang on! We're submitting your application...
                          </>
                        )}
                        {!isLoading && (
                          <>
                            <CheckCircle2Icon className="mr-2 h-4 w-4" />
                            Submit application
                          </>
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
