import { useState } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/registry/new-york/ui/input";
import { Button } from "@/registry/new-york/ui/button";
import { Calendar } from "@/registry/new-york/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import { Badge } from "@/registry/new-york/ui/badge";
import { Toggle } from "@/registry/new-york/ui/toggle";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineEditCalendar } from "react-icons/md";

import { Icons } from "@/components/icons";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";

import { placementFormSchema } from "./utilities/validation";

import { LocationSearch } from "./location-search/page";

export const commentFormSchema = z.object({
  comments: z
    .string()
    .max(1500, {
      message: "Comments must not be longer than 1500 characters.",
    })
    .optional(),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

type PlacementFormValues = z.infer<typeof placementFormSchema>;

export function ApplicationDialog({ application, axiosConfig }) {
  const [isLoadingComment, setIsLoadingComment] = useState(false);

  const [
    organisationLocationGoogleMapsAddress,
    setOrganisationLocationGoogleMapsAddress,
  ] = useState(application.organisationLocationGoogleMapsAddress);
  const [
    organisationLocationGoogleMapsLat,
    setOrganisationLocationGoogleMapsLat,
  ] = useState(application.organisationLocationGoogleMapsLat);
  const [
    organisationLocationGoogleMapsLng,
    setOrganisationLocationGoogleMapsLng,
  ] = useState(application.organisationLocationGoogleMapsLng);

  // Typecast the values to the correct type
  application.roleStartDate = new Date(application.roleStartDate);
  application.roleEndDate = new Date(application.roleEndDate);
  application.workingHours = String(application.workingHours);
  application.salary = String(application.salary);

  const defaultValues: Partial<PlacementFormValues> = {
    ...application,
  };

  const [applicationStatus, setApplicationStatus] = useState(
    application.status
  );

  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comments: application.comments,
    },
    mode: "onChange",
  });

  const form = useForm<PlacementFormValues>({
    resolver: zodResolver(placementFormSchema),
    defaultValues,
  });

  function onSubmitComment(data: CommentFormValues) {
    setIsLoadingComment(true);

    const commentData = {
      applicationId: application.id,
      comments: data.comments,
    };

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    axios
      .put(
        `${API_URI}/api/tutor/placement/application/review`,
        commentData,
        axiosConfig
      )
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Placement Application";
        const toast_description = `Application comments added`;
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
          setIsLoadingComment(false);
        }, 1000);
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: e.response?.data?.message ? e.response.data.message : "",
        });

        setTimeout(() => {
          setIsLoadingComment(false);
        }, 1000);
      });
  }

  const updateStatus = async (status) => {
    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    axios
      .put(
        `${API_URI}/api/tutor/placement/application/status?id=${application.id}&status=${status}`,
        {
          status: status,
        },
        axiosConfig
      )
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Placement Application";
        const toast_description = `Application status: ${
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
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
          description: e.response?.data?.message ? e.response.data.message : "",
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <ArrowUpRight className="mr-0 h-4 w-4" />
          <div className="text-right text-xs font-normal hover:underline">
            View
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[1000px]">
        <DialogHeader>
          <DialogTitle>
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-5">
                <div className="pt-1 font-normal">
                  Application for{" "}
                  <span className="font-bold">
                    {application.declarationName}
                  </span>
                </div>
              </div>

              <div className="col-span-3">
                {applicationStatus == "PENDING" ? (
                  <Badge variant="default">PENDING APPLICATION</Badge>
                ) : applicationStatus == "APPROVED" ? (
                  <Badge variant="outline">APPROVED APPLICATION</Badge>
                ) : applicationStatus == "REVIEW" ? (
                  <Badge variant="secondary">CURRENTLY ON REVIEW</Badge>
                ) : (
                  <Badge variant="destructive">REJECTED APPLICATION</Badge>
                )}
              </div>

              <div className="col-span-2">
                <Toggle
                  aria-label="Toggle approve"
                  size="sm"
                  defaultPressed={applicationStatus == "APPROVED"}
                  onPressedChange={(e) => {
                    if (e) {
                      updateStatus("APPROVED");
                      setApplicationStatus("APPROVED");
                    } else {
                      updateStatus("REVIEW");
                      setApplicationStatus("REVIEW");
                    }
                  }}
                  variant={
                    applicationStatus == "APPROVED" ? "outline" : "default"
                  }
                >
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                  {applicationStatus == "APPROVED" ? (
                    <span>Approved</span>
                  ) : (
                    <span>Approve?</span>
                  )}
                </Toggle>
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="STATUS"
                    defaultChecked={
                      applicationStatus == "REVIEW" ||
                      applicationStatus == "APPROVED"
                    }
                    onCheckedChange={(e) => {
                      if (e) {
                        updateStatus("REVIEW");
                        setApplicationStatus("REVIEW");
                      } else {
                        updateStatus("PENDING");
                        setApplicationStatus("PENDING");
                      }
                    }}
                    className="hover:bg-accent hover:border-accent-foreground"
                  />
                  <Label htmlFor="text-left">
                    {applicationStatus == "REVIEW" ? (
                      <span>Change to Pending</span>
                    ) : (
                      <span>Change to Review</span>
                    )}
                  </Label>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <ScrollArea className="rounded-md h-[610px]">
            <Form {...form}>
              <form className="space-y-8">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Student Details
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your first name"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your last name"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="studentNumber"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your student number"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your email address"
                                    disabled
                                    className="text-black"
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
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="contactNumber"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Telephone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your contact number"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="programme"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Programme of Study</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your programme of study"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="department"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School/Department</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your school/department"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="studentVisa"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>
                                  Do you have a student visa?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I have a student visa
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, I do not have a student visa
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Placement provider details
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="organisationName"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name of Organisation</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your placement provider name"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organisationAddress"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Address where the placement will be based
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your placement provider address"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organisationPostcode"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postcode</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your placement provider postcode"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organisationWebAddress"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Web Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your placement provider web address"
                                    disabled
                                    className="text-black"
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
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="organisationContactName"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your contact at the placement provider"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organisationContactJobTitle"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Job Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Title of your contact at the placement provider"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="organisationContactEmail"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Email of your contact at the placement provider"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="organisationContactNumber"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Telephone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Contact telephone number of your contact at the placement provider"
                                    disabled
                                    className="text-black"
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
                            searchAddress={
                              organisationLocationGoogleMapsAddress
                            }
                            searchLat={organisationLocationGoogleMapsLat}
                            searchLng={organisationLocationGoogleMapsLng}
                            required
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Placement role details
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="roleTitle"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your role title"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="roleStartDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="pb-1">
                                  <span className="grid grid-cols-1 gap-4">
                                    Role Start Date{" "}
                                  </span>
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger
                                    asChild
                                    disabled
                                    className="text-black"
                                  >
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
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
                                        // Disable dates in the past
                                        date < new Date()
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="roleEndDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="pb-1">
                                  Role End Date
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger
                                    asChild
                                    disabled
                                    className="text-black"
                                  >
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
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
                            name="workingHours"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Working hours per week</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Working hours per week"
                                    disabled
                                    className="text-black"
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
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="probationPeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Does your role include a probation period?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, the role includes a probation
                                        period
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, the role does not include a
                                        probation period
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="salary"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  What is your salary (annual) for the
                                  placement?
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Annual salary"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roleSource"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  How did you source this role?
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Job board, LinkedIn, etc."
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roleInformed"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Have you informed the Placement Provider that
                                  this placement forms part of your degree
                                  programme?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I have informed the Placement
                                        Provider
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No. If No, please inform the Placement
                                        Provider before proceeding with this
                                        form.
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>{" "}
                      <div className="flex flex-col space-y-3 pt-10">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="roleDescription"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    Please provide a role description of your
                                    placement. Alternatively, please attach a
                                    role description to your email submitting
                                    this form.{" "}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please provide further information"
                                    disabled
                                    className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {form.watch("probationPeriod") === "YES" && (
                        <div className="flex flex-col space-y-3 pt-10">
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name="probationPeriodDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    <span className="grid grid-cols-1 gap-4">
                                      Probation Period Details{" "}
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Work factors
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="remoteWorking"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Does this role involve working from
                                  home/remotely?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, this role involves working from
                                        home/remotely
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, this role does not involve working
                                        from home/remotely
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {form.watch("remoteWorking") === "YES" && (
                        <>
                          <div className="flex flex-col space-y-3 pt-10">
                            <div className="grid grid-cols-1 gap-4">
                              <FormField
                                control={form.control}
                                name="remoteWorkingOverview"
                                disabled
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Please provide an overview of how you will
                                      work remotely. This should include how
                                      often you will work remotely each week.
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Please provide further information"
                                        disabled
                                        className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
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
                              <FormField
                                control={form.control}
                                name="remoteWorkingReason"
                                disabled
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Why does this role involve working from
                                      home?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Please provide further information"
                                        disabled
                                        className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Transport and travel factors
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="travelMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    How will you travel to and from the
                                    placement?{" "}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="OWN_VEHICLE" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Own vehicle
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="PUBLIC_TRANSPORT" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Public transport (bus, train, taxi,
                                        etc.)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="WALKING" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Walking
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="CYCLE" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Cycle
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="OTHER" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Other
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("travelMethod") === "OTHER" && (
                            <FormField
                              control={form.control}
                              name="travelMethodDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Other travel methods</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3 pt-10">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="travelDifferentLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Does this role involve working at a location
                                  different to the Placement Provider's address
                                  that you have given in section 2?{" "}
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, this role involves working at a
                                        location different location other than
                                        given in section 2
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, this role does not involve working
                                        at a location different other than
                                        location given in section 2
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("travelDifferentLocation") === "YES" && (
                            <FormField
                              control={form.control}
                              name="travelDifferentLocationDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Details of the different location
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>{" "}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Location and regional factors
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="locationRisks"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    Are you aware of any risks at the
                                    organisation's main location?{" "}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I am aware of any risks at the
                                        organisation's main location
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, I am not aware of any risks at the
                                        organisation's main location
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("locationRisks") === "YES" && (
                            <FormField
                              control={form.control}
                              name="locationRisksDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location Risks Details</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 pt-10">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="accommodationArrangements"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    What are your accommodation arrangements
                                    when on placement?{" "}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="RENT_SHARED_HOUSE_FLAT" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Rent shared house/flat
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="RENT_INDIVIDUAL_HOUSE_FLAT" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Rent individual house/flat
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="LIVE_AT_HOME" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Live at home
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="OTHER" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Other
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("accommodationArrangements") ===
                            "OTHER" && (
                            <FormField
                              control={form.control}
                              name="accommodationArrangementsDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Accommodation Arrangements Details
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Health and environmental factors
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="precautionaryMeasures"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    Are you aware of any precautionary measures
                                    you are required to undertake before,
                                    during, or after the placement?
                                  </span>
                                </FormLabel>

                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I am aware of any precautionary
                                        measures to undertake
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, I am not aware of any precautionary
                                        measures to undertake
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("precautionaryMeasures") === "YES" && (
                            <FormField
                              control={form.control}
                              name="precautionaryMeasuresDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Precautionary Measures Details
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Personal factors
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="healthConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    Do you have any health conditions that may
                                    require adjustments on your placement?
                                  </span>
                                </FormLabel>

                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I have health conditions that may
                                        require adjustments on my placement
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, I do not have health conditions that
                                        may require adjustments on my placement
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("healthConditions") === "YES" && (
                            <FormField
                              control={form.control}
                              name="healthConditionsDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Health Conditions Details
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 pt-10">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="disability"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="grid grid-cols-1 gap-4">
                                    Do you have a disability which may require
                                    adjustments on your placement?
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, I have health conditions that may
                                        require adjustments on my placement
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, I do not have health conditions that
                                        may require adjustments on my placement
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("disability") === "YES" && (
                            <FormField
                              control={form.control}
                              name="disabilityDetails"
                              disabled
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Disability Details</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide further information"
                                      disabled
                                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] text-black"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Policies and insurance
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="placementOverseas"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Is your placement overseas, or does it require
                                  international travel?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="YES" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Yes, my placement is overseas or
                                        requires international travel
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="NO" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        No, my placement is not overseas and
                                        does not require international travel
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                      Declaration and signature
                    </AccordionTrigger>
                    <AccordionContent className="p-1 pt-10 pb-10">
                      <div className="flex flex-col space-y-3 pt-10">
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="declarationName"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your full name"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="declarationSignature"
                            disabled
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Signature</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your signature"
                                    disabled
                                    className="text-black"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          </ScrollArea>
        </DialogDescription>

        {/* <DialogFooter></DialogFooter> */}

        <div className="text-left text-lg font-bold">
          <span className="px-1 bg-red-300 mr-2"></span>
          Comments
          <Separator className="my-1" />
        </div>
        <Form {...commentForm}>
          <form
            onSubmit={commentForm.handleSubmit(onSubmitComment)}
            className="space-y-4"
          >
            <FormField
              control={commentForm.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add your review comments here"
                      className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <div className="flex items-center font-normal">
                  <MdOutlineCalendarMonth className="mr-1 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Application created on{" "}
                    {new Date(application.createdAt).toDateString()}
                  </span>
                </div>
                <div className="flex items-center pt-1 font-normal">
                  <MdOutlineEditCalendar className="mr-1 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Application updated on{" "}
                    {new Date(application.updatedAt).toDateString()}
                  </span>
                </div>
              </div>
              <div className="col-span-6">
                {commentForm.watch("comments") && (
                  <div className="text-right">
                    <Button disabled={isLoadingComment} type="submit">
                      {isLoadingComment && (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Hang on! Adding your comments...
                        </>
                      )}
                      {!isLoadingComment && (
                        <>
                          <CheckCircle2Icon className="mr-2 h-4 w-4" />
                          Add comment
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
