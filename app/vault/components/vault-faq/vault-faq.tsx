"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const VaultFAQ = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("rounded-xl bg-white p-8 shadow-sm", className)}
    >
      <SecondaryLabel>Vault FAQ</SecondaryLabel>

      <SecondaryLabel className="mt-2 break-normal">
        Vaults gets rebalanced once every week. The goal of the Vault keeps
        assets safe and secure, without something or another. It may take a week
        to process a withdrawal. It may take a week to start earning.
      </SecondaryLabel>
    </div>
  );
});
