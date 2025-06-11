"use client";

import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { cn } from "@/lib/utils";
import { useGlobalStates } from "@/store";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useLeaderboardStats } from "royco/hooks";
import { useImmer } from "use-immer";
import { useInterval } from "../hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/royco";
import { defaultQueryOptions } from "@/utils/query";

export const LeaderboardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard-stats"],
    queryFn: async () => {
      return api.userControllerGetUserStats().then((res) => res.data);
    },
    ...defaultQueryOptions,
  });

  const [placeholderLeaderboardStats, setPlaceholderLeaderboardStats] =
    useImmer<{
      prevUsers: number;
      users: number;
      balanceUsd: number;
      prevBalanceUsd: number;
    }>({
      prevUsers: 0,
      users: 0,
      balanceUsd: 0,
      prevBalanceUsd: 0,
    });

  // Add simulation function
  const simulateBalanceIncrease = () => {
    setPlaceholderLeaderboardStats((draft) => {
      if (!draft.balanceUsd) return draft;

      // Store current data as previous
      draft.prevBalanceUsd = draft.balanceUsd;

      // Create new data with random increase
      const increase = Math.random() * 100 + 0.01;

      // Random increase between 0.01 and 100
      draft.balanceUsd = draft.balanceUsd + increase;
    });
  };

  // Add interval to update balances
  useInterval(simulateBalanceIncrease, 1000);

  useEffect(() => {
    if (data) {
      setPlaceholderLeaderboardStats((draft) => {
        draft.prevUsers = draft.users;
        draft.users = data.users;

        if (draft.balanceUsd !== 0 || draft.balanceUsd < data.balanceUsd) {
          draft.balanceUsd = data.balanceUsd;
        }
      });
    }
  }, [data]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "grid h-fit w-full grid-rows-2 divide-y divide-divider border-t border-divider md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-y-0"
      )}
    >
      <div className="flex h-32 flex-col items-center justify-center p-7 md:p-9">
        {isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          <Fragment>
            <h4 className="text-4xl font-normal text-black">
              <SpringNumber
                previousValue={placeholderLeaderboardStats.prevUsers || 0}
                currentValue={placeholderLeaderboardStats.users || 0}
                numberFormatOptions={{
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  useGrouping: true,
                }}
              />
            </h4>

            <div className="mt-1 text-sm font-light text-secondary">Users</div>
          </Fragment>
        )}
      </div>

      <div className="flex h-32 flex-col items-center justify-center p-7 md:p-9">
        {isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          <Fragment>
            <h4 className="text-right text-4xl font-normal text-black">
              <SpringNumber
                previousValue={placeholderLeaderboardStats.prevBalanceUsd || 0}
                currentValue={placeholderLeaderboardStats.balanceUsd || 0}
                numberFormatOptions={{
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                  useGrouping: true,
                  style: "currency",
                  currency: "USD",
                }}
              />
            </h4>

            <div className="mt-1 text-sm font-light text-secondary">
              User controlled assets
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
});
