import { HomeInfo } from "./home-info";
import { AllAppointments } from "./appointments/all-appointments";

export function DashboardPage() {
  return (
    <>
      <div>
        <HomeInfo />
      </div>
      <div className="pt-2">
        <AllAppointments />
      </div>
    </>
  );
}
