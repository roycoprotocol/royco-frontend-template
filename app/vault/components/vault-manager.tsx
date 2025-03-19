"use client";

import React from "react";
import { ChevronLeftIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { TotalValueLocked } from "./total-value-locked/total-value-locked";
import { VaultDetails } from "./vault-details/vault-details";
import { VaultAllocation } from "./vault-allocation/vault-allocation";
import { VaultFAQ } from "./vault-faq/vault-faq";
import { VaultActionForm } from "./vault-action-form/vault-action-form";
import { BalanceIndicator } from "./balance-indicator/balance-indicator";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";

export const VaultManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const boringVault = useAtomValue(boringVaultAtom);

  console.log({ boringVault });

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
