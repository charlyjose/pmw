import { Separator } from "@/registry/new-york/ui/separator";
import { PlacementVisit } from "./visits";

export default function MonthlyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Placement Visit
        </h3>
        <p className="text-sm text-muted-foreground">
          View details of your placement visit
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <PlacementVisit />
      </div>
    </div>
  );
}
