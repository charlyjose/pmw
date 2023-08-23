import { useState } from "react";
import Link from "next/link";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/registry/new-york/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";

import { RocketIcon } from "@radix-ui/react-icons";
import { LuClipboardList, LuMap } from "react-icons/lu";
import { Icons } from "@/components/icons";
import { Calendar } from "@/registry/new-york/ui/calendar";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LocationSearch } from "./location-search/search";

export const visitScheduleFormSchema = z.object({
  date: z
    .date({
      required_error: "Visit date is required",
    })
    .refine(
      (data) => {
        const today = new Date();
        const selectedDate = new Date(data);
        return selectedDate >= today;
      },
      {
        message: "Visit date must be in the future",
      }
    ),
});

type VisitScheduleFormValues = z.infer<typeof visitScheduleFormSchema>;

const defaultValues: Partial<VisitScheduleFormValues> = {};

export function RoutePlanDialog({ locations, axiosConfig }) {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(52.620674);
  const [longitude, setLongitude] = useState(-1.125511);

  const [routePlan, setRoutePlan] = useState([]);
  const [routePlanSuggestion, setRoutePlanSuggestion] = useState([]);
  const [loadRoutePlan, setLoadRoutePlan] = useState(false);
  const [routePlanIsLoading, setRoutePlanIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [selectedRoutePlan, setSelectedRoutePlan] = useState(null);

  const form = useForm<VisitScheduleFormValues>({
    resolver: zodResolver(visitScheduleFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const create_visit = async (date) => {
    const visitData = {
      visit_date: date,
      route_plan: selectedRoutePlan,
    };

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    await axios
      .post(
        `${API_URI}/api/tutor/placement/visit/route-plan/confirm`,
        visitData,
        axiosConfig
      )
      .then((e) => {
        toast({
          title: "Placement Visit",
          description: `Visit scheduled on ${new Date(
            form.getValues().date
          ).toDateString()}`,
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

  const get_route_plan = async (unit: string) => {
    setRoutePlanIsLoading(true);

    // Reset the route plans
    setRoutePlan([]);
    setRoutePlanSuggestion([]);


    const start_location = {
      address: address,
      coordinate: {
        longitude: longitude,
        latitude: latitude,
      },
    };

    const routeData = {
      placement_ids: locations,
      start_location: start_location,
    };

    var toast_variant = "default";
    var toast_title = "Route Plan";
    var toast_description = "";

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    await axios
      .post(
        `${API_URI}/api/tutor/placement/visit/route-plan?unit=${unit}`,
        routeData,
        axiosConfig
      )
      .then((e) => {
        let data = e.data.data.route_plan;
        let route_plan = data.route_plan;
        let route_plan_suggestion = data.route_plan_suggestion;

        // Check if the route plan object is not NULL
        if (data != null) {
          // Check if the route plan is not NULL
          if (route_plan != null) {
            setRoutePlan(route_plan);
            setLoadRoutePlan(true);

            toast_variant = "default";
            toast_description = "Successfully fetched route plan";
          }
          if (route_plan_suggestion != null) {
            setRoutePlanSuggestion(route_plan_suggestion);
          }
        } else {
          toast_variant = "destructive";
          toast_description = "Could not fetch route plan";
        }

        toast({
          variant: toast_variant,
          title: toast_title,
          description: toast_description,
        });
      })
      .catch((e) => {
        toast_variant = "destructive";
        toast_description = "Error fetching route plan";
        toast({
          variant: toast_variant,
          title: toast_title,
          description: toast_description,
        });
      });

    setTimeout(() => {
      setRoutePlanIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LuClipboardList className="mr-2" />
          Prepare itinerary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            <div className="pt-1">Route Planning</div>
            <div className="pt-2 text-md font-light">
              {locations.length} location(s) selected
            </div>
          </DialogTitle>

          <DialogDescription className="pt-5">
            <ScrollArea className="rounded-md h-[610px]">
              <LocationSearch
                address={setAddress}
                latitude={setLatitude}
                longitude={setLongitude}
                searchAddress={address}
                searchLat={latitude}
                searchLng={longitude}
                required
              />

              <div className="pt-3 pr-2 text-right text-xs font-medium hover:underline">
                <Button
                  disabled={address == "" ? true : false}
                  onClick={(e) => {
                    e.preventDefault();
                    get_route_plan("MILE");
                  }}
                >
                  <LuClipboardList className="mr-2" />
                  Fetch route plan
                </Button>
              </div>

              {routePlanIsLoading ? (
                <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed mt-4">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Icons.spinner className="mr-2 w-20 h-20 text-red-600 animate-spin" />
                    <h3 className="mt-4 text-lg font-semibold">
                      Fetching your visit plan
                    </h3>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {loadRoutePlan && !routePlanIsLoading ? (
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="text-left text-lg font-bold">
                    <span className="px-1 bg-red-300 mr-2 "></span>
                    Route Plans
                    <Separator className="my-1" />
                    <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
                      <div className="grid gap-1 transition-all hover:text-accent-foreground">
                        <span className="text-md font-bold">
                          Selected Route Plan
                          <span className="ml-3 text-sm font-medium">
                            (Total Distance:{" "}
                            {routePlan.total_distance.toFixed(2)}{" "}
                            {routePlan.unit.charAt(0).toUpperCase() +
                              routePlan.unit.slice(1).toLowerCase() +
                              "s"}
                            )
                          </span>
                        </span>

                        {routePlan.cities.map((location) => (
                          <div className="grid gap-1">
                            <span className="text-sm font-medium">
                              {location.address}
                            </span>
                            {/* <span className="text-xs font-light">
                              ({location.coordinate.latitude},{" "}
                              {location.coordinate.longitude})
                            </span> */}
                          </div>
                        ))}

                        <div className="pt-2 text-left text-xs font-medium hover:underline">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedRoutePlan(routePlan);
                              setShowAlert(true);
                            }}
                          >
                            <LuClipboardList className="mr-2" />
                            Proceed to visit all locations
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-1 transition-all hover:text-accent-foreground">
                        {routePlanSuggestion.length != 0 ? (
                          <>
                            <span className="text-md font-bold">
                              Suggested Route Plan
                              <span className="ml-3 text-sm font-medium">
                                (Total Distance:{" "}
                                {routePlanSuggestion.suggested_route_plan.total_distance.toFixed(
                                  2
                                )}{" "}
                                {routePlanSuggestion.suggested_route_plan.unit
                                  .charAt(0)
                                  .toUpperCase() +
                                  routePlanSuggestion.suggested_route_plan.unit
                                    .slice(1)
                                    .toLowerCase() +
                                  "s"}
                                )
                              </span>
                            </span>

                            {routePlanSuggestion.suggested_route_plan.cities.map(
                              (location) => (
                                <div className="grid gap-1">
                                  <span className="text-sm font-medium">
                                    {location.address}
                                  </span>
                                  {/* <span className="text-xs font-light">
                                ({location.coordinate.latitude},{" "}
                                {location.coordinate.longitude})
                              </span> */}
                                </div>
                              )
                            )}

                            <div className="pt-2 text-left text-xs font-medium hover:underline">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedRoutePlan(
                                    routePlanSuggestion.suggested_route_plan
                                  );
                                  setShowAlert(true);
                                }}
                              >
                                <LuClipboardList className="mr-2" />
                                Proceed with suggested plan
                              </Button>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>

                      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                        {/* <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            <LuClipboardList className="mr-2" />
                            Prepare itinerary
                          </Button>
                        </AlertDialogTrigger> */}

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm your selections?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Visit Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[190px] pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
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
                                          initialFocus
                                          required
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                              type="submit"
                              onClick={() => {
                                create_visit(form.getValues().date);
                                setShowAlert(false);
                              }}
                              disabled={!form.watch("date")}
                            >
                              Prepare itinerary
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-2 pb-2">
                      <div className="pr-4">
                        <Alert className="border-lime-500 bg-lime-50 hover:bg-lime-100">
                          <RocketIcon className="h-4 w-4" />
                          <AlertTitle>Heads up!</AlertTitle>
                          <AlertDescription className="font-normal">
                            <ReactMarkdown
                              children={routePlanSuggestion.recommendations}
                              remarkPlugins={[remarkGfm]}
                            />

                            <ReactMarkdown
                              children={
                                "**Note:** These recommendations are based on the distance between the locations and the estimated time it takes to travel between them. Your visit may take longer based on delays on the road or the time it takes to complete a visit."
                              }
                              remarkPlugins={[remarkGfm]}
                            />
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
