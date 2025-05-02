"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ChainFilter } from "./filters/chain-filter";

export const MarketFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center",
        className
      )}
    >
      <div>
        <PrimaryLabel className="text-2xl font-medium text-_primary_">
          Markets
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
          Maximum precision. You decide when and where to move capital.
        </SecondaryLabel>
      </div>

      <div className="flex gap-2">
        <ChainFilter />
      </div>
    </div>
  );
});
