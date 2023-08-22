"use client";

import { useState } from "react";

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

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

export function JobFilter(props: any) {
  const [filter, setFilter] = useState(false);

  const form = useForm<JobFilterFormValues>({
    resolver: zodResolver(jobFilterFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const updateFilter = async (status) => {
    console.log("Filter status::::: ", status);

    let industryFilter = form.getValues().industry;
    let functionFilter = form.getValues().function;

    let applyFilter =
      industryFilter != undefined || functionFilter != undefined ? true : false;

    if (status == true && applyFilter == true) {
      let newQuery = "";
      if (industryFilter != undefined) {
        newQuery = `&industry=${industryFilter}`;
      }
      if (functionFilter != undefined) {
        newQuery = newQuery + `&function=${functionFilter}`;
      }

      console.log("New query: ", newQuery);

      props.filterQuery(newQuery);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <div className="flex items-center justify-items-start">
            <div className="pl-1">
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
                        <SelectTrigger className="w-[250px]">
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
                        <SelectTrigger className="w-[250px]">
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
              <Toggle
                aria-label="Toggle filters"
                size="sm"
                disabled={
                  form.getValues().industry == undefined &&
                  form.getValues().function == undefined
                    ? true
                    : false
                }
                defaultPressed={false}
                onPressedChange={(e) => {
                  if (e) {
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
    </>
  );
}
