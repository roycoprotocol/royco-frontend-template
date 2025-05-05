"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { AlertIndicator } from "@/components/common";
import { useAtomValue } from "jotai";
import { portfolioPositionsAtom } from "@/store/portfolio/portfolio";
import { TokenRewardsTable } from "./tokens/token-rewards-table";
import { tokenRewardsColumns } from "./tokens/token-rewards-column";
import { DEFAULT_PAGE_SIZE } from "../deposits/deposits";
import { TokenRewardsPagination } from "./tokens/token-rewards-pagination";
import { pointRewardsColumns } from "./points/point-rewards-column";
import { PointRewardsTable } from "./points/point-rewards-table";
import { PointRewardsPagination } from "./points/point-rewards-pagination";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(portfolioPositionsAtom);

  const tokenIncentives = useMemo(() => {
    return {
      data: data?.incentiveTokens || [],
    };
  }, [data]);

  const [tokenRewardsPage, setTokenRewardsPage] = useState(0);
  const tokenRewards = useMemo(() => {
    if (tokenIncentives.data) {
      return tokenIncentives.data.slice(
        tokenRewardsPage * DEFAULT_PAGE_SIZE,
        (tokenRewardsPage + 1) * DEFAULT_PAGE_SIZE
      );
    }
    return [];
  }, [tokenIncentives.data, tokenRewardsPage]);
  const tokenRewardsCount = tokenIncentives.data?.length || 0;

  const pointIncentives = useMemo(() => {
    const claimedPointIncentives =
      data?.claimedPointTokens?.map((item) => {
        return {
          ...item,
          isClaimed: true,
        };
      }) || [];
    const unclaimedPointIncentives = data?.unclaimedPointTokens || [];

    return {
      data: [...unclaimedPointIncentives, ...claimedPointIncentives],
    };
  }, [data]);

  const [pointRewardsPage, setPointRewardsPage] = useState(0);
  const pointRewards = useMemo(() => {
    if (pointIncentives.data) {
      return pointIncentives.data.slice(
        pointRewardsPage * DEFAULT_PAGE_SIZE,
        (pointRewardsPage + 1) * DEFAULT_PAGE_SIZE
      );
    }
    return [];
  }, [pointIncentives.data, pointRewardsPage]);
  const pointRewardsCount = pointIncentives.data?.length || 0;

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Rewards
      </PrimaryLabel>

      {/**
       * Token Rewards
       */}
      {tokenIncentives.data.length || pointIncentives.data.length ? (
        <div className="mt-8 flex flex-col gap-2">
          {tokenIncentives.data.length > 0 && (
            <div>
              <SecondaryLabel className="text-xs font-medium text-_secondary_">
                TOKENS
              </SecondaryLabel>

              <TokenRewardsTable
                data={tokenRewards}
                columns={tokenRewardsColumns}
              />

              <hr className="border-_divider_" />

              <TokenRewardsPagination
                page={tokenRewardsPage}
                pageSize={DEFAULT_PAGE_SIZE}
                setPage={setTokenRewardsPage}
                count={tokenRewardsCount}
              />
            </div>
          )}

          {pointIncentives.data.length > 0 && (
            <div>
              <SecondaryLabel className="text-xs font-medium text-_secondary_">
                POINTS
              </SecondaryLabel>

              <PointRewardsTable
                data={pointRewards}
                columns={pointRewardsColumns}
              />

              <hr className="border-_divider_" />

              <PointRewardsPagination
                page={pointRewardsPage}
                pageSize={DEFAULT_PAGE_SIZE}
                setPage={setPointRewardsPage}
                count={pointRewardsCount}
              />
            </div>
          )}
        </div>
      ) : (
        <AlertIndicator className="mt-8 rounded-sm border border-_divider_ py-10">
          <span className="text-base">No rewards available</span>
        </AlertIndicator>
      )}
    </div>
  );
});
