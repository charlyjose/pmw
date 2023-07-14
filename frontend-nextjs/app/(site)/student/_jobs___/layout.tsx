import { Separator } from "@/registry/new-york/ui/separator";
import JobsLayout from "./page";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function JobsPage({
  children,
}: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Jobs</h3>
        <p className="text-sm text-muted-foreground">
          Here you can view all the curated jobs from career service.
        </p>
      </div>
      <Separator />
      <JobsLayout>
        {children}
        </JobsLayout>
    </div>
  );
}
