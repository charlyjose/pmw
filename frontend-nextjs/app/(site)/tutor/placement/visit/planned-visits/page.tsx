import { Separator } from "@/registry/new-york/ui/separator";
import { App } from "./visit-list";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-red-300 mr-2 "></span>
          Scheduled Visits
        </h3>
        <p className="text-sm text-muted-foreground">
          View all your scheduled visits here.
        </p>
      </div>
      <Separator />
      <App />
    </div>
  );
}
