"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PositionsRecipeTable } from "./positions-recipe-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MarketUserType, useMarketManager } from "@/store";
import { loadableRecipePositionsAtom } from "@/store/market";
import { useAtom, useAtomValue } from "jotai";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { TablePagination } from "../composables/table-pagination";
import { recipePositionsPageIndexAtom } from "@/store/market";
import { AlertIndicator } from "@/components/common";

export const PositionsRecipeManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userType } = useMarketManager();

  const {
    data: propsData,
    isLoading,
    isRefetching,
  } = useAtomValue(loadableRecipePositionsAtom);
  const [page, setPage] = useAtom(recipePositionsPageIndexAtom);

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
        <PositionsRecipeTable
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
