"use client";

import React, { useEffect } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { TotalValueLocked } from "./total-value-locked/total-value-locked";
import { VaultDetails } from "./vault-details/vault-details";
import { VaultAllocation } from "./vault-allocation/vault-allocation";
import { VaultFAQ } from "./vault-faq/vault-faq";
import { useBoringVaultV1 } from "boring-vault-ui";
import { VaultActionForm } from "./vault-action-form/vault-action-form";
import { BalanceIndicator } from "./balance-indicator/balance-indicator";

export const VaultManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();
  const { isBoringV1ContextReady, fetchTotalAssets, fetchUserShares } =
    useBoringVaultV1();

  useEffect(() => {
    if (!address) return;
    fetchUserShares(address).then((value) => {
      console.log("Share value: ", value);
    });
  }, [isBoringV1ContextReady, address]);

  useEffect(() => {
    fetchTotalAssets().then((assets) => {
      console.log("The Vaults TVL: ", assets);
    });
  }, [fetchTotalAssets]);

  return (
    <div ref={ref} {...props} className={cn("py-5", className)}>
      {/**
       * Back Button
       */}
      <div className="flex justify-start">
        <SecondaryLabel
          onClick={() => window.open("/", "_self", "noopener noreferrer")}
          className={cn(
            "flex cursor-pointer items-center",
            "font-light text-white",
            "transition-all duration-200 ease-in-out hover:opacity-80"
          )}
        >
          <ChevronLeftIcon strokeWidth={1.5} className="-ml-2 h-6 w-6 " />
          <span>Back</span>
        </SecondaryLabel>
      </div>

      {/**
       * Total Value Locked
       */}
      <TotalValueLocked className="mt-7" />

      <div className="mt-7 flex flex-col gap-3 lg:flex-row">
        <div className="w-full lg:w-2/3">
          {/**
           * Vault Details
           */}
          <VaultDetails />

          {/**
           * Vault Allocation
           */}
          <VaultAllocation className="mt-7" />

          {/**
           * Vault FAQ
           */}
          <VaultFAQ className="mt-7" />
        </div>

        <div className="w-full lg:w-1/3">
          <div className="w-full rounded-xl bg-white shadow-sm">
            <BalanceIndicator />

            <hr />

            <VaultActionForm />
          </div>
        </div>
      </div>
    </div>
  );
});
