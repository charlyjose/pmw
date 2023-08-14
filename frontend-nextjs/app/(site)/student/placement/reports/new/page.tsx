import { Separator } from "@/registry/new-york/ui/separator";
import { NewMonthlyReport } from "./new-monthly-report";
import { PlacementStartDeclaration } from "./placement-start-declaration";

export default function NewMonthlyReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Monthly Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Submit your monthly placement reports
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <NewMonthlyReport />
      </div>
      <div className="p-2">
        <PlacementStartDeclaration />
      </div>
    </div>
  );
}
