"use client";

import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useLeaderboard, useLeaderboardStats } from "royco/hooks";
import { useImmer } from "use-immer";
import { LeaderboardTable } from "./leaderboard-table";
import { leaderboardColumns } from "./leaderboard-columns";
import { LoadingSpinner } from "@/components/composables";
import { LeaderboardPagination } from "./leaderboard-pagination";
import { useInterval } from "../hooks";

export const LeaderboardManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const page_size = 20;
  const [page, setPage] = useState(0);

  const propsLeaderboard = useLeaderboard({
    page,
    page_size,
  });

  const [placeholderLeaderboard, setPlaceholderLeaderboard] = useImmer<
    Array<ReturnType<typeof useLeaderboard>["data"]>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsLeaderboard.data, placeholderLeaderboard[1])) {
      setPlaceholderLeaderboard((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsLeaderboard.data)) {
            draft[0] = draft[1] as typeof propsLeaderboard.data; // Set previous data to the current data
            draft[1] = propsLeaderboard.data as typeof propsLeaderboard.data; // Set current data to the new data
          }
        });
      });
    }
  }, [propsLeaderboard.data]);

  const simulateBalanceIncrease = () => {
    setPlaceholderLeaderboard((draft) => {
      if (
        !draft[1]?.data ||
        !Array.isArray(draft[1].data) ||
        draft[1].data.length === 0
      )
        return draft;

      // Store current data as previous
      draft[0] = JSON.parse(JSON.stringify(draft[1]));

      // Create new data with random increases
      const newData = { ...draft[1] };
      if (!newData.data) return draft;

      const dataArray = newData.data;

      // Randomly select how many rows to update (1 to 3)
      const numRowsToUpdate = Math.floor(Math.random() * dataArray.length) + 1;

      for (let i = 0; i < numRowsToUpdate; i++) {
        const rowIndex = Math.floor(Math.random() * dataArray.length);
        const currentBalance = parseFloat(
          String(dataArray[rowIndex].balance || "0")
        );

        // Calculate max allowed increase to maintain order
        let maxIncrease = Number.MAX_VALUE;
        if (rowIndex > 0) {
          const prevRowBalance = parseFloat(
            String(dataArray[rowIndex - 1].balance || "0")
          );
          maxIncrease = prevRowBalance - currentBalance - 0.01;
        }

        // Generate random increase (0.01 to maxIncrease or 100, whichever is smaller)
        const increase = Math.random() * Math.min(maxIncrease, 100) + 0.01;
        dataArray[rowIndex].balance = currentBalance + increase;
      }

      newData.data = dataArray;
      draft[1] = newData;
    });
  };

  // Add interval to update balances
  useInterval(simulateBalanceIncrease, 1000);

  if (propsLeaderboard.isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div ref={ref} {...props} className={cn("w-full", className)}>
      <LeaderboardTable
        data={
          placeholderLeaderboard[1]?.data
            ? placeholderLeaderboard[1].data.map((item, index) => ({
                ...item,
                prev:
                  placeholderLeaderboard[0] &&
                  Array.isArray(placeholderLeaderboard[0].data) &&
                  index < placeholderLeaderboard[0].data.length
                    ? placeholderLeaderboard[0].data[index]
                    : null,
              }))
            : []
        }
        columns={leaderboardColumns}
      />

      {/* <div className="h-[1px] w-full bg-divider" /> */}

      <LeaderboardPagination
        page={page}
        page_size={page_size}
        count={propsLeaderboard.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
