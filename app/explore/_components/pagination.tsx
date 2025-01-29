"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useExplore, useGlobalStates } from "@/store";
import { useEnrichedMarkets } from "royco/hooks";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export const Pagination = () => {
  const {
    exploreSort: sorting,
    exploreFilters: filters,
    exploreSearch: searchKey,
    explorePageIndex: pageIndex,
    exploreCustomPoolParams: customPoolParams,
    setExplorePageIndex: setPageIndex,
    exploreIsVerified: isVerified,
  } = useExplore();

  const pathname = usePathname();
  const showVerifiedMarket = useMemo(
    () => (pathname === "/" ? true : false),
    [pathname]
  );

  const { customTokenData } = useGlobalStates();

  const { count, isLoading } = useEnrichedMarkets({
    sorting,
    filters,
    page_index: pageIndex,
    search_key: searchKey,
    is_verified: showVerifiedMarket ? true : isVerified,
    custom_token_data: customTokenData,
  });

  const totalPages = Math.ceil((count ?? 0) / 20); // marketPerPage = 20

  /**
   * @description Page availability checkers
   */
  const getCanNextPage = () => {
    return pageIndex < totalPages - 1;
  };
  const getCanPrevPage = () => {
    return pageIndex > 0;
  };
  const prevPage = () => {
    if (getCanPrevPage()) {
      setPageIndex(pageIndex - 1);
    }
  };
  const nextPage = () => {
    if (getCanNextPage()) {
      setPageIndex(pageIndex + 1);
    }
  };

  /**
   * @description Pagination UI
   */
  if (totalPages !== 0 && !isLoading) {
    return (
      <div className="flex w-full shrink-0 flex-row items-center justify-between">
        {/**
         * @position left
         * @description Current page indicator
         */}
        <Button className="h-full w-fit rounded-xl px-3">
          <span className="text-sm">
            Page {pageIndex + 1} of {totalPages}
          </span>
        </Button>

        {/* <div className="caption flex h-full shrink-0 items-center rounded-lg border border-divider bg-white px-3 text-secondary">
          <span className="leading-8">
            Page {pageIndex + 1} of {totalPages}
          </span>
        </div> */}

        {/**
         * @position right
         * @description Navigation buttons, left and right
         */}
        <div className="flex flex-row items-center gap-2">
          {/**
           * @description Previous page button
           */}
          {getCanPrevPage() && (
            <Button
              disabled={!getCanPrevPage()}
              onClick={prevPage}
              className="rounded-xl px-2"
              // className={cn(
              //   "flex h-8 w-8 flex-col place-content-center items-center rounded-lg border border-divider bg-white transition-all duration-200 ease-in-out",
              //   getCanPrevPage()
              //     ? "cursor-pointer text-secondary hover:bg-focus"
              //     : "cursor-not-allowed text-tertiary opacity-40"
              // )}
            >
              <ChevronLeftIcon
                strokeWidth={1.5}
                className="h-6 w-6 p-[0.15rem]"
              />
            </Button>
          )}

          {/**
           * @description Next page button
           */}
          <Button
            disabled={!getCanNextPage()}
            onClick={nextPage}
            className="rounded-xl pl-4 pr-2"
          >
            <span className="text-sm">View More Markets</span>
            <ChevronRightIcon
              strokeWidth={1.5}
              className="h-6 w-6 p-[0.15rem]"
            />
          </Button>

          {/* <Button
            disabled={!getCanNextPage()}
            onClick={nextPage}
            className={cn(
              "flex h-8 w-8 flex-col place-content-center items-center rounded-lg border border-divider bg-white transition-all duration-200 ease-in-out",
              getCanNextPage()
                ? "cursor-pointer text-secondary hover:bg-focus"
                : "cursor-not-allowed text-tertiary opacity-40"
            )}
          >
            <ChevronRightIcon
              strokeWidth={1.5}
              className="h-8 w-8 p-[0.15rem]"
            />
          </Button> */}
        </div>
      </div>
    );
  }
};
