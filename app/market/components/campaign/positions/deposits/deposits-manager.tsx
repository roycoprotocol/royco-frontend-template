"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { useAtomValue } from "jotai";
import { loadableCampaignMarketPositionAtom } from "@/store/market/market";
import { BaseEnrichedTokenDataWithWithdrawStatus } from "@/app/api/royco/data-contracts";

export const DepositsManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: propData } = useAtomValue(loadableCampaignMarketPositionAtom);

  const totalDeposits = useMemo(() => {
    return (
      (
        propData?.data[0]
          ?.inputTokens as unknown as BaseEnrichedTokenDataWithWithdrawStatus[]
      )?.reduce((acc, token) => acc + token.tokenAmountUsd, 0) || 0
    );
  }, [propData]);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      <div className="mt-7">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          {formatNumber(totalDeposits, {
            type: "currency",
          })}
        </PrimaryLabel>
      </div>
    </div>
  );
});
