"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useEnrichedPositionsRecipe } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { StatsDataTable } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/stats-tables/stats-data-table";
import { positionsRecipeColumns } from "./postions-recipe-table-columns";
import { motion } from "framer-motion";
import { MarketUserType } from "@/store";

export const PositionsRecipeTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketType: string;
    userType: string;
  }
>(({ className, marketType, userType, ...props }, ref) => {
  const { address } = useAccount();

  const [pageIndex, setPageIndex] = useState(0);

  const { isLoading, data, isError } = useEnrichedPositionsRecipe({
    chain_id: undefined,
    market_id: undefined,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: pageIndex,
    filters: [
      {
        id: "offer_side",
        value:
          userType === MarketUserType.ap.id
            ? MarketUserType.ap.value
            : MarketUserType.ip.value,
      },
    ],
  });

  let totalCount = data && "count" in data ? (data.count ? data.count : 0) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] w-full grow flex-col place-content-center items-center justify-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (totalCount === 0) {
    return (
      <div className="flex min-h-[300px] w-full grow flex-col place-content-center items-center justify-center">
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
          No positions found
        </motion.div>
      </div>
    );
  } else {
    return (
      <StatsDataTable
        pagination={{
          currentPage: pageIndex,
          totalPages: Math.ceil(totalCount / 20),
          setPage: setPageIndex,
        }}
        columns={positionsRecipeColumns}
        data={data && data.data ? data.data : []}
      />
    );
  }
});
