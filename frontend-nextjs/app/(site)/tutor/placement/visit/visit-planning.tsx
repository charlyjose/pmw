"use client";

const PAGE_TYPE = "TUTOR";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/registry/new-york/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

import { Dialog } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/registry/new-york/ui/alert-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card";

import { LuClipboardList, LuMap } from "react-icons/lu";

import { Icons } from "@/components/icons";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { CalendarX2 } from "lucide-react";
import {
  Flag,
  MoreHorizontal,
  Trash,
  CalendarOffIcon,
  CalendarCheckIcon,
  CalendarCheck2Icon,
} from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import { LocationSearch } from "./location-search/page";

export const visitScheduleFormSchema = z.object({
  region: z.string({
    required_error: "Region is required",
  }),

  locations: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type VisitScheduleFormValues = z.infer<typeof visitScheduleFormSchema>;

const defaultValues: Partial<VisitScheduleFormValues> = {
  locations: [""],
};

export function VisitPlanning() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [axiosConfig, setAxiosConfig] = useState({});
  const [markers, setMarkers] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [viewMapButton, setViewMapButton] = useState(false);
  const [viewMap, setViewMap] = useState(false);

  const form = useForm<VisitScheduleFormValues>({
    resolver: zodResolver(visitScheduleFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function setUpMarkers() {
    // Filter the regionData based on the selected locations
    let filteredRegionData = regionData.filter((item) => {
      return form.getValues("locations").includes(item.id);
    });

    console.log("filteredRegionData: ", filteredRegionData);

    // Set the markers
    setMarkers(filteredRegionData);
  }

  useEffect(() => {
    // // Client side Auth check
    // if (
    //   !session &&
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

    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
    };
    setAxiosConfig(config);
  }, []);

  const fetchRegionData = async (region: string) => {
    console.log("region: ", region);

    // Reset form values
    form.setValue("locations", [""]);

    // Reset markers
    setMarkers([]);

    // Reset view map button
    setViewMapButton(false);

    // Reset view map
    setViewMap(false);

    // Reset region data
    setRegionData([]);

    var toast_variant = "default";
    var toast_title = "Geo Locations";
    var toast_description = "";

    const API_URI = "http://localhost:8000";
    await axios
      .get(
        `${API_URI}/api/tutor/placement/visit/region?region=${region.toUpperCase()}`,
        axiosConfig
      )
      .then((e) => {
        let placements = e.data.data.placements;
        if (placements?.length > 0) {
          console.log("placements: ", placements);
          setMarkers(placements);

          setRegionData(placements);
          let ids = placements.map((placement) => placement.id);
          form.setValue("locations", ids);
          setViewMapButton(true);

          toast_variant = "default";
          toast_description = "Successfully fetched the locations";
        } else {
          toast_variant = "destructive";
          toast_description = "No locations found";
        }
        toast({
          variant: toast_variant,
          title: toast_title,
          description: toast_description,
        });
      })
      .catch((e) => {
        toast_variant = "destructive";
        toast_description = "Error fetching locations";
        toast({
          variant: toast_variant,
          title: toast_title,
          description: toast_description,
        });
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="grid gap-4 grid-cols-12 md:grid-cols-2 lg:grid-cols-12">
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="px-1 bg-red-300 mr-2 "></span>
              Planning
              <Separator className="my-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Form {...form}>
              <form className="space-y-8">
                <div className="space-y-2">
                  <div className="w-[300px]">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select
                            onValueChange={
                              // Fetch the data for the selected region
                              (value) => {
                                field.onChange(value);
                                fetchRegionData(value);
                              }
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>UK Regions</SelectLabel>
                                <SelectItem value="LONDON">London</SelectItem>
                                <SelectItem value="SE">South East</SelectItem>
                                <SelectItem value="SW">South West</SelectItem>
                                <SelectItem value="WALES">Wales</SelectItem>
                                <SelectItem value="EM">
                                  East Midlands
                                </SelectItem>
                                <SelectItem value="WM">
                                  West Midlands
                                </SelectItem>
                                <SelectItem value="NE">North East</SelectItem>
                                <SelectItem value="NW">North West</SelectItem>
                                <SelectItem value="YH">
                                  Yorkshire & Humber
                                </SelectItem>
                                <SelectItem value="NI">
                                  Northern Ireland
                                </SelectItem>
                                <SelectItem value="SCOTLAND">
                                  Scotland
                                </SelectItem>
                                <SelectLabel>Other</SelectLabel>
                                <SelectItem value="INTERNATIONAL">
                                  International
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-3">
                    {form.watch("region") && regionData.length != 0 ? (
                      <ScrollArea className="rounded-md h-[500px]">
                        <div className="p-0">
                          <FormField
                            control={form.control}
                            name="locations"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base">
                                    Locations
                                  </FormLabel>
                                  <FormDescription>
                                    Select the locations you want to visit
                                  </FormDescription>
                                  <Separator className="my-2" />
                                </div>
                                {regionData.map((placement) => (
                                  <div className="transition-all hover:bg-accent hover:text-accent-foreground pt-2 p-0">
                                    <FormField
                                      key={placement.id}
                                      control={form.control}
                                      name="locations"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={placement.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(
                                                  placement.id
                                                )}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([
                                                        ...field.value,
                                                        placement.id,
                                                      ])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) =>
                                                            value !==
                                                            placement.id
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal hover:underline grid gap-4 grid-cols-12">
                                              <div className="col-span-6">
                                                <span className="text-md">
                                                  {placement.firstName}{" "}
                                                  {placement.lastName}
                                                </span>
                                              </div>

                                              <div className="col-span-2"></div>

                                              <div className="col-span-4 text-right">
                                                <span className="ml-1 text-md font-bold">
                                                  <Badge
                                                    className="mr-1"
                                                    variant="secondary"
                                                  >
                                                    started{" "}
                                                    {moment(
                                                      placement.startDate,
                                                      "YYYYMMDD"
                                                    ).fromNow()}
                                                  </Badge>
                                                </span>
                                              </div>
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                    <Separator className="my-2" />
                                  </div>
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </ScrollArea>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                {viewMapButton && form.watch("locations")?.length > 0 ? (
                  <div className="grid grid-cols-2">
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          setUpMarkers();
                          setViewMap(true);
                        }}
                      >
                        <LuClipboardList className="mr-2" />
                        Prepare itenary
                      </Button>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setUpMarkers();
                          setViewMap(true);
                        }}
                      >
                        <LuMap className="mr-2" />
                        View on map
                      </Button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-8">
        {viewMap ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="px-1 bg-red-300 mr-2 "></span>
                Maps
                <Separator className="my-2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              {viewMap ? <LocationSearch markers={markers} /> : <></>}
            </CardContent>
          </Card>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
