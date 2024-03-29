import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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



export function DialogDemo({ job }) {
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

          {job.mode ? (
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
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
            <div className="text-right text-xs font-medium hover:underline">
              <Button className="hover:bg-lime-300 hover:text-black">
                <ArrowUpRight className="mr-0 h-4 w-4" />
                {/* <Link href={`jobs/job?id=${job.id}`} target="_blank"> */}
                <Link href={`jobs/job?id=${job.id}`}>Apply</Link>
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
