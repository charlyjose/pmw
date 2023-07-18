import { Separator } from "@/registry/new-york/ui/separator";
import { MonthlyReports } from "./monthly-reports";

export default function MonthlyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-purple-300 mr-2 "></span>
          Monthly Placement Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          View all your submitted monthly placement reports
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <MonthlyReports />
      </div>
    </div>
  );
}
