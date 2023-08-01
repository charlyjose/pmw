import { Separator } from "@/registry/new-york/ui/separator";

import { VisitPlanning } from "./visit-planning";

export default function AppointmentsPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            <span className="px-1 bg-red-300 mr-2 "></span>
            Visit Scheduling
          </h3>
          <p className="text-sm text-muted-foreground">
            Plan your placement visits
          </p>
        </div>
        <Separator />
        <div className="p-2">
          <VisitPlanning />
        </div>
      </div>
    </>
  );
}
