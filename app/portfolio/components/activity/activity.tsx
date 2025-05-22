"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { GlobalActivityManager } from "./global-activity-manager";

export const Activity = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Activity
      </PrimaryLabel>

      <GlobalActivityManager />
    </div>
  );
});

Activity.displayName = "Activity";
