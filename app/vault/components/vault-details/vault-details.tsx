"use client";

import React from "react";

import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  TertiaryLabel,
  PrimaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CustomBadge } from "../../common/custom-badge";
import { CustomCircleProgress } from "../../common/custom-circle-progress";

export const VaultDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("rounded-2xl border border-divider bg-white ", className)}
    >
      <div className={cn("p-6")}>
        <PrimaryLabel className="mb-3 text-[40px] font-semibold">
          VEDA Vault
        </PrimaryLabel>

        <div className="mb-3 flex items-center gap-2">
          <CustomBadge label="USDC" />
          <CustomBadge label="by VEDA" />
          <CustomBadge label="ETH L1" />
          <CustomBadge label="30 day" />
          <CustomBadge label="Protected" />
        </div>

        <SecondaryLabel className="text-base font-normal">
          Get allocated into the highest yielding whitelisted markets,
          automatically.
        </SecondaryLabel>
      </div>

      <hr className="border-divider" />

      <div className={cn("grid grid-cols-4 p-6")}>
        <div>
          <SecondaryLabel>APY</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-medium">
            12.45%
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>TVL</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-medium">
            $754K
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>Max Lockup</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-medium">
            30 Days
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>Vault Capacity</SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-medium">
            <div className="text-[#f29c2d]">60%</div>
            <div className="ml-2 flex items-center">
              <CustomCircleProgress
                value={60}
                stroke={3}
                color="#f29c2d"
                direction="counterclockwise"
              />
            </div>
          </PrimaryLabel>
        </div>
      </div>
    </div>
  );
});
