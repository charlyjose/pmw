import { Separator } from "@/registry/new-york/ui/separator";

import { Appointments } from "./appointments-page";

export default function AppointmentsPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            <span className="px-1 bg-lime-300 mr-2 "></span>
            Appointments
          </h3>
          <p className="text-sm text-muted-foreground">
            Schedule appointments with career services or academic advisors
          </p>
        </div>
        <Separator />
        <div className="p-2">
          <Appointments />
        </div>
      </div>
    </>
  );
}
