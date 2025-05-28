"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAtom, useAtomValue } from "jotai";
import {
  marketPageAtom,
  loadableExploreMarketAtom,
} from "@/store/explore/explore-market";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { ExploreMarketTable } from "./explore-market-table";
import { ExploreMarketPagination } from "./explore-market-pagination";

export const ExploreMarketManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [page, setPage] = useAtom(marketPageAtom);

  const {
    data: propsData,
    isLoading,
    isRefetching,
    isError,
  } = useAtomValue(loadableExploreMarketAtom);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-5">
        <LoadingCircle />
      </div>
    );
  }

  if (isError || propsData?.count === 0) {
    return (
      <AnimatePresence mode="sync">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-80 flex-col place-content-center items-center gap-2 rounded-2xl border border-divider bg-white p-5 text-lg text-secondary"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-badge-alert h-14 w-14 text-secondary"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 1 }}
          >
            <motion.path
              initial={{ pathLength: 0, pathOffset: -1 }}
              animate={{ pathLength: 1, pathOffset: 0 }}
              exit={{ pathLength: 0, pathOffset: -1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
            />
            <motion.line
              initial={{ pathLength: 0, pathOffset: -1 }}
              animate={{ pathLength: 1, pathOffset: 0 }}
              exit={{ pathLength: 0, pathOffset: -1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              x1="12"
              x2="12"
              y1="8"
              y2="12"
            />
            <motion.line
              initial={{ pathLength: 0, pathOffset: -1 }}
              animate={{ pathLength: 1, pathOffset: 0 }}
              exit={{ pathLength: 0, pathOffset: -1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              x1="12"
              x2="12.01"
              y1="16"
              y2="16"
            />
          </motion.svg>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="heading-2 mt-2 text-secondary"
          >
            No Markets Found.
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div ref={ref} {...props} className={cn("w-full ", className)}>
      <ScrollArea
        className={cn(
          "w-full overflow-hidden rounded-2xl border border-divider bg-white"
        )}
      >
        <ExploreMarketTable
          data={propsData?.data ? propsData.data : []}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ExploreMarketPagination
        className="mt-3"
        pageIndex={page}
        totalPages={propsData?.page?.total || 1}
        setPageIndex={setPage}
      />
    </div>
  );
});
