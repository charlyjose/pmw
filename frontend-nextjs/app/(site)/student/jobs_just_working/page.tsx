import { Separator } from "@/registry/new-york/ui/separator";
import { JobsList } from "./jobs-list";

export default function MonthlyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Jobs</h3>
        <p className="text-sm text-muted-foreground">
          Here you can view all the curated jobs from career service.
        </p>
      </div>
      <Separator />
      <JobsList />
    </div>
  );
}
