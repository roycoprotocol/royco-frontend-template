"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CustomBadge } from "../../common/custom-badge";

export const VaultIncentives = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("p-8", className)}>
      <SecondaryLabel>Current Rewards</SecondaryLabel>
    </div>
  );
});
