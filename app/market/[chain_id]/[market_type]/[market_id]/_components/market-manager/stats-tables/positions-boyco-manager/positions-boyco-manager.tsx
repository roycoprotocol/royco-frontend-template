"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PositionsBoycoTable } from "./positions-boyco-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import { MarketUserType, useMarketManager } from "@/store";
import {
  loadableBoycoPositionsAtom,
  boycoPositionsPageIndexAtom,
} from "@/store/market";
import { useAtom, useAtomValue } from "jotai";
import { AlertIndicator } from "@/components/common";
import { LoadingCircle } from "@/components/animations/loading-circle";

export const PositionsBoycoManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userType } = useMarketManager();

  const {
    data: propsData,
    isLoading,
    isRefetching,
  } = useAtomValue(loadableBoycoPositionsAtom);
  const [page, setPage] = useAtom(boycoPositionsPageIndexAtom);

  if (userType === MarketUserType.ip.id) {
    return <AlertIndicator>Not Applicable</AlertIndicator>;
  }

  if (!propsData) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full grow flex-col divide-y divide-divider overflow-y-hidden",
        className
      )}
    >
      <ScrollArea
        className={cn(
          "relative w-full grow",
          isRefetching && "duration-5000 animate-pulse ease-in-out"
        )}
      >
        <PositionsBoycoTable
          data={propsData?.data ?? []}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={propsData?.page}
        setPage={(page) => {
          setPage(page);
        }}
        isRefetching={isRefetching}
      />
    </div>
  );
});
