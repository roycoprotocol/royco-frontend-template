"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { useAtomValue } from "jotai";
import { loadableCampaignMarketPositionAtom } from "@/store/market/market";
import { BaseEnrichedTokenDataWithWithdrawStatus } from "@/app/api/royco/data-contracts";
import { LoadingPluseIndicator } from "@/app/_components/common/loading-pluse-indicator";
import {
  PrimaryLabel,
  TertiaryLabel,
} from "@/app/_components/common/custom-labels";

interface DepositsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Deposits = React.forwardRef<HTMLDivElement, DepositsProps>(
  ({ className, ...props }, ref) => {
    const { isLoading, data: propData } = useAtomValue(
      loadableCampaignMarketPositionAtom
    );

    const totalDepositsUsd = useMemo(() => {
      return (
        (
          propData?.data[0]
            ?.inputTokens as unknown as BaseEnrichedTokenDataWithWithdrawStatus[]
        )?.reduce((acc, token) => acc + token.tokenAmountUsd, 0) || 0
      );
    }, [propData]);

    return (
      <div ref={ref} {...props} className={cn("", className)}>
        <PrimaryLabel>Deposits</PrimaryLabel>

        <div className="mt-4">
          <TertiaryLabel>TOTAL DEPOSITS</TertiaryLabel>

          <LoadingPluseIndicator
            isLoading={isLoading}
            className="mt-2 h-8 w-40"
          >
            <PrimaryLabel className="mt-2 font-normal">
              {formatNumber(totalDepositsUsd, {
                type: "currency",
              })}
            </PrimaryLabel>
          </LoadingPluseIndicator>
        </div>
      </div>
    );
  }
);
