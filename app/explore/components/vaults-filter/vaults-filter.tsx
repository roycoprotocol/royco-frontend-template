"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

interface VaultsFilterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const VaultsFilter = React.forwardRef<HTMLDivElement, VaultsFilterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn("", className)}>
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          NEW
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-medium text-_primary_">
          Vaults
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
          Eliminate the guesswork. Vaults rebalance your capital and negotiate
          incentives across Royco Markets — optimizing for risk-adjusted
          returns.
        </SecondaryLabel>
      </div>
    );
  }
);
