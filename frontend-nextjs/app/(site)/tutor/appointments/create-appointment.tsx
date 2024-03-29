"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { Button } from "@/registry/new-york/ui/button";
import { Calendar } from "@/registry/new-york/ui/calendar";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Separator } from "@/registry/new-york/ui/separator";
import { Input } from "@/registry/new-york/ui/input";

import { Icons } from "@/components/icons";
import { CalendarIcon } from "lucide-react";
import { CheckCircle2Icon } from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { meetingFormSchema } from "./utilities/validation";

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

const defaultValues: Partial<MeetingFormValues> = {
  invitees: [{ value: "" }],
};

export function CreateAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auth check
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    } else if (session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }
  }, []);

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "invitees",
    control: form.control,
  });

  function onSubmit(data: MeetingFormValues) {
    setIsLoading(true);

    const appointmentData = {
      agenda: data.agenda,
      mode: data.mode,
      team: data.team,
      invitees: data.invitees?.flatMap((invitee) => invitee.value),
      description: data.description,
      date: data.date,
      time: data.time,
      duration: data.duration,
    };

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${API_URI}/api/appointments`, appointmentData, config)
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Your appointment details:";
        const toast_description = (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(appointmentData, null, 2)}
            </code>
          </pre>
        );
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
          router.push("/tutor/appointments");
        }, 1000);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error?.response?.data?.message
            ? error.response.data.message
            : "Something went wrong!",
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="px-1 bg-red-300 mr-2 "></span>
            Create appointment
            <Separator className="my-2" />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="agenda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Agenda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meeting agenda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MOCK_INTERVIEW">
                              Mock interview
                            </SelectItem>
                            <SelectItem value="CV_REVIEW">CV review</SelectItem>
                            <SelectItem value="CAREER_GUIDANCE">
                              Career guidance
                            </SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Mode</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meeting mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OFFLINE">Offline</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Party</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meeting party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* <SelectItem value="CSD">Career Services</SelectItem> */}
                            {/* <SelectItem value="TUTOR"> */}
                            {/* Placement Tutor */}
                            {/* </SelectItem> */}
                            <SelectItem value="STUDENT">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`invitees.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Invitee Email
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: "" })}
                >
                  Add any specific invitee's email
                </Button> */}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your reason for meeting"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Meeting Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                // Disable dates in the past
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meeting time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="09:00">09:00 AM</SelectItem>
                            <SelectItem value="09:30">09:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="01:00">01:00 PM</SelectItem>
                            <SelectItem value="01:30">01:30 PM</SelectItem>
                            <SelectItem value="02:00">02:00 PM</SelectItem>
                            <SelectItem value="02:30">02:30 PM</SelectItem>
                            <SelectItem value="03:00">03:00 PM</SelectItem>
                            <SelectItem value="03:30">03:30 PM</SelectItem>
                            <SelectItem value="04:00">04:00 PM</SelectItem>
                            <SelectItem value="04:30">04:30 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meeting duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 mins</SelectItem>
                            <SelectItem value="30">30 mins</SelectItem>
                            <SelectItem value="45">45 mins</SelectItem>
                            <SelectItem value="60">60 mins</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="text-right text-xs font-medium hover:underline">
                <Button disabled={isLoading} type="submit">
                  {isLoading && (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Hang on! We are creating your appointment...
                    </>
                  )}
                  {!isLoading && (
                    <>
                      <CheckCircle2Icon className="mr-2 h-4 w-4" />
                      Create appointment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
