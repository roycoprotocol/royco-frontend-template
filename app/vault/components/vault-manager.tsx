"use client";

import React, { useEffect } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { VaultDetails } from "./vault-details/vault-details";
import { MarketAllocation } from "./market-allocation/market-allocation";
import { VaultFAQ } from "./vault-faq/vault-faq";
import { VaultActionForm } from "./vault-action-form/action-form";
import { BalanceIndicator } from "./balance-indicator/balance-indicator";
import { Rewards } from "./rewards/rewards";
import { SlideUpWrapper } from "@/components/animations";
import { TransactionModal } from "../common/transaction-modal/transaction-modal";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";
import { Withdrawals } from "./withdrawals/withdrawals";

export const VaultManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  if (!data) {
    return null;
  }

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

      <div className="mt-7 flex flex-col gap-y-4 lg:flex-row lg:gap-x-3">
        <div className="w-full lg:w-2/3">
          {/**
           * Vault Details
           */}
          <SlideUpWrapper>
            <VaultDetails />
          </SlideUpWrapper>

          {/**
           * Rewards
           */}
          <SlideUpWrapper className="mt-4" delay={0.1}>
            <Rewards />
          </SlideUpWrapper>

          {/**
           * Market Allocation
           */}
          <SlideUpWrapper className="mt-4" delay={0.2}>
            <MarketAllocation />
          </SlideUpWrapper>

          {/**
           * Withdrawals
           */}
          <SlideUpWrapper className="mt-4" delay={0.3}>
            <Withdrawals />
          </SlideUpWrapper>

          {/**
           * Vault FAQ
           */}
          <SlideUpWrapper className="mt-4" delay={0.4}>
            <VaultFAQ />
          </SlideUpWrapper>
        </div>

        <div className="w-full lg:w-1/3">
          <SlideUpWrapper>
            <div className="w-full rounded-2xl border border-divider bg-white">
              <BalanceIndicator />

              <hr />

              <VaultActionForm />
            </div>
          </SlideUpWrapper>
        </div>
      </div>

      <TransactionModal />
    </div>
  );
});
