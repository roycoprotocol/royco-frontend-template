"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { GlobalActivityManager } from "./global-activity-manager";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai";
import { loadableActivityAtom } from "@/store/portfolio/portfolio";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { AlertIndicator } from "@/components/common";

export const Activity = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected } = useAccount();
  const { data, isLoading } = useAtomValue(loadableActivityAtom);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Activity
      </PrimaryLabel>

      <div className="mt-6">
        {!isConnected ? (
          <AlertIndicator>Connect wallet to view your activity</AlertIndicator>
        ) : isLoading ? (
          <LoadingIndicator className="h-5 w-5" />
        ) : (
          <GlobalActivityManager
            data={
              data ?? {
                data: [],
                count: 0,
                page: {
                  index: 1,
                  size: 6,
                  total: 1,
                },
              }
            }
          />
        )}
      </div>
    </div>
  );
});

Activity.displayName = "Activity";
