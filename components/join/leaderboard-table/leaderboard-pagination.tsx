"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

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
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25,
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
  }
>(({ className, motionProps, ...props }, ref) => {
  return (
    <Button
      variant={"outline"}
      ref={ref}
      {...props}
      className={cn(
        "flex h-8 w-fit flex-row items-center justify-center gap-1 px-2 hover:bg-focus",
        className
      )}
    />
  );
});

export const LeaderboardPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    count: number;
    page?: {
      index: number;
      total: number;
      size: number;
    };
    setPage: (page: number) => void;
  }
>(
  (
    {
      className,
      page = {
        index: 1,
        total: 1,
        size: 20,
      },
      count = 0,
      setPage,
      ...props
    },
    ref
  ) => {
    const canPrevPage = page.index > 1;
    const canNextPage = page.index < page.total;

    const handlePrevPage = () => {
      if (canPrevPage) {
        setPage(page.index - 1);
      }
    };

    const handleNextPage = () => {
      if (canNextPage) {
        setPage(page.index + 1);
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex h-fit w-full flex-col items-center justify-center px-2 py-4",
          className
        )}
      >
        <div className="flex h-fit flex-row items-center gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {canPrevPage && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:prev`}
                layoutId={`pagination-button:prev:${page.index - 1}`}
              >
                <PaginationButton
                  className="border-none bg-z2 shadow-none"
                  onClick={(e) => {
                    handlePrevPage();
                    e.preventDefault();
                  }}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                  Prev
                </PaginationButton>
              </PaginationButtonMotionWrapper>
            )}

            {canPrevPage && page.index - 1 > 1 && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:prev:dots`}
                layoutId={`pagination-button:prev:dots`}
              >
                ...
              </PaginationButtonMotionWrapper>
            )}

            {canPrevPage && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:${page.index - 1}`}
                layoutId={`pagination-button:${page.index - 1}`}
              >
                <PaginationButton
                  onClick={(e) => {
                    handlePrevPage();
                    e.preventDefault();
                  }}
                >
                  {page.index - 1}
                </PaginationButton>
              </PaginationButtonMotionWrapper>
            )}

            <PaginationButtonMotionWrapper
              key={`pagination-button:${page.index}`}
              layoutId={`pagination-button:${page.index}`}
            >
              <PaginationButton className="bg-focus">
                {page.index}
              </PaginationButton>
            </PaginationButtonMotionWrapper>

            {canNextPage && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:${page.index + 1}`}
                layoutId={`pagination-button:${page.index + 1}`}
              >
                <PaginationButton
                  onClick={(e) => {
                    handleNextPage();
                    e.preventDefault();
                  }}
                >
                  {page.index + 1}
                </PaginationButton>
              </PaginationButtonMotionWrapper>
            )}

            {canNextPage && page.index + 1 < page.total && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:next:dots`}
                layoutId={`pagination-button:next:dots`}
              >
                ...
              </PaginationButtonMotionWrapper>
            )}

            {canNextPage && (
              <PaginationButtonMotionWrapper
                key={`pagination-button:next`}
                layoutId={`pagination-button:next:${page.index + 1}`}
              >
                <PaginationButton
                  className="border-none bg-z2 shadow-none"
                  onClick={(e) => {
                    handleNextPage();
                    e.preventDefault();
                  }}
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5" />
                </PaginationButton>
              </PaginationButtonMotionWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);
