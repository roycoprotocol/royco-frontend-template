"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const VaultIncentives = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const rewards = [
    { value: "5.07%", label: "GHO" },
    { value: "5.07%", label: "GHO" },
    { value: "5X Points", label: "VEDA Points" },
    { value: "5X Points", label: "VEDA Points" },
    { value: "12.00%", label: "stkGHO, AAVE" },
    { value: "12.00%", label: "stkGHO, AAVE" },
  ];

  return (
    <div ref={ref} {...props} className={cn("p-8", className)}>
      <SecondaryLabel>Current Rewards</SecondaryLabel>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {rewards.map((reward, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <SecondaryLabel className="font-medium text-black">
              {reward.label}
            </SecondaryLabel>
            <SecondaryLabel>{reward.value}</SecondaryLabel>
          </div>
        ))}
      </div>
    </div>
  );
});
