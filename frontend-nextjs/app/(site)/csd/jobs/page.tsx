import { Separator } from "@/registry/new-york/ui/separator";
import { JobsList } from "./jobs-list";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-purple-300 mr-2 "></span>
          Jobs
        </h3>
        <p className="text-sm text-muted-foreground">
          Curated jobs listing from career service.
        </p>
      </div>
      <Separator />
      <JobsList />
    </div>
  );
}
