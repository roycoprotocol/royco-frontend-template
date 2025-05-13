"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAtom, useAtomValue } from "jotai";
import {
  marketPageAtom,
  loadableExploreMarketAtom,
} from "@/store/explore/explore-market";
import { MarketNotFound } from "./market-not-found";
import { ExploreMarketTable } from "./explore-market-table";
import { LoadingIndicator } from "@/app/_components/common/connect-wallet-button/loading-indicator";
import { ExploreMarketPagination } from "./explore-market-pagination";

export const MarketTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [page, setPage] = useAtom(marketPageAtom);

  const {
    data: propsData,
    isLoading,
    isError,
  } = useAtomValue(loadableExploreMarketAtom);

  if (isLoading && !propsData) {
    return (
      <div className="flex flex-col items-center p-20">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || propsData?.count === 0) {
    return (
      <div className="w-full">
        <MarketNotFound />
      </div>
    );
  }

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <ScrollArea
        className={cn(
          "w-full overflow-hidden rounded-sm border border-_divider_ bg-_surface_"
        )}
      >
        <ExploreMarketTable
          data={propsData?.data || []}
          isLoading={isLoading}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ExploreMarketPagination
        className="mt-2"
        pageIndex={page}
        totalPages={propsData?.page?.total || 1}
        setPageIndex={setPage}
      />
    </div>
  );
});
