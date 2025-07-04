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
      <Button className="w-fit rounded-sm px-3 text-sm">
        Page {pageIndex} of {totalPages}
      </Button>

      <div className="flex w-fit flex-row items-center gap-2">
        {canPrevPage && (
          <Button
            disabled={!canPrevPage}
            onClick={handlePrevPage}
            className="w-fit rounded-sm px-2"
          >
            <ChevronLeftIcon
              strokeWidth={1.5}
              className="h-6 w-6 p-[0.15rem]"
            />
          </Button>
        )}

        <Button
          disabled={!canNextPage}
          onClick={handleNextPage}
          className="w-fit rounded-sm pl-4 pr-2"
        >
          <span className="text-sm">View More Markets</span>
          <ChevronRightIcon strokeWidth={1.5} className="h-6 w-6 p-[0.15rem]" />
        </Button>
      </div>
    </div>
  );
});
