import { Separator } from "@/registry/new-york/ui/separator";
import { PlacementApplication } from "./placement-application";

export default function PlacementApplicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          <span className="px-1 bg-lime-300 mr-2 "></span>
          Placement Authorisation Request Form
        </h3>
        <p className="text-sm text-muted-foreground">
          Create or make amends to your placement application
        </p>
      </div>
      <Separator />
      <div className="p-2">
        <PlacementApplication />
      </div>
    </div>
  );
}
