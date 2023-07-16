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
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "antd";

import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DialogDemo({ job }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <ArrowUpRight className="mr-0 h-4 w-4" />
          <div className="text-right text-xs font-normal hover:underline">
            Apply
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] ">
        <DialogHeader>
          <DialogTitle>
            {/* <Badge.Ribbon text="⭐ Highly Rated" color="green"></Badge.Ribbon> */}
            <div className="pt-1">{job.role}</div>
            <div className="pt-2 text-md font-light">{job.company}</div>
          </DialogTitle>

          <DialogDescription className="pt-5">
            <ScrollArea className="rounded-md h-72">
              <ReactMarkdown
                children={job.description}
                remarkPlugins={[remarkGfm]}
              />
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>

        <div className="text-left text-lg font-bold">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          More Details
          <Separator className="my-1" />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {job.salary ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
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
                <span className="px-1 bg-lime-300 mr-2"></span>
                DEADLINE
              </div>
              <div className="text-sm font-normal">{job.deadline}</div>
            </div>
          ) : (
            <div></div>
          )}

          {job.location ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                LOCATIONS
              </div>
              <div className="text-sm font-normal">
                <span>{job.location.join(", ")}</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {job.label ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                PLACEMENT
              </div>
              <div className="text-sm font-normal">
                <span>
                  {job.placement.charAt(0).toUpperCase() +
                    job.placement.slice(1)}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="text-right text-xs font-medium hover:underline">
            <Button className="hover:bg-lime-300 hover:text-black">
              <ArrowUpRight className="mr-0 h-4 w-4" />
              <Link href={job.link} className="">
                Apply
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
