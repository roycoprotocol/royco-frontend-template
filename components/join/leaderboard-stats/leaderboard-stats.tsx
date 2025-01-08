"use client";

import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useLeaderboardStats } from "royco/hooks";
import { useImmer } from "use-immer";

export const LeaderboardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [placeholderLeaderboardStats, setPlaceholderLeaderboardStats] =
    useImmer<
      Array<
        | {
            users: number | null | undefined;
            balance: number | null | undefined;
          }
        | null
        | undefined
      >
    >([null, null]);

  const propsLeaderboardStats = useLeaderboardStats();

  useEffect(() => {
    if (
      propsLeaderboardStats.isLoading === false &&
      propsLeaderboardStats.isRefetching === false &&
      !isEqual(propsLeaderboardStats.data, placeholderLeaderboardStats[1])
    ) {
      setPlaceholderLeaderboardStats((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsLeaderboardStats.data)) {
            draft[0] = draft[1] as typeof propsLeaderboardStats.data; // Set previous data to the current data
            draft[1] =
              propsLeaderboardStats.data as typeof propsLeaderboardStats.data; // Set current data to the new data
          }
        });
      });
    }
  }, [
    propsLeaderboardStats.isLoading,
    propsLeaderboardStats.isRefetching,
    propsLeaderboardStats.data,
  ]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "grid h-fit w-full grid-rows-2 divide-y divide-divider border-t border-divider md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-y-0"
      )}
    >
      <div className="flex h-32 flex-col items-center justify-center p-7 md:p-9">
        {propsLeaderboardStats.isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          <Fragment>
            <h4 className="text-4xl font-normal text-black">
              <SpringNumber
                previousValue={placeholderLeaderboardStats[0]?.users || 0}
                currentValue={placeholderLeaderboardStats[1]?.users || 0}
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
        {propsLeaderboardStats.isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          <Fragment>
            <h4 className="text-right text-4xl font-normal text-black">
              <SpringNumber
                previousValue={placeholderLeaderboardStats[0]?.balance || 0}
                currentValue={placeholderLeaderboardStats[1]?.balance || 0}
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
