"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { marketMetadataAtom } from "@/store/market/market";
import { useAtomValue } from "jotai";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const CampaignActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const data = useAtomValue(marketMetadataAtom);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <div
        className={cn(
          "flex flex-col rounded-sm border border-_divider_ bg-_surface_",
          className
        )}
      >
        <div
          className="flex flex-col items-center justify-between gap-5 p-8"
          style={{
            background: `linear-gradient(to bottom left, #1A6FBB0D, transparent, transparent)`,
          }}
        >
          <PrimaryLabel className="text-2xl font-medium text-_primary_">
            Deposit via Morpho
          </PrimaryLabel>

          <SecondaryLabel className="text-sm font-normal text-_secondary_">
            This is a Royco Turbo. This means positions created outside of Royco
            are eligible for rewards.
          </SecondaryLabel>
        </div>
      </div>
    </div>
  );
});
