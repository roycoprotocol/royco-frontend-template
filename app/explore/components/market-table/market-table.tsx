"use client";

"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import { useImmer } from "use-immer";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAtom, useAtomValue } from "jotai";
import {
  explorePageAtom,
  loadableExploreMarketAtom,
} from "@/store/explore/atoms";
import { ExploreMarketResponse } from "@/app/api/royco/data-contracts";
import { MarketNotFound } from "./market-not-found";
import { ExploreMarketTable } from "./explore-market-table";
import { LoadingIndicator } from "@/app/_components/common/connect-wallet-button/loading-indicator";
import { ExploreMarketPagination } from "./explore-market-pagination";

export const MarketTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [page, setPage] = useAtom(explorePageAtom);

  const {
    data: propsData,
    isLoading,
    isRefetching,
    isError,
  } = useAtomValue(loadableExploreMarketAtom);

  const [placeholderData, setPlaceholderData] = useImmer<
    Array<ExploreMarketResponse | undefined>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsData, placeholderData[1]) && !!propsData) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsData)) {
            draft[0] = draft[1]; // Set previous data to the current data
            draft[1] = propsData; // Set current data to the new data
          }
        });
      });
    }
  }, [propsData]);

  if (!placeholderData[1]) {
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

  const data = placeholderData[1]?.data ? placeholderData[1].data : [];

  console.log({ data });

  return (
    <div ref={ref} {...props} className={cn("w-full ", className)}>
      <ScrollArea
        className={cn(
          "w-full overflow-hidden rounded-sm border border-_divider_ bg-white"
        )}
      >
        <ExploreMarketTable
          data={placeholderData[1]?.data ? placeholderData[1].data : []}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ExploreMarketPagination
        className="mb-5 mt-2"
        pageIndex={page}
        totalPages={placeholderData[1]?.page?.total || 1}
        setPageIndex={setPage}
      />
    </div>
  );
});
