import { Separator } from "@/registry/new-york/ui/separator";

import { Appointments } from "./appointments-page";

export default function AppointmentsPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            <span className="px-1 bg-red-300 mr-2 "></span>
            Appointments
          </h3>
          <p className="text-sm text-muted-foreground">
            Schedule appointments with your team members, placement tutor or students
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
