import { Separator } from "@/registry/new-york/ui/separator";
import { MonthlyReports } from "./applied-jobs";

export default function MonthlyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Applied Jobs
        </h3>
        <p className="text-sm text-muted-foreground">
          View all your applied jobs
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <MonthlyReports />
      </div>
    </div>
  );
}
