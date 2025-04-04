"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const PaginationButtonMotionWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <motion.div
      layout="position"
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      ref={ref}
      {...props}
    >
      {children}
    </motion.div>
  );
});

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    motionProps?: HTMLMotionProps<"div">;
    disabled?: boolean;
  }
>(({ className, motionProps, disabled, ...props }, ref) => {
  return (
    <Button
      variant={"outline"}
      ref={ref}
      {...props}
      className={cn(
        "flex h-8 w-fit flex-row items-center justify-center gap-1 px-2 shadow-none",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
    />
  );
});

export const WithdrawalPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    page: number;
    pageSize: number;
    count: number;
    setPage: (page: number) => void;
  }
>(({ className, page, pageSize, count, setPage, ...props }, ref) => {
  const total_pages = Math.ceil(count / pageSize);

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
        "flex h-fit w-full items-center justify-center px-6 py-3 md:justify-between",
        className
      )}
    >
      <SecondaryLabel className="hidden md:block">
        {`${page * pageSize + 1} - ${Math.min(
          (page + 1) * pageSize,
          count
        )} of ${count} Transactions`}
      </SecondaryLabel>

      <div className="flex h-fit flex-row items-center gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <PaginationButtonMotionWrapper
            key={`pagination-button:prev`}
            layoutId={`pagination-button:prev:${page - 1}`}
          >
            <PaginationButton
              className="border-none hover:bg-z2"
              onClick={(e) => {
                handlePrevPage();
                e.preventDefault();
              }}
              disabled={!canPrevPage}
            >
              <ChevronLeftIcon className="h-4 w-4 text-primary" />
              <PrimaryLabel className="text-sm">Previous</PrimaryLabel>
            </PaginationButton>
          </PaginationButtonMotionWrapper>

          {canPrevPage && page - 1 > 0 && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:prev:dots`}
              layoutId={`pagination-button:prev:dots`}
            >
              ...
            </PaginationButtonMotionWrapper>
          )}

          {canPrevPage && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:${page}`}
              layoutId={`pagination-button:${page}`}
            >
              <PaginationButton
                onClick={(e) => {
                  handlePrevPage();
                  e.preventDefault();
                }}
                className="h-8 w-8 border-none"
              >
                {page}
              </PaginationButton>
            </PaginationButtonMotionWrapper>
          )}

          <PaginationButtonMotionWrapper
            key={`pagination-button:${page + 1}`}
            layoutId={`pagination-button:${page + 1}`}
          >
            <PaginationButton className="h-8 w-8">{page + 1}</PaginationButton>
          </PaginationButtonMotionWrapper>

          {canNextPage && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:${page + 2}`}
              layoutId={`pagination-button:${page + 2}`}
            >
              <PaginationButton
                onClick={(e) => {
                  handleNextPage();
                  e.preventDefault();
                }}
                className="h-8 w-8 border-none"
              >
                {page + 2}
              </PaginationButton>
            </PaginationButtonMotionWrapper>
          )}

          {canNextPage && page + 2 < total_pages && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:next:dots`}
              layoutId={`pagination-button:next:dots`}
            >
              ...
            </PaginationButtonMotionWrapper>
          )}

          <PaginationButtonMotionWrapper
            key={`pagination-button:next`}
            layoutId={`pagination-button:next:${page + 1}`}
          >
            <PaginationButton
              className="border-none hover:bg-z2"
              onClick={(e) => {
                handleNextPage();
                e.preventDefault();
              }}
              disabled={!canNextPage}
            >
              <PrimaryLabel className="text-sm">Next</PrimaryLabel>
              <ChevronRightIcon className="h-4 w-4 text-primary" />
            </PaginationButton>
          </PaginationButtonMotionWrapper>
        </AnimatePresence>
      </div>
    </div>
  );
});
