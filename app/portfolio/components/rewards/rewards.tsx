"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { AlertIndicator } from "@/components/common";
import { useAtomValue } from "jotai";
import { TokenRewardsManager } from "./tokens/token-rewards-manager";
import { loadablePortfolioPositionsAtom } from "@/store/portfolio/portfolio";
import { PointRewardsManager } from "./points/point-rewards-manager";
import { useAccount } from "wagmi";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected } = useAccount();
  const { data, isLoading } = useAtomValue(loadablePortfolioPositionsAtom);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Rewards
      </PrimaryLabel>

      <div className="mt-6">
        {!isConnected ? (
          <AlertIndicator>Connect wallet to view your rewards</AlertIndicator>
        ) : isLoading ? (
          <LoadingIndicator className="h-5 w-5" />
        ) : (
          <div className="flex flex-col gap-6">
            {data?.incentiveTokens && data.incentiveTokens.length > 0 && (
              <div>
                <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                  TOKENS
                </SecondaryLabel>

                <TokenRewardsManager data={data?.incentiveTokens ?? []} />
              </div>
            )}

            {((data?.unclaimedPointTokens &&
              data.unclaimedPointTokens.length > 0) ||
              (data?.claimedPointTokens &&
                data.claimedPointTokens.length > 0)) && (
              <div>
                <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                  POINTS
                </SecondaryLabel>

                <PointRewardsManager
                  data={[
                    ...(data?.unclaimedPointTokens?.map((token) => ({
                      ...token,
                      isClaimed: false,
                    })) ?? []),
                    ...(data?.claimedPointTokens?.map((token) => ({
                      ...token,
                      isClaimed: true,
                      claimInfo: {},
                      isUnlocked: true,
                    })) ?? []),
                  ]}
                />
              </div>
            )}

            {data?.incentiveTokens &&
              data.incentiveTokens.length === 0 &&
              data?.unclaimedPointTokens &&
              data.unclaimedPointTokens.length === 0 &&
              data?.claimedPointTokens &&
              data.claimedPointTokens.length === 0 && (
                <AlertIndicator className="mt-8 rounded-sm border border-_divider_ py-10">
                  <span className="text-base">No rewards found</span>
                </AlertIndicator>
              )}
          </div>
        )}
      </div>
    </div>
  );
});
