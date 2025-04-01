"use client";

import React from "react";

import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  PrimaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CustomBadge } from "../../common/custom-badge";
import formatNumber from "@/utils/numbers";
import { Progress } from "@/components/ui/progress";

export const VaultDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "rounded-2xl border border-divider bg-white p-6",
        className
      )}
    >
      <div>
        <PrimaryLabel className="text-[40px] font-medium">
          VEDA Vault
        </PrimaryLabel>

        <div className="mt-3 flex items-center gap-2">
          <CustomBadge label="VEDA" />
          <CustomBadge label="ETH L1" />
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        <div>
          <SecondaryLabel>Deposit</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">
            USDC
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>Est. APY</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">
            {formatNumber(1.2521, {
              type: "percent",
            })}
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>Max Lockup</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">30d</PrimaryLabel>
        </div>
      </div>

      <div className="mt-6">
        <Progress
          value={60}
          className="h-2 bg-z2"
          indicatorClassName="bg-warning"
        />

        <div className="mt-2 flex items-center justify-between">
          <SecondaryLabel className="text-xs font-medium">
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(2000, {
                  type: "currency",
                })}
              </span>
              <span>TVL</span>
            </div>
          </SecondaryLabel>

          <SecondaryLabel className="text-xs font-medium">
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(0.98, {
                  type: "percent",
                })}
              </span>
              <span>Remaining</span>
            </div>
          </SecondaryLabel>
        </div>
      </div>
    </div>
  );
});
