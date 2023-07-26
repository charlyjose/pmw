import { Separator } from "@/registry/new-york/ui/separator";
import { DashboardPage } from "./dashboard";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-red-300 mr-2 "></span>
          Home
        </h3>
        <p className="text-sm text-muted-foreground">
          Your personal dashboard
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <DashboardPage />
      </div>
    </div>
  );
}
