import { Separator } from "@/registry/new-york/ui/separator";

import { CommunicationsPage } from "./communications-page";

export default function AppointmentsPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            <span className="px-1 bg-purple-300 mr-2 "></span>
            Communications
          </h3>
          <p className="text-sm text-muted-foreground">
            Chat or email with your students
          </p>
        </div>
        <Separator />
        <div className="p-2">
          <CommunicationsPage />
        </div>
      </div>
    </>
  );
}
