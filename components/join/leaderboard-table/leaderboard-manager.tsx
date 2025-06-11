"use client";

import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useLeaderboard, useLeaderboardStats } from "royco/hooks";
import { useImmer } from "use-immer";
import { LeaderboardTable } from "./leaderboard-table";
import {
  LeaderboardColumnDataElement,
  leaderboardColumns,
} from "./leaderboard-columns";
import { LoadingSpinner } from "@/components/composables";
import { LeaderboardPagination } from "./leaderboard-pagination";
import { useInterval } from "../hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/royco";
import { defaultQueryOptions } from "@/utils/query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { LoadingCircle } from "@/components/animations/loading-circle";

export const LeaderboardManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "leaderboard",
      {
        page,
      },
    ],
    queryFn: () => {
      return api.userControllerGetUserLeaderboard({
        page: {
          index: page,
          size: 20,
        },
      });
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: keepPreviousData,
  });

  const [placeholderLeaderboard, setPlaceholderLeaderboard] = useImmer<
    Array<LeaderboardColumnDataElement>
  >([]);

  const table = useReactTable({
    data: placeholderLeaderboard,
    columns: leaderboardColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (data?.data?.data) {
      setPlaceholderLeaderboard(
        data.data.data.map((d) => ({
          ...d,
          prevBalanceUsd: d.balanceUsd,
        })) ?? []
      );
    }
  }, [data?.data?.data]);

  const simulateBalanceIncrease = () => {
    setPlaceholderLeaderboard((draft) => {
      if (!draft || draft.length === 0) {
        return;
      }

      // Randomly select how many rows to update (1 to 3)
      const numRowsToUpdate = Math.floor(Math.random() * draft.length) + 1;

      for (let i = 0; i < numRowsToUpdate; i++) {
        const rowIndex = Math.floor(Math.random() * draft.length);
        const currentBalance = draft[rowIndex].balanceUsd || 0;

        // Calculate max allowed increase to maintain order
        let maxIncrease = Number.MAX_VALUE;
        if (rowIndex > 0) {
          const prevRowBalance = draft[rowIndex - 1].prevBalanceUsd || 0;
          maxIncrease = prevRowBalance - currentBalance - 0.01;
        }

        // Generate random increase (0.01 to maxIncrease or 100, whichever is smaller)
        const increase = Math.random() * Math.min(maxIncrease, 100) + 0.01;
        draft[rowIndex].balanceUsd = currentBalance + increase;
        draft[rowIndex].prevBalanceUsd = currentBalance;
      }
    });
  };

  // Add interval to update balances
  useInterval(simulateBalanceIncrease, 1000);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingCircle size={20} />
      </div>
    );
  }

  return (
    <div ref={ref} {...props} className={cn("w-full", className)}>
      <LeaderboardTable
        data={placeholderLeaderboard}
        table={table}
        className="w-full"
      />

      {/* <div className="h-[1px] w-full bg-divider" /> */}

      <LeaderboardPagination
        page={{
          index: page,
          size: 20,
          total: data?.data?.count || 0,
        }}
        count={data?.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
