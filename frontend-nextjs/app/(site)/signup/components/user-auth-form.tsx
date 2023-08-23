"use client";

import * as React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/registry/new-york/ui/button";
import { Icons } from "@/components/icons";

import { toast } from "react-hot-toast";
import { CheckCircle2Icon } from "lucide-react";

import { signupFormSchema } from "../utilities/validation";

type SignupFormValues = z.infer<typeof signupFormSchema>;
const defaultValues: Partial<SignupFormValues> = {};

export function UserAuthForm() {
  const session = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getPageRedirection = (role: string) => {
    if (role === undefined) {
      return "";
    } else {
      return role.toLowerCase();
    }
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      // Page direction based on role
      var pageRedirection = getPageRedirection(session?.data?.user?.role);
      router.push(`/${pageRedirection}`);
    }
  });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("role", data.role);
    formData.append("department", data.department);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const signupData = { ...data };

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    axios
      .post(`${API_URI}/api/auth/signup`, signupData)
      .then((e) => {
        setTimeout(() => {
          setIsLoading(false);
          toast.success("Account created!");
          router.push("/signin");
        }, 1000);
      })
      .catch((e) => {
        toast.error(e.response.data.action_status);
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your user role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="TUTOR">Placement Tutor</SelectItem>
                  <SelectItem value="CSD">Career Services</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your account policies vary based on your role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Only show this component if the role is STUDENT */}
        {form.watch("role") === "STUDENT" && (
          <>
            <FormField
              control={form.control}
              name="studentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your study level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UNDERGRADUATE">
                        Under Graduate
                      </SelectItem>
                      <SelectItem value="POSTGRADUATE">
                        Post Graduate
                      </SelectItem>
                      <SelectItem value="PHD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    We use this information to tag you into correct study level
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ON_PLACEMENT">On Placement</SelectItem>
                      <SelectItem value="NOT_ON_PLACEMENT">
                        Not on Placement
                      </SelectItem>
                      <SelectItem value="GRADUATED">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    We use this information to assist you with your placement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your working department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SCMS">
                    School of Computing and Mathematical Sciences
                  </SelectItem>
                  <SelectItem value="ME">Mechanical Engineering</SelectItem>
                  <SelectItem value="AE">Aeronautical Engineering</SelectItem>
                  <SelectItem value="CSD">Career Services</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                We use this info to tag your account to the correct department
              </FormDescription>
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
                <Input placeholder="example@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormDescription>
                Choose a strong password for your account safety
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading && (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Hang on! We are setting up your account...
            </>
          )}
          {!isLoading && (
            <>
              <CheckCircle2Icon className="mr-2 h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
