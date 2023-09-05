import { Separator } from "@/registry/new-york/ui/separator";
import { App } from "./placement-reports";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-red-300 mr-2 "></span>
          Placement Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          View placement reports of your students
        </p>
      </div>
      <Separator />
      <App />
    </div>
  );
}
