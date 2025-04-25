"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExploreMarketPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    pageIndex: number;
    totalPages: number;
    setPageIndex: (pageIndex: number) => void;
  }
>(({ className, pageIndex, totalPages, setPageIndex, ...props }, ref) => {
  const canPrevPage = pageIndex > 1;
  const canNextPage = pageIndex < totalPages;

  const handlePrevPage = () => {
    if (canPrevPage) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1);
    }
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full shrink-0 flex-row items-center justify-between",
        className
      )}
    >
      {/**
       * @position left
       * @description Current page indicator
       */}
      <Button className="h-full w-fit rounded-xl px-3">
        <span className="text-sm">
          Page {pageIndex} of {totalPages}
        </span>
      </Button>

      {/**
       * @position right
       * @description Navigation buttons, left and right
       */}
      <div className="flex flex-row items-center gap-2">
        {/**
         * @description Previous page button
         */}
        {canPrevPage && (
          <Button
            disabled={!canPrevPage}
            onClick={handlePrevPage}
            className="rounded-xl px-2"
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
          disabled={!canNextPage}
          onClick={handleNextPage}
          className="rounded-xl pl-4 pr-2"
        >
          <span className="text-sm">View More Markets</span>
          <ChevronRightIcon strokeWidth={1.5} className="h-6 w-6 p-[0.15rem]" />
        </Button>
      </div>
    </div>
  );
});
