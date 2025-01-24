"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { HTMLMotionProps } from "framer-motion";

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    motionProps?: HTMLMotionProps<"div">;
    disabled?: boolean;
  }
>(({ className, motionProps, disabled, ...props }, ref) => {
  return (
    <Button
      disabled={disabled}
      variant={"outline"}
      ref={ref}
      {...props}
      className={cn(
        "flex h-7 w-7 flex-row items-center justify-center gap-1 border border-divider hover:bg-focus",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    />
  );
});

export const TablePagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    page: number;
    page_size: number;
    count: number;
    setPage: (page: number) => void;
  }
>(({ className, page, page_size, count, setPage, ...props }, ref) => {
  const total_pages = Math.ceil(count / page_size);

  const canPrevPage = page > 0;
  const canNextPage = page < total_pages - 1;

  const handlePrevPage = () => {
    if (canPrevPage) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (canNextPage) {
      setPage(page + 1);
    }
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex h-fit w-full shrink-0 flex-row items-center justify-between px-5 py-2 text-sm",
        className
      )}
    >
      <div className="text-secondary">
        Page {page + 1} of {total_pages}
      </div>
      <div className="flex h-fit flex-row items-center gap-3">
        <PaginationButton
          disabled={!canPrevPage}
          aria-disabled={!canPrevPage}
          className="border-none bg-z2 shadow-none"
          onClick={(e) => {
            handlePrevPage();
            e.preventDefault();
          }}
        >
          <ChevronLeftIcon className="h-5 w-5 stroke-secondary" />
        </PaginationButton>

        <PaginationButton
          disabled={!canNextPage}
          aria-disabled={!canNextPage}
          className="border-none bg-z2 shadow-none"
          onClick={(e) => {
            handleNextPage();
            e.preventDefault();
          }}
        >
          <ChevronRightIcon className="h-5 w-5 stroke-secondary" />
        </PaginationButton>
      </div>
    </div>
  );
});
