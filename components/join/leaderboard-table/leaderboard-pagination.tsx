"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { LeaderboardStats } from "../leaderboard-stats";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoyaltyFormSchema } from "../royalty-form/royality-form-schema";
import { z } from "zod";
import { useGlobalStates } from "@/store";
import { useTotalWalletsBalance } from "../hooks";
import { isEqual } from "lodash";
import { LeaderboardManager } from "../leaderboard-table";
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
        "flex h-fit w-full flex-col items-center justify-center px-2 py-4",
        className
      )}
    >
      <div className="flex h-fit flex-row items-center gap-3">
        <AnimatePresence mode="popLayout">
          {canPrevPage && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:prev`}
              layoutId={`pagination-button:prev:${page - 1}`}
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
              >
                {page}
              </PaginationButton>
            </PaginationButtonMotionWrapper>
          )}

          <PaginationButtonMotionWrapper
            key={`pagination-button:${page + 1}`}
            layoutId={`pagination-button:${page + 1}`}
          >
            <PaginationButton className="bg-focus">{page + 1}</PaginationButton>
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

          {canNextPage && (
            <PaginationButtonMotionWrapper
              key={`pagination-button:next`}
              layoutId={`pagination-button:next:${page + 1}`}
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
});
