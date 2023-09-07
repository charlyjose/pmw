import { HomeInfo } from "./home-info";
import { PlacementVisit } from "./placement/visit/visits";

import { AllAppointments } from "./appointments/all-appointments";

export function DashboardPage() {
  return (
    <>
      <div>
        <HomeInfo />
      </div>
      <div className="pt-4">
        <PlacementVisit />
      </div>
      <div className="pt-2">
        <AllAppointments />
      </div>
    </>
  );
}
