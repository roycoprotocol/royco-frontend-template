"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAtom, useAtomValue } from "jotai";
import {
  marketPageAtom,
  loadableExploreMarketAtom,
} from "@/store/explore/explore-market";
import { NotFoundWarning } from "../../common/not-found-warning";
import { ExploreMarketTable } from "./explore-market-table";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { ExploreMarketPagination } from "./explore-market-pagination";
import { useMixpanel } from "@/services/mixpanel";

export const MarketTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { trackExploreMarketViewed } = useMixpanel();
  const [page, setPage] = useAtom(marketPageAtom);

  const {
    data: propsData,
    isLoading,
    isError,
  } = useAtomValue(loadableExploreMarketAtom);

  useEffect(() => {
    trackExploreMarketViewed({
      page_index: page,
    });
  }, [page]);

  if (isLoading && !propsData) {
    return (
      <div className="w-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || propsData?.count === 0) {
    return (
      <div className="w-full">
        <NotFoundWarning title="No Markets Found." />
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
