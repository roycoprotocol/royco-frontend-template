"use client";

import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { cn } from "@/lib/utils";
import React from "react";
import { ExploreVaultsTable } from "./explore-vaults-table";

export const VaultsTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <div>
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          NEW
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-medium text-_primary_">
          Vaults
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
          High yield without the spreadsheets. Rebalanced automatically so your
          capital never sits idle.
        </SecondaryLabel>
      </div>

      <div className="mt-6">
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          FEATURED
        </SecondaryLabel>

        <div className="mt-6">
          <ExploreVaultsTable />
        </div>
      </div>
    </div>
  );
});
