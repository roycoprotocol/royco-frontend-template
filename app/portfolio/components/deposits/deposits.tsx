"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { loadablePortfolioPositionsAtom } from "@/store/portfolio/portfolio";
import { DepositTable } from "./deposit-table";
import { depositColumns } from "./deposit-column";
import { DepositPagination } from "./deposit-pagination";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DEFAULT_PAGE_SIZE = 5;

export const Deposits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(loadablePortfolioPositionsAtom);

  const [page, setPage] = useState(0);

  const depositPositions = useMemo(() => {
    if (data?.positions) {
      return data.positions.slice(
        page * DEFAULT_PAGE_SIZE,
        (page + 1) * DEFAULT_PAGE_SIZE
      );
    }
    return [];
  }, [data?.positions, page]);

  const count = data?.positions?.length || 0;

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      {/**
       * Total Deposits
       */}
      <div className="mt-6">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 font-fragmentMono text-2xl font-normal">
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(data?.depositBalanceUsd || 0, {
                type: "currency",
              })}
            </span>
          </div>
        </PrimaryLabel>
      </div>

      <div className="mt-6">
        <ScrollArea className={cn("mt-6 w-full overflow-hidden")}>
          <DepositTable data={depositPositions} columns={depositColumns} />

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DepositPagination
          page={page}
          pageSize={DEFAULT_PAGE_SIZE}
          count={count}
          setPage={setPage}
        />
      </div>
    </div>
  );
});
