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
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("role", data.role);
    formData.append("department", data.department);
    formData.append("email", data.email);
    formData.append("password", data.password);

    // console.log(formData);

    // const API_URI = "http://localhost:8000";
    axios
      .post(`/api/register`, data)
      .then((e) => {
        setTimeout(() => {
          setIsLoading(false);
          toast.success("Account created!");
          router.push("/signin");
        }, 3000);
      })
      .catch((e) => {
        console.log(e.response.data);
        toast.error(e.response.data.message);
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="first_name"
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
              name="last_name"
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
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tutor">Placement Tutor</SelectItem>
                  <SelectItem value="csd">Career Services</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your account policies vary based on your role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="scms">
                    School of Computing and Mathematical Sciences
                  </SelectItem>
                  <SelectItem value="me">Mechanical Engineering</SelectItem>
                  <SelectItem value="ae">Aeronautical Engineering</SelectItem>
                  <SelectItem value="csd">Career Services</SelectItem>
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
