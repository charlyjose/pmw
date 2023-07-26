"use client";

import { CreateAppointment } from "./create-appointment";
import { AllAppointments } from "./all-appointments";

export function Appointments() {
  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-9">
        {/* <div className="col-span-5">
          <div className="space-y-2">
            <CreateAppointment />
          </div>
        </div> */}

        {/* <div className="col-span-4">
          <AllAppointments />
        </div> */}

        <div className="col-span-9">
          <AllAppointments />
        </div>
      </div>
    </>
  );
}
