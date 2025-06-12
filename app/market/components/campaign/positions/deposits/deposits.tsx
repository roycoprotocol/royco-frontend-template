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
import { LoadingPluseIndicator } from "@/app/_components/common/loading-pluse-indicator";

export const Deposits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isLoading, data: propData } = useAtomValue(
    loadableCampaignMarketPositionAtom
  );

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

      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <LoadingPluseIndicator isLoading={isLoading} className="mt-2 h-8 w-40">
          <PrimaryLabel className="mt-2 text-2xl font-normal">
            {formatNumber(totalDeposits, {
              type: "currency",
            })}
          </PrimaryLabel>
        </LoadingPluseIndicator>
      </div>
    </div>
  );
});
