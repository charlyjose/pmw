"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import { Calendar } from "@/registry/new-york/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/new-york/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Input } from "@/registry/new-york/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/icons";
import { CheckCircle2Icon } from "lucide-react";

import { placementFormSchema } from "./utilities/validation";

import { LocationSearch } from "./location-search/page";

type PlacementFormValues = z.infer<typeof placementFormSchema>;

const defaultValues: Partial<PlacementFormValues> = {};

import axios from "axios";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function PlacementApplication() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const form = useForm<PlacementFormValues>({
    resolver: zodResolver(placementFormSchema),
    defaultValues,
  });

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    const API_URI = "http://localhost:8000";
    axios
      .get(`${API_URI}/api/student/placement/applications`)
      .then((e) => {
        if (e.data != null) {
          try {
            form.setValue("firstName", e.data.first_name);
            form.setValue("lastName", e.data.last_name);
            if (e.data.dob != "") {
              form.setValue("dob", new Date(e.data.dob));
            }
            form.setValue("email", e.data.email);
          } catch {}
        }

        toast({
          description: "Successfully fetched your form content",
        });
      })
      .catch(() => toast({ title: "Something went wrong!" }));
  }, []);

  function onSubmit(data: PlacementFormValues) {
    setIsLoading(true);

    const declaratationDate = new Date();

    const placementApplicationData = {
      ...data,
      organisationLocationGoogleMapsAddress,
      organisationLocationGoogleMapsLat,
      organisationLocationGoogleMapsLng,
      declaratationDate,
    };
    console.log("placementApplicationData");
    console.log(placementApplicationData);

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
        `${API_URI}/api/student/placement/application`,
        placementApplicationData,
        config
      )
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Placement Application";
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
      .catch(() => {
        toast({ variant: "destructive", title: "Something went wrong!" });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <span className="text-sm font-normal">
                This form is to be completed by a University of Leicester
                student to notify the University of Leicester about a placement
                offer. By submitting this form, you request authorisation to
                have the role form part of your degree programme. We will use
                this form to assess the placement role you have been offered.
              </span>

              <span className="text-sm font-normal">
                <h3 className="text-md font-bold">
                  Your Responsibilities as a Placement Student
                </h3>
                <p>
                  By submitting this form, you confirm that you will meet the
                  following requirements for your placement:
                </p>
                <ol className="text-xs p-2">
                  <li>
                    a. Act professionally and responsibly, both in your studies
                    and on placement, as well as, if required, during your
                    meeting probation periods. You must conduct yourselves
                    accordingly with due regard to the University Senate
                    Regulations, the Placement Provider, and the laws and
                    conventions of the country in which you are undertaking your
                    placement.
                  </li>

                  <li>
                    b. Adhere to attendance requirements and working hours
                    stipulated by the University and on your visa. This involves
                    not working more than the hours stated, either inside or
                    outside of the University.
                  </li>
                  <li>
                    c. If your placement is overseas, or involves international
                    travel, you must register for insurance under the Group
                    Personal Accident and Travel Policy arranged by the
                    University. To register, please complete the{" "}
                    <a
                      className="underline font-medium hover:text-lime-600 text-green-500"
                      href="https://forms.office.com/Pages/ResponsePage.aspx?id=as2-rtQxAUuVzoJ0r-hT2dbkum5nWktEn2CGcNqqMaJUMTRUM0dNNVZFRUIzTkdCQVhNUzJWWjk3TC4u"
                    >
                      Student Travel Insurance Request.
                    </a>
                  </li>
                  <li>
                    d. Inform the University if you have any queries or concerns
                    about your placement or Placement Provider.
                  </li>
                  <li>
                    e. Update the University immediately if any of your
                    placement details change.
                  </li>
                  <li>
                    f. Make contact with the University and the Placement
                    Provider if you require special adjustments to be made in
                    order to undertake the placement
                  </li>
                  <li>
                    g. Notify the University if you are absent from your
                    placement for more than 5 days in a row.
                  </li>
                  <li>
                    h. Check your university email account regularly for
                    communications from the University.
                  </li>
                  <li>
                    i. Complete any tasks and assessment throughout the duration
                    of the placement within the deadlines specified.
                  </li>
                </ol>
              </span>

              <span className="text-sm font-normal">
                <h3 className="text-md font-bold">
                  Getting your placement authorised
                </h3>
                <p>
                  Once you submit this form, the University will ask your
                  Placement Provider to provide further information, and assess
                  your placement. The majority of placements are approved.
                  However, common reasons that a placement might be rejected
                  include:{" "}
                </p>
                <ol className="text-xs p-2">
                  <li>
                    1. The Placement is unpaid and does not offer a high quality
                    work experience.
                  </li>
                  <li>
                    2. The Placement involves a high level of risk. As part of
                    this, we take into account whether an employer has insurance
                    to cover you for accidents.
                  </li>
                  <li>
                    3. The Placement Provider seems illegitimate, or is
                    operating illegally.
                  </li>
                  <li>
                    4. The Placement does not guarantee a high quality learning
                    experience. When we consider this, we will look at the role
                    description, the placement provider, and how much remote
                    working is planned on placement.
                  </li>
                </ol>
              </span>
            </div>
          </div>
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your student number"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email address"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Telephone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your contact number"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Programme of Study</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your programme of study"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/Department</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your school/department"
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
                          <FormLabel>Do you have a student visa?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of Organisation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your placement provider name"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Address where the placement will be based
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your placement provider address"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your placement provider postcode"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Web Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your placement provider web address"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your contact at the placement provider"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Title of your contact at the placement provider"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email of your contact at the placement provider"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Telephone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contact telephone number of your contact at the placement provider"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Your role title" {...field} />
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
                          <FormLabel>
                            <span className="grid grid-cols-1 gap-4">
                              Role Start Date{" "}
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              <ol className="text-xs">
                                <li>
                                  i. Indicate the proposed start date or month
                                  of your placement
                                </li>
                                <li>
                                  ii. This information can be updated nearer the
                                  time when you have an exact date
                                </li>
                              </ol>
                            </p>
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
                                  // Disable dates in the past
                                  date < new Date()
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-bold italic">
                              Please Note:
                              <ol className="text-xs font-normal">
                                <li>
                                  1. Your start date MUST be at least 10 working
                                  days AFTER the date you submit this form to
                                  allow the university time to process your
                                  placement authorisation request
                                </li>
                                <li>
                                  2. You must not start your placement until
                                  your placement has been approved by the
                                  university
                                </li>
                              </ol>
                            </p>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roleEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="pb-2">Role End Date</FormLabel>
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
                          {/* <FormDescription>
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Working hours per week</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Working hours per week"
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
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, the role includes a probation period
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No, the role does not include a probation
                                  period
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            What is your salary (annual) for the placement?
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Annual salary"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you source this role?</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Job board, LinkedIn, etc."
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
                            Have you informed the Placement Provider that this
                            placement forms part of your degree programme?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, I have informed the Placement Provider
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No. If No, please inform the Placement
                                  Provider before proceeding with this form.
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="grid grid-cols-1 gap-4">
                              Please provide a role description of your
                              placement. Alternatively, please attach a role
                              description to your email submitting this form.{" "}
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              If you do not have this, please contact the
                              Placement Provider to receive a Role Description
                              before submitting this form.{" "}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide further information"
                              className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Only show this component if probationPeriod is YES */}
                {form.watch("probationPeriod") === "YES" && (
                  <div className="flex flex-col space-y-3 pt-10">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="probationPeriodDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="grid grid-cols-1 gap-4">
                                Probation Period Details{" "}
                              </span>
                              <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                                Please confirm length of your probation period
                                below{" "}
                              </p>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                            Does this role involve working from home/remotely?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                                  No, this role does not involve working from
                                  home/remotely
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
                    <p className="pt-5 text-sm font-normal italic">
                      If yes, please answer following questions.{" "}
                    </p>
                    <div className="flex flex-col space-y-3 pt-10">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="remoteWorkingOverview"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Please provide an overview of how you will work
                                remotely. This should include how often you will
                                work remotely each week.
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide further information"
                                  className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Why does this role involve working from home?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide further information"
                                  className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              How will you travel to and from the placement?{" "}
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              If you do not know this, please put what you are
                              planning to do.{" "}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                                  Public transport (bus, train, taxi, etc.)
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

                    {/* Only show this component if the travelMethod is OTHER */}
                    {form.watch("travelMethod") === "OTHER" && (
                      <FormField
                        control={form.control}
                        name="travelMethodDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other travel methods</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                            different to the Placement Provider's address that
                            you have given in section 2?{" "}
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, this role involves working at a location
                                  different location other than given in section
                                  2
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No, this role does not involve working at a
                                  location different other than location given
                                  in section 2
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Only show this component if the travelDifferentLocation is YES */}
                    {form.watch("travelDifferentLocation") === "YES" && (
                      <FormField
                        control={form.control}
                        name="travelDifferentLocationDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Details of the different location
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              Are you aware of any risks at the organisation's
                              main location?{" "}
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              For example, this might include civil disorder,
                              crime, environmental disasters, infectious disease
                              or poor healthcare access.{" "}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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

                    {/* Only show this component if the locationRisks is YES */}
                    {form.watch("locationRisks") === "YES" && (
                      <FormField
                        control={form.control}
                        name="locationRisksDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Risks Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              What are your accommodation arrangements when on
                              placement?{" "}
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              If you do not know this, please put what you are
                              planning to do.{" "}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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

                    {/* Only show this component if the accommodationArrangements is OTHER */}
                    {form.watch("accommodationArrangements") === "OTHER" && (
                      <FormField
                        control={form.control}
                        name="accommodationArrangementsDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Accommodation Arrangements Details
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              Are you aware of any precautionary measures you
                              are required to undertake before, during, or after
                              the placement?
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              <span className="font-bold">For example:</span>
                              Vaccinations, PPE, medical or dietary advice,
                              living arrangements.{" "}
                            </p>
                          </FormLabel>

                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, I am aware of any precautionary measures
                                  to undertake
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

                    {/* Only show this component if the precautionaryMeasures is YES */}
                    {form.watch("precautionaryMeasures") === "YES" && (
                      <FormField
                        control={form.control}
                        name="precautionaryMeasuresDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Precautionary Measures Details
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              Do you have any health conditions that may require
                              adjustments on your placement?
                            </span>
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              <span className="font-bold">Please note:</span>
                              This information will remain confidential and will
                              not be shared with the Placement Provider. We will
                              support you to consider your options.{" "}
                            </p>
                          </FormLabel>

                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, I have health conditions that may require
                                  adjustments on my placement
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No, I do not have health conditions that may
                                  require adjustments on my placement
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Only show this component if the healthConditions is YES */}
                    {form.watch("healthConditions") === "YES" && (
                      <FormField
                        control={form.control}
                        name="healthConditionsDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Health Conditions Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                            <p className="grid grid-cols-1 pt-2 pb-2 text-xs font-normal italic">
                              <span className="font-bold">Please note:</span>
                              This information will remain confidential and will
                              not be shared with the Placement Provider. We will
                              work with you to consider your options.{" "}
                            </p>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, I have health conditions that may require
                                  adjustments on my placement
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No, I do not have health conditions that may
                                  require adjustments on my placement
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Only show this component if the disability is YES */}
                    {form.watch("disability") === "YES" && (
                      <FormField
                        control={form.control}
                        name="disabilityDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disability Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide further information"
                                className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
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
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="YES" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes, my placement is overseas or requires
                                  international travel
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="NO" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No, my placement is not overseas and does not
                                  require international travel
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Only show this component if the placementOverses is YES */}
                    {form.watch("placementOverseas") === "YES" && (
                      <p className="text-sm font-normal italic">
                        If Yes, please complete your{" "}
                        <a
                          className="underline text-sm hover:text-lime-600 text-green-500"
                          href="https://forms.office.com/Pages/ResponsePage.aspx?id=as2-rtQxAUuVzoJ0r-hT2dbkum5nWktEn2CGcNqqMaJUMTRUM0dNNVZFRUIzTkdCQVhNUzJWWjk3TC4u"
                        >
                          Student Travel Insurance Request
                        </a>{" "}
                        before proceeding with this form.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-xl font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                Declaration and signature
              </AccordionTrigger>
              <AccordionContent className="p-1 pt-10 pb-10">
                <div className="flex flex-col space-y-3">
                  <div className="grid grid-cols-1 gap-4">
                    <span className="text-sm font-normal italic">
                      Please remember you are representing the University of
                      Leicester while you are on a placement. By completing this
                      form you accept the conditions and requirements listed in
                      the Responsibilities of Students on page one of this
                      document. You also confirm all the information provided in
                      this form is factually correct at the time of submitting.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-10">
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="declarationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="declarationSignature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input placeholder="Your signature" {...field} />
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

          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <span className="text-sm font-normal">
                Please return this completed form to the relevant department
                within the University. Note that authorisation request can take
                between 10-15 working days once this form has been received by
                the University. Please allow at least 10 working days before
                checking on the progress of your Placement authorisation
                request.
              </span>
            </div>
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Hang on! We submitting your application...
              </>
            )}
            {!isLoading && (
              <>
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                Submit application
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      //   componentRestrictions: {
      //     country: "uk",
      //   },
    },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <CommandItem>
          <span
            key={place_id}
            onClick={() => {
              setValue(description, false);
              clearSuggestions();
              onAddressSelect && onAddressSelect(description);
            }}
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </span>
        </CommandItem>
      );
    });
  };

  return (
    <>
      <div>
        <Input
          value={value}
          disabled={!ready}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search Google Maps"
        />
      </div>
      <Command className="rounded-lg shadow-md">
        {status === "OK" && (
          <ScrollArea className="h-36 rounded-md border">
            <CommandList>
              <CommandGroup heading="Suggestions">
                {renderSuggestions()}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        )}
      </Command>
    </>
  );
};
