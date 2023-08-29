"use client";

import { Communications } from "./communications";

export function CommunicationsPage() {
  return (
    <>
      <div className="grid gap-2 grid-cols-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="col-span-12">
          <div className="space-y-2">
            <Communications />
          </div>
        </div>
      </div>
    </>
  );
}
