"use client";

import { CreateAppointment } from "./create-appointment";
import { AllAppointments } from "./all-appointments";

export function Appointments() {
  return (
    <>
      <div className="grid gap-2 grid-cols-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="col-span-6">
          <div className="space-y-2">
            <CreateAppointment />
          </div>
        </div>

        <div className="col-span-6">
          <AllAppointments />
        </div>
      </div>
    </>
  );
}
