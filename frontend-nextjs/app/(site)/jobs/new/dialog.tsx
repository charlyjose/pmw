import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { FrownIcon } from "lucide-react";

import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DialogDemo({ form }) {
  var job = form.getValues();

  // Format Role
  job.role =
    job.role?.trim().charAt(0).toUpperCase() + job.role?.trim().slice(1);

  // Format Company
  job.company =
    job.company?.trim().charAt(0).toUpperCase() + job.company?.trim().slice(1);

  // Format locations
  job.location = job.location?.map((location) => {
    return (
      location.value.trim().charAt(0).toUpperCase() +
      location.value.trim().slice(1)
    );
  });
  job.location = job.location?.filter((location) => location !== "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          <div className="text-right font-normal">Preview</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        {job.role ||
        job.company ||
        job.description ||
        job.salary ||
        job.deadline ||
        job.mode ||
        job.industry ||
        job.function ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {job.role ? <div className="pt-1">{job.role}</div> : <></>}
                {job.company ? (
                  <div className="pt-2 text-md font-light">{job.company}</div>
                ) : (
                  <></>
                )}
              </DialogTitle>

              {job.description ? (
                <DialogDescription className="pt-5">
                  <ScrollArea className="rounded-md h-72">
                    <ReactMarkdown
                      children={job.description}
                      remarkPlugins={[remarkGfm]}
                    />
                  </ScrollArea>
                </DialogDescription>
              ) : (
                <></>
              )}
            </DialogHeader>

            {job.salary ||
            job.deadline ||
            job.mode ||
            job.industry ||
            job.function ||
            job.link ? (
              <>
                <div className="text-left text-lg font-bold">
                  <span className="px-1 bg-purple-300 mr-2 "></span>
                  More Details
                  <Separator className="my-1" />
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {job.salary ? (
                    <div className="grid gap-1">
                      <div className="text-xs font-light">
                        <span className="px-1 bg-purple-300 mr-2"></span>
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
                        <span className="px-1 bg-purple-300 mr-2"></span>
                        DEADLINE
                      </div>
                      <div className="text-sm font-normal">
                        {job.deadline.toDateString()}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {job.location && job.location?.length > 0 ? (
                    <div className="grid gap-1">
                      <div className="text-xs font-light">
                        <span className="px-1 bg-purple-300 mr-2"></span>
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
                        <span className="px-1 bg-purple-300 mr-2"></span>
                        WORKING MODE
                      </div>
                      <div className="text-sm font-normal">
                        <span>
                          {job.mode.charAt(0).toUpperCase() + job.mode.slice(1)}
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
                              className="hover:bg-purple-300 hover:text-black"
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

                  {job.industry ? (
                    <div className="grid gap-1">
                      <div className="text-xs font-light">
                        <span className="px-1 bg-purple-300 mr-2"></span>
                        INDUSTRY
                      </div>
                      <div className="text-sm font-normal">
                        <span>
                          {job.industry
                            .replace(/_/g, " ")
                            .trim()
                            .charAt(0)
                            .toUpperCase() +
                            job.industry
                              .replace(/_/g, " ")
                              .trim()
                              .slice(1)
                              .toLowerCase()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {job.function ? (
                    <div className="grid gap-1">
                      <div className="text-xs font-light">
                        <span className="px-1 bg-purple-300 mr-2"></span>
                        JOB FUNCTION
                      </div>
                      <div className="text-sm font-normal">
                        <span>
                          {job.function
                            .replace(/_/g, " ")
                            .trim()
                            .charAt(0)
                            .toUpperCase() +
                            job.function
                              .replace(/_/g, " ")
                              .trim()
                              .slice(1)
                              .toLowerCase()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <FrownIcon className="mr-2 w-20 h-20 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold">
                Nothing to show here.
              </h3>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
