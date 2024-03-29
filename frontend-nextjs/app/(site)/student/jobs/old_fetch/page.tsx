import { Separator } from "@/registry/new-york/ui/separator";
import { App } from "./jobs-list";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Jobs
        </h3>
        <p className="text-sm text-muted-foreground">
          Here you can view all the curated jobs from career service.
        </p>
      </div>
      <Separator />
      <App />
    </div>
  );
}
