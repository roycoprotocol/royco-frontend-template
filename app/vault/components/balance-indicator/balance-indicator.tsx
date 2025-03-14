import { TertiaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import React from "react";

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const net_asset = 23000;
  const incentives = [{ value: 100000, label: "GHO" }];

  return (
    <div ref={ref} className={cn("rounded-lg px-5 py-8", className)} {...props}>
      {/**
       * Total Balance
       */}
      <div>
        <TertiaryLabel className="text-sm">Net asset value</TertiaryLabel>

        <PrimaryLabel className="mt-1 text-2xl font-medium">
          <div className="flex gap-2">
            <span>
              {formatNumber(
                net_asset,
                { type: "currency" },
                {
                  average: false,
                }
              )}
            </span>

            <span className="flex items-end text-sm">
              {formatNumber(
                net_asset,
                { type: "number" },
                {
                  average: false,
                }
              ) + " USDC"}
            </span>
          </div>
        </PrimaryLabel>
      </div>

      {/**
       * Incentives
       */}
      <div className={cn("mt-5")}>
        <TertiaryLabel className="mb-3 text-sm">
          Incentives Claimable
        </TertiaryLabel>

        <PrimaryLabel className="mt-1 text-sm font-medium">
          {formatNumber(
            incentives[0].value,
            { type: "number" },
            {
              average: false,
            }
          ) +
            " " +
            incentives[0].label +
            ", and 5 others"}
        </PrimaryLabel>
      </div>
    </div>
  );
});
