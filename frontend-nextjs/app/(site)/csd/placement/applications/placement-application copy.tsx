// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { cn } from "@/lib/utils";
// import { Button } from "@/registry/new-york/ui/button";
// import { Calendar } from "@/registry/new-york/ui/calendar";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/registry/new-york/ui/command";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/registry/new-york/ui/form";
// import { Input } from "@/registry/new-york/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/registry/new-york/ui/popover";
// import { toast } from "@/registry/new-york/ui/use-toast";

// const languages = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ] as const;

// const accountFormSchema = z.object({
//   first_name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
//   last_name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
//   dob: z.date({
//     required_error: "A date of birth is required.",
//   }),
//   email: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
//   // language: z.string({
//   //   required_error: "Please select a language.",
//   // }),
// });

// type AccountFormValues = z.infer<typeof accountFormSchema>;

// // This can come from your database or API.
// const defaultValues: Partial<AccountFormValues> = {
//   // name: "Your name",
//   // dob: new Date("2023-01-23"),
// };

// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// export function PlacementApplication() {
//   const router = useRouter();

//   const form = useForm<AccountFormValues>({
//     // resolver: zodResolver(accountFormSchema),
//     defaultValues,
//   });

//   useEffect(() => {
//     const API_URI = "http://localhost:8000";
//     axios
//       .get(`${API_URI}/api/csd/placement/applications`)
//       .then((e) => {
//         console.log("BACK from ", e.data);

//         form.setValue("first_name", e.data.first_name)
//         form.setValue("last_name", e.data.last_name)
//         form.setValue("dob", new Date(e.data.dob))
//         form.setValue("email", e.data.email)

//         toast({
//           title: "SUCCESS",
//           // description: ""
//         });
//       })
//       .catch(() => toast({ title: "Something went wrong!" }));
//     //
//   }, []);

//   function onSubmit(data: AccountFormValues) {
//     console.log(data);

//     // SUBMISSION
//     const formData = new FormData();
//     formData.append("first_name", data.first_name);
//     formData.append("last_name", data.last_name);
//     formData.append("dob", data.dob.toDateString());
//     formData.append("email", data.email);
//     console.log(formData);

//     const API_URI = "http://localhost:8000";
//     axios
//       .post(`${API_URI}/api/csd/placement/applications/new`, formData)
//       .then((e) => {
//         console.log("BACK from ", e.data)
//         toast({
//           title: "SUCCESS",
//           // description: ""
//         });
//         router.push("/csd");
//       })
//       .catch(() => toast({ title: "Something went wrong!" }));
//     //

//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="first_name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>First Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is the name that will be displayed on your profile and in
//                 emails.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="last_name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Last Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is the name that will be displayed on your profile and in
//                 emails.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is the name that will be displayed on your profile and in
//                 emails.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         /> */}

//         <FormField
//           control={form.control}
//           name="dob"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Date of birth</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant={"outline"}
//                       className={cn(
//                         "w-[240px] pl-3 text-left font-normal",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {field.value ? (
//                         format(field.value, "PPP")
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={field.value}
//                     onSelect={field.onChange}
//                     disabled={(date) =>
//                       date > new Date() || date < new Date("1900-01-01")
//                     }
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//               <FormDescription>
//                 Your date of birth is used to calculate your age.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is the name that will be displayed on your profile and in
//                 emails.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* SELECT TOOL */}
//         {/* <FormField
//           control={form.control}
//           name="language"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Language</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       className={cn(
//                         "w-[200px] justify-between",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {field.value
//                         ? languages.find(
//                             (language) => language.value === field.value
//                           )?.label
//                         : "Select language"}
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[200px] p-0">
//                   <Command>
//                     <CommandInput placeholder="Search language..." />
//                     <CommandEmpty>No language found.</CommandEmpty>
//                     <CommandGroup>
//                       {languages.map((language) => (
//                         <CommandItem
//                           value={language.value}
//                           key={language.value}
//                           onSelect={(value) => {
//                             form.setValue("language", value);
//                           }}
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4",
//                               language.value === field.value
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             )}
//                           />
//                           {language.label}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               <FormDescription>
//                 This is the language that will be used in the dashboard.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         /> */}

//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// }

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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

import LocationSearch from "./location-search/page";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const accountFormSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  email: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  // language: z.string({
  //   required_error: "Please select a language.",
  // }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

import axios from "axios";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function PlacementApplication() {
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<AccountFormValues>({
    // resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  useEffect(() => {
    // Validating client-side session
    if (!session) {
      router.push("/signin");
    }

    const API_URI = "http://localhost:8000";
    axios
      .get(`${API_URI}/api/csd/placement/applications`)
      .then((e) => {
        console.log("BACK from ", e.data);

        if (e.data != null) {
          try {
            form.setValue("first_name", e.data.first_name);
            form.setValue("last_name", e.data.last_name);
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

  function onSubmit(data: AccountFormValues) {
    console.log(data);

    // SUBMISSION
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("dob", data.dob.toDateString());
    formData.append("email", data.email);
    console.log(formData);

    const API_URI = "http://localhost:8000";
    axios
      .post(`${API_URI}/api/csd/placement/applications/new`, formData)
      .then((e) => {
        console.log("BACK from ", e.data);
        toast({
          title: "SUCCESS",
          // description: ""
        });
        router.push("/csd");
      })
      .catch(() => toast({ title: "Something went wrong!" }));
    //

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
      {/* 
      <section>
        <h1 className="text-2xl font-bold">
          This is a <span className="text-emerald-500">client-side</span>{" "}
          protected page
        </h1>
        <h2>You are logged in as:</h2>
        <p>NAME: {session?.user?.name}</p>
        <p>EMAIL: {session?.user?.email}</p>
        <p>ROLE: {session.user?.role}</p>
      </section>
 */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
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
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
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
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <LocationSearch />

          {/* SELECT TOOL */}
          {/* <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.value}
                          key={language.value}
                          onSelect={(value) => {
                            form.setValue("language", value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
