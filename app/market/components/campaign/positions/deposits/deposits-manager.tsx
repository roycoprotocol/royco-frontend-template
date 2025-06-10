"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";

export const DepositsManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      <div className="mt-7">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        {/* <PrimaryLabel className="mt-2 text-2xl font-normal">
          {formatNumber(data?.depositToken.tokenAmount ?? 0, {
            type: "number",
          })}{" "}
          {enrichedVault?.depositTokens[0].symbol}
        </PrimaryLabel> */}
      </div>
    </div>
  );
});
