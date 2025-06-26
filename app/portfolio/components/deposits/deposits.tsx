"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { loadablePortfolioPositionsAtom } from "@/store/portfolio/portfolio";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { DepositsManager } from "./deposits-manager";
import { AlertIndicator } from "@/components/common";
import { useAccount } from "wagmi";

export const Deposits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected } = useAccount();
  const { data, isLoading } = useAtomValue(loadablePortfolioPositionsAtom);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      <div className="mt-6">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 font-fragmentMono text-2xl font-normal">
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(isConnected ? data?.depositBalanceUsd || 0 : 0, {
                type: "currency",
              })}
            </span>
          </div>
        </PrimaryLabel>
      </div>

      <div className="mt-6">
        {!isConnected ? (
          <AlertIndicator>Connect wallet to view your deposits</AlertIndicator>
        ) : isLoading ? (
          <LoadingIndicator className="h-5 w-5" />
        ) : (
          <DepositsManager data={data?.positions ?? []} />
        )}
      </div>
    </div>
  );
});

Deposits.displayName = "Deposits";
