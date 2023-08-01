import { Separator } from "@/registry/new-york/ui/separator";

import { ApplyJob } from "./apply-job";

export default function JobPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            <span className="px-1 bg-lime-300 mr-2 "></span>
            Job Details
          </h3>
          <p className="text-sm text-muted-foreground">Apply for job</p>
        </div>
        <Separator />
        <div className="p-2">
          <ApplyJob />
        </div>
      </div>
    </>
  );
}
