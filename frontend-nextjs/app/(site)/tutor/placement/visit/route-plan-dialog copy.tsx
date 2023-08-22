import { useState } from "react";
import Link from "next/link";

import axios from "axios";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

import { LuClipboardList, LuMap } from "react-icons/lu";
import { Icons } from "@/components/icons";

import { toast } from "@/registry/new-york/ui/use-toast";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LocationSearch } from "./location-search/search";

export function RoutePlanDialog({ locations, axiosConfig }) {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(52.620674);
  const [longitude, setLongitude] = useState(-1.125511);

  const [routePlan, setRoutePlan] = useState([]);
  const [routePlanSuggestion, setRoutePlanSuggestion] = useState([]);
  const [loadRoutePlan, setLoadRoutePlan] = useState(false);
  const [routePlanIsLoading, setRoutePlanIsLoading] = useState(false);

  const get_route_plan = async (unit: string) => {
    setRoutePlanIsLoading(true);

    console.log("locations: ", locations);

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

    const API_URI = "http://localhost:8000";
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

        console.log("route_plan: ", route_plan);
        console.log("route_plan_suggestion: ", route_plan_suggestion);

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
    }, 3000);
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

              <Button
                disabled={address == "" ? true : false}
                onClick={(e) => {
                  e.preventDefault();
                  get_route_plan("MILE");
                }}
              >
                Get Route Plan
              </Button>

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
                    <div className="grid grid-cols-1 gap-4 pt-2 pb-2">
                      <span className="text-md font-bold">
                        Selected Route Plan
                        <span className="ml-3 text-sm font-medium">
                          (Total Distance: {routePlan.total_distance.toFixed(2)}{" "}
                          {routePlan.unit.charAt(0).toUpperCase() +
                            routePlan.unit.slice(1).toLowerCase() +
                            "s"}
                          )
                        </span>
                      </span>

                      {routePlan.cities.map((location) => (
                        <div className="grid gap-1">
                          <div className="text-sm font-medium">
                            {location.address}
                          </div>
                          <div className="text-xs font-light">
                            {location.coordinate.latitude},{" "}
                            {location.coordinate.longitude}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-2 pb-2">
                      <div className="p-4">
                        <Alert className="bg-lime-50 hover:bg-lime-100">
                          <RocketIcon className="h-4 w-4" />
                          <AlertTitle>Heads up!</AlertTitle>
                          <AlertDescription className="font-normal">
                            {routePlanSuggestion.recommendations}
                          </AlertDescription>
                        </Alert>
                      </div>

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
                            <div className="text-sm font-medium">
                              {location.address}
                            </div>
                            <div className="text-xs font-light">
                              {location.coordinate.latitude},{" "}
                              {location.coordinate.longitude}
                            </div>
                          </div>
                        )
                      )}
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
        {/* 
        <div className="text-left text-lg font-bold">
          <span className="px-1 bg-red-300 mr-2 "></span>
          More Details
          <Separator className="my-1" />
        </div>
 */}

        <div className="grid grid-cols-5 gap-4">
          {/* 

          {job.salary ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                SALARY
              </div>
              <div className="text-sm font-normal">{job.salary}</div>
            </div>
          ) : (
            <div></div>
          )}



          {job.deadline ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                DEADLINE
              </div>
              <div className="text-sm font-normal">
                {new Date(job.deadline).toDateString()}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {job.location ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                LOCATIONS
              </div>
              <div className="text-sm font-normal">
                <span>{job.location.join(", ")}</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {job.mode ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                WORKING MODE
              </div>
              <div className="text-sm font-normal">
                <span>
                  {job.mode.charAt(0).toUpperCase() +
                    job.mode.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {job.link ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-right text-xs font-medium hover:underline">
                    <Button
                      className="hover:bg-red-300 hover:text-black"
                      disabled
                    >
                      <ArrowUpRight className="mr-0 h-4 w-4" />
                      <Link href={job.link} className="">
                        Apply
                      </Link>
                    </Button>
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p>This feature is only available for students</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}

 */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
