"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/registry/new-york/ui/toggle";
import { CheckCircle2Icon } from "lucide-react";

import { App } from "./jobs";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";

export const jobFilterFormSchema = z.object({
  industry: z.string().optional(),
  function: z.string().optional(),
});
type JobFilterFormValues = z.infer<typeof jobFilterFormSchema>;

const defaultValues: Partial<JobFilterFormValues> = {};

export function JobsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [token, setToken] = useState(session?.token);

  const [industryFilter, setIndustryFilter] = useState("");
  const [functionFilter, setFunctionFilter] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filter, setFilter] = useState(false);

  const form = useForm<JobFilterFormValues>({
    resolver: zodResolver(jobFilterFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }

    setToken(session?.token);
  }, []);

  const updateFilter = async (status) => {
    console.log("Filter status::::: ", status);

    let applyFilter =
      industryFilter != "" || functionFilter != "" ? true : false;

    if (status == true && applyFilter == true) {
      let newQuery = "";
      if (industryFilter != "") {
        newQuery = `&industry=${industryFilter}`;
      }
      if (functionFilter != "") {
        newQuery = newQuery + `&function=${functionFilter}`;
      }

      console.log("New query: ", newQuery);

      setFilterQuery(newQuery);
    } else {
      setFilterQuery("");
    }
  };

  const setIndustryFilterFn = async (value) => {
    setIndustryFilter(value);
  };

  const setFunctionFilterFn = async (value) => {
    setFunctionFilter(value);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <div className="flex items-center justify-items-start">
            <span className="text-md font-normal">Filters</span>
            <div className="pl-2">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Job Industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SOFTWARE_DEVELOPMENT">
                          Software Development
                        </SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="CONSULTING">Consulting</SelectItem>
                        <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="GOVERNMENT">Government</SelectItem>
                        <SelectItem value="RETAIL">Retail</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pl-2">
              <FormField
                control={form.control}
                name="function"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Job Function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INFORMATION_TECHNOLOGY">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="ENGINEERING">Engineering</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="CONSULTING">Consulting</SelectItem>
                        <SelectItem value="SALES">Sales</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="BUSINESS_DEVELOPMENT">
                          Business Development
                        </SelectItem>
                        <SelectItem value="ANALYST">Analyst</SelectItem>
                        <SelectItem value="MANUFACTURING">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pl-2">
              {form.getValues().industry}
              {form.getValues().function}
              <Toggle
                aria-label="Toggle filters"
                size="sm"
                disabled={
                  form.getValues().industry == undefined &&
                  form.getValues().function == undefined
                    ? true
                    : false
                }
                // disabled={false}
                defaultPressed={false}
                onPressedChange={(e) => {
                  console.log(e);
                  console.log(filter);
                  console.log(form.getValues().industry);
                  console.log(form.getValues().function);
                  if (e) {
                    console.log("Filtering");
                    console.log(e);
                    console.log(filter);
                    console.log(form.getValues().industry);
                    console.log(form.getValues().function);
                    console.log(
                      form.getValues().industry != undefined ||
                        form.getValues().function != undefined
                        ? true
                        : false
                    );
                    console.log("Filtering------");

                    updateFilter(
                      form.getValues().industry != undefined ||
                        form.getValues().function != undefined
                        ? true
                        : false
                    );
                    setFilter(
                      form.getValues().industry != undefined ||
                        form.getValues().function != undefined
                        ? true
                        : false
                    );
                  } else {
                    updateFilter(false);
                    setFilter(false);
                  }
                }}
                variant={filter == true ? "outline" : "default"}
              >
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                {filter == true ? (
                  <span>Reset Filters</span>
                ) : (
                  <span>Apply Filters</span>
                )}
              </Toggle>
            </div>



            
          </div>
        </form>
      </Form>

      <JobsDisplay token={token} filterQuery={filterQuery} />
    </>
  );
}

export function JobsDisplay(props) {
  return (
    <>
      <App props={props} />
    </>
  );
}
