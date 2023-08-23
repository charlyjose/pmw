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

import { Button } from "@/registry/new-york/ui/button";

import { Textarea } from "@/registry/new-york/ui/textarea";
import { Input } from "@/registry/new-york/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Calendar } from "@/registry/new-york/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";

import { Icons } from "@/components/icons";
import { CheckCircle2Icon } from "lucide-react";
import { CalendarIcon } from "@radix-ui/react-icons";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { DialogDemo } from "./dialog";

import { jobFormSchema } from "./utilities/validation";

type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: Partial<JobFormValues> = {
  location: [{ value: " " }],
};

export function NewJob() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Client side Auth check
    if (
      !session &&
      session?.status !== "authenticated" &&
      session?.user?.role != PAGE_TYPE
    ) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }
  }, []);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "location",
    control: form.control,
  });

  function onSubmit(data: JobFormValues) {
    setIsLoading(true);

    const jobData = {
      role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
      company: data.company.charAt(0).toUpperCase() + data.company.slice(1),
      description: data.description,
      salary: parseInt(data.salary),
      mode: data.mode,
      location: data.location?.flatMap(
        (location) =>
          location.value.trim().charAt(0).toUpperCase() +
          location.value.trim().slice(1)
      ),
      deadline: data.deadline,
      link: data.link,
    };

    const API_URI = "http://localhost:8000";
    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${API_URI}/api/jobs`, jobData, config)
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Your appointment details:";
        const toast_description = (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(jobData, null, 2)}
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
          router.push("/tutor/jobs/new");
        }, 1000);
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Something went wrong!" });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-12 p-2">
            <div className="col-span-10 pr-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Job Role"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2 pt-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A good job description motivates students to apply"
                          className="min-h-[400px] flex-1 p-4 md:min-h-[600px] lg:min-h-[600px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Salary (GBP)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-3">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Mode</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Working Mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="REMOTE">Remote</SelectItem>
                              <SelectItem value="HYBRID">Hybrid</SelectItem>
                              <SelectItem value="OFFICE">Office</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-3">
                  <div>
                    {fields.map((field, index) => (
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`location.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                              Job Location
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => append({ value: "" })}
                    >
                      Add more location?
                    </Button>
                  </div>
                </div>

                <div className="pt-3">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Application Deadline</FormLabel>
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
                              // initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-3">
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Application Link"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-3">
                  <DialogDemo form={form} />
                </div>

                <div className="pt-3">
                  <div className="text-right text-xs font-medium hover:underline">
                    <Button
                      className="w-full"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading && (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Hang on! Adding new job...
                        </>
                      )}
                      {!isLoading && (
                        <>
                          <CheckCircle2Icon className="mr-2 h-4 w-4" />
                          Add job
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
