"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CustomBadge } from "../../common/custom-badge";

export const VaultInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("p-8", className)}>
      <PrimaryLabel className="text-4xl font-normal">XYZ Vault</PrimaryLabel>

      <div className="mt-4 flex items-center gap-2">
        <CustomBadge label="USDC" />
        <CustomBadge label="by VEDA" />
        <CustomBadge label="ETH L1" />
        <CustomBadge label="30 day" />
        <CustomBadge label="Protected" />
      </div>

      <TertiaryLabel className="mt-4 text-base font-normal">
        Automatically get allocated into the highest yielding whitelisted
        markets and then automatically highest yielding whitelisted.
      </TertiaryLabel>

      <div className="mt-4 flex items-center gap-10">
        <div>
          <SecondaryLabel>Rewards</SecondaryLabel>
          <PrimaryLabel className="mt-2 text-2xl font-medium">
            3.00%+
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>TVL</SecondaryLabel>
          <PrimaryLabel className="mt-2 text-2xl font-medium">
            $754,232.24
          </PrimaryLabel>
        </div>

        <div>
          <SecondaryLabel>Royco Multiplier</SecondaryLabel>
          <PrimaryLabel className="mt-2 text-2xl font-medium">5x</PrimaryLabel>
        </div>
      </div>
    </div>
  );
});
