import { useState } from "react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/registry/new-york/ui/switch";
import { Label } from "@/registry/new-york/ui/label";
import { Toggle } from "@/registry/new-york/ui/toggle";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";

import { RocketIcon } from "@radix-ui/react-icons";
import { DownloadIcon } from "lucide-react";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { HomeIcon, ArrowDown } from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

export function DialogDemo({ itinerary, axiosConfig }) {
  const [visitCompleted, setVisitCompleted] = useState(itinerary.completed);

  const updateCompleteVisitStatus = async (status) => {
    console.log("Updating visit status to: " + status);

    const API_URI = "http://localhost:8000";
    axios
      .put(
        `${API_URI}/api/tutor/placement/visit/itinerary/status?id=${itinerary.id}&status=${status}`,
        {
          status: status,
        },
        axiosConfig
      )
      .then((e) => {
        const toast_variant = "default";
        const toast_title = "Placement Visit";
        const toast_description = `Application status updated to ${
          status ? "Completed" : "Pending"
        }`;
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
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: e.response?.data?.message ? e.response.data.message : "",
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <ArrowUpRight className="mr-0 h-4 w-4" />
          <div className="text-right text-xs font-normal hover:underline">
            View
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-7">
                <div className="pt-1 font-normal">
                  Your visit to{" "}
                  <span className="font-bold">
                    {itinerary.region === "LONDON" ? (
                      <span>London</span>
                    ) : itinerary.region === "EASTERN" ? (
                      <span>Eastern</span>
                    ) : itinerary.region === "SE" ? (
                      <span>South East</span>
                    ) : itinerary.region === "SW" ? (
                      <span>South West</span>
                    ) : itinerary.region === "WALES" ? (
                      <span>Wales</span>
                    ) : itinerary.region === "EM" ? (
                      <span>East Midlands</span>
                    ) : itinerary.region === "WM" ? (
                      <span>West Midlands</span>
                    ) : itinerary.region === "NE" ? (
                      <span>North East</span>
                    ) : itinerary.region === "NW" ? (
                      <span>North West</span>
                    ) : itinerary.region === "YH" ? (
                      <span>Yorkshire</span>
                    ) : itinerary.region === "NI" ? (
                      <span>Northern Ireland</span>
                    ) : itinerary.region === "SCOTLAND" ? (
                      <span>Scotland</span>
                    ) : itinerary.region === "INTERNATIONAL" ? (
                      <span>International</span>
                    ) : (
                      <span>Unknown</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="col-span-3">
                {visitCompleted ? (
                  <Badge variant="default">VISIT COMPLETED</Badge>
                ) : (
                  <Badge variant="destructive">VISIT PENDING</Badge>
                )}
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="STATUS"
                    defaultChecked={visitCompleted}
                    onCheckedChange={(e) => {
                      if (e) {
                        updateCompleteVisitStatus(true);
                        setVisitCompleted(true);
                      } else {
                        updateCompleteVisitStatus(false);
                        setVisitCompleted(false);
                      }
                    }}
                    className="hover:bg-accent hover:border-accent-foreground"
                  />
                  <Label htmlFor="text-left">
                    {visitCompleted ? (
                      <span>Change to Pending</span>
                    ) : (
                      <span>Change to Visited</span>
                    )}
                  </Label>
                </div>
              </div>
            </div>
          </DialogTitle>

          <DialogDescription className="pt-5">
            <ScrollArea className="rounded-md h-[610px]">
              <div className="pt-2 pr-3">
                <Card className="transition-all bg-lime-50 hover:bg-accent hover:text-accent-foreground hover:bg-lime-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-md font-medium text-center">
                      <Button variant="link" className="hover:no-underline">
                        <HomeIcon className="mr-1 h-4 w-4" />
                        {itinerary.startAddress[0]}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid place-items-center pt-1">
                  <ArrowDown className="h-5 w-5" />
                </div>
              </div>

              {itinerary.placements.map((placement) => (
                <div className="pt-1 pr-3">
                  <Card
                    className="transition-all hover:bg-accent hover:text-accent-foreground"
                    key={placement.id}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <div className="text-sm font-bold">
                          {placement.firstName} {placement.lastName}
                        </div>
                        <div className="text-sm font-normal pt-2">
                          {placement.orgName}
                        </div>
                        <div className="text-sm font-normal pt-2">
                          {placement.address}
                        </div>
                      </CardTitle>

                      {placement.visitStatus === "PENDING" ? (
                        <Badge
                          variant="secondary"
                          className="font-bold text-md"
                        >
                          <span className="text-yellow-600">Pending</span>
                        </Badge>
                      ) : placement.visitStatus === "SCHEDULED" ? (
                        <Badge variant="default" className="font-bold text-md">
                          <span className="text-green-200">Scheduled</span>
                        </Badge>
                      ) : placement.visitStatus === "CONFIRMED" ? (
                        <Badge
                          variant="secondary"
                          className="font-bold text-md"
                        >
                          <span className="text-purple-600">Confirmed</span>
                        </Badge>
                      ) : placement.visitStatus === "COMPLETED" ? (
                        <Badge
                          variant="secondary"
                          className="font-bold text-md"
                        >
                          <span className="text-green-600">Completed</span>
                        </Badge>
                      ) : placement.visitStatus === "CANCELLED" ? (
                        <Badge
                          variant="secondary"
                          className="font-bold text-md"
                        >
                          <span className="text-red-600">Cancelled</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="font-bold text-md"
                        >
                          <span className="text-yellow-600">Unknown</span>
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-5">
                          <div className="text-xs font-bold"></div>
                        </div>
                        <div className="col-span-7">
                          <div className="text-right text-xs font-medium hover:underline"></div>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={placement.id}>
                          <AccordionTrigger className="text-right text-sm font-normal transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline">
                            <span className="font-bold text-xs">
                              + Additional Details
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-1">
                              <div className="text-xs font-medium">
                                <span className="font-bold">Role: </span>
                                {placement.roleTitle}
                              </div>
                            </div>
                            <div className="grid gap-1">
                              <div className="text-xs font-medium">
                                <span className="font-bold">Started On: </span>
                                {new Date(placement.startDate).toDateString()}
                              </div>
                            </div>
                            <div className="grid gap-1">
                              <div className="text-xs font-medium">
                                <span className="font-bold">Ending On: </span>
                                {new Date(placement.endDate).toDateString()}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>

                  <div className="w-full grid place-items-center pt-1">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                </div>
              ))}

              <div className="pt-1 pr-3">
                <Card className="transition-all bg-lime-50 hover:bg-accent hover:text-accent-foreground hover:bg-lime-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-md font-medium text-center">
                      <Button variant="link" className="hover:no-underline">
                        <HomeIcon className="mr-1 h-4 w-4" />
                        {itinerary.startAddress[0]}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>

        <div className="text-left text-lg font-bold">
          <span className="px-1 bg-red-300 mr-2 "></span>
          More Details
          <Separator className="my-1" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {itinerary.visitDate ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                DATE
              </div>
              <div className="text-sm font-normal">
                {new Date(itinerary.visitDate).toDateString()}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {itinerary.totalDistance ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                TRAVEL
              </div>
              <div className="text-sm font-normal">
                {itinerary.totalDistance.toFixed(2)}{" "}
                {itinerary.unit.charAt(0).toUpperCase() +
                  itinerary.unit.slice(1).toLowerCase() +
                  "s"}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {itinerary.region ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                REGION
              </div>
              <div className="text-sm font-normal">
                <span>
                  {itinerary.region === "LONDON" ? (
                    <span>London</span>
                  ) : itinerary.region === "EASTERN" ? (
                    <span>Eastern</span>
                  ) : itinerary.region === "SE" ? (
                    <span>South East</span>
                  ) : itinerary.region === "SW" ? (
                    <span>South West</span>
                  ) : itinerary.region === "WALES" ? (
                    <span>Wales</span>
                  ) : itinerary.region === "EM" ? (
                    <span>East Midlands</span>
                  ) : itinerary.region === "WM" ? (
                    <span>West Midlands</span>
                  ) : itinerary.region === "NE" ? (
                    <span>North East</span>
                  ) : itinerary.region === "NW" ? (
                    <span>North West</span>
                  ) : itinerary.region === "YH" ? (
                    <span>Yorkshire</span>
                  ) : itinerary.region === "NI" ? (
                    <span>Northern Ireland</span>
                  ) : itinerary.region === "SCOTLAND" ? (
                    <span>Scotland</span>
                  ) : itinerary.region === "INTERNATIONAL" ? (
                    <span>International</span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {itinerary.placements ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-red-300 mr-2"></span>
                VISITS
              </div>
              <div className="text-sm font-normal">
                <span>{itinerary.placements.length}</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
