"use client";

const PAGE_TYPE = "CSD";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

import { Button } from "@/registry/new-york/ui/button";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Icons } from "@/components/icons";
import { Input } from "@/registry/new-york/ui/input";

import { Divider } from "antd";

import { SiMicrosoftteams } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";

export const meetingFormSchema = z.object({
  message: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  recipientEmailId: z.string().email().optional(),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

const defaultValues: Partial<MeetingFormValues> = {
  message: "",
  emailSubject: "",
  emailBody: "",
  recipientEmailId: "",
};

export function Communications() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [MSTeamsisLoading, setMSTeamsIsLoading] = useState(false);
  const [MailClientisLoading, setMailClientIsLoading] = useState(false);

  useEffect(() => {
    // Client side Auth check
    // if (!session &&
    //   session?.status !== "authenticated" &&
    //   session?.user?.role != PAGE_TYPE
    // ) {
    //   router.push(UNAUTHORISED_REDIRECTION_LINK);
    // }

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

  return (
    <>
      <Form {...form}>
        <form
          // Do nothing on submit
          onSubmit={form.handleSubmit(() => {})}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="recipientEmailId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email Id"
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here..."
                    className="min-h-[50px] flex-1 md:min-h-[100px] lg:min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right text-xs font-medium hover:underline">
            <Button
              disabled={MSTeamsisLoading}
              onClick={() => {
                setMSTeamsIsLoading(true);
                setTimeout(() => {
                  setMSTeamsIsLoading(false);
                }, 2000);

                // Open MS Teams in a new tab with a pre-filled message from the form field above (message)
                window.open(
                  `https://teams.microsoft.com/l/chat/0/0?users=${form.getValues(
                    "recipientEmailId"
                  )}&message=${form.getValues("message")}`,
                  "_blank"
                );
              }}
            >
              {MSTeamsisLoading && (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Hang on! Opening MS Teams
                </>
              )}
              {!MSTeamsisLoading && (
                <>
                  <SiMicrosoftteams className="mr-2 h-4 w-4" />
                  Send message on MS Teams
                </>
              )}
            </Button>
          </div>

          <Divider plain>Or Email</Divider>

          <FormField
            control={form.control}
            name="emailSubject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Email subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailBody"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your email here..."
                    className="min-h-[50px] flex-1 p-4 md:min-h-[100px] lg:min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right text-xs font-medium hover:underline">
            <Button
              disabled={MailClientisLoading}
              onClick={() => {
                setMailClientIsLoading(true);
                setTimeout(() => {
                  setMailClientIsLoading(false);
                }, 2000);

                // Open Mail Client in a new tab with a pre-filled message from the form field above (emailBody)
                window.open(
                  `mailto:${form.getValues(
                    "recipientEmailId"
                  )}?subject=${form.getValues(
                    "emailSubject"
                  )}&body=${form.getValues("emailBody")}`,
                  "_blank"
                );
              }}
            >
              {MailClientisLoading && (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Hang on! Opening Email Client
                </>
              )}
              {!MailClientisLoading && (
                <>
                  <MdOutlineMail className="mr-2 h-4 w-4" />
                  Send email
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
