"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { portfolioPositionsAtom } from "@/store/portfolio/portfolio";
import { ChevronsRight } from "lucide-react";
import { DepositTable } from "./deposit-table";
import { depositColumns } from "./deposit-column";
import { motion } from "framer-motion";
import { DepositPagination } from "./deposit-pagination";

export const DEFAULT_PAGE_SIZE = 5;

export const Deposits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(portfolioPositionsAtom);

  const tableRef = useRef<HTMLDivElement>(null);
  const [tableOverflow, setTableOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (tableRef.current) {
        const { scrollWidth, clientWidth } = tableRef.current;
        setTableOverflow(scrollWidth > clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const onScrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        left: tableRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const [page, setPage] = useState(0);

  const depositPositions = useMemo(() => {
    if (data?.positions) {
      return data.positions.slice(
        page * DEFAULT_PAGE_SIZE,
        (page + 1) * DEFAULT_PAGE_SIZE
      );
    }
    return [];
  }, [data?.positions, page]);

  const count = data?.positions?.length || 0;

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      {/**
       * Total Deposits
       */}
      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal ">
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(data.balanceUsd || 0, {
                type: "currency",
              })}
            </span>
          </div>
        </PrimaryLabel>
      </div>

      <div className="relative mt-6">
        <div ref={tableRef} className="hide-scrollbar overflow-x-auto">
          <DepositTable data={depositPositions} columns={depositColumns} />

          {tableOverflow && (
            <motion.div
              className="absolute -right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-_surface_tertiary p-2"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={onScrollRight}
            >
              <ChevronsRight className="h-4 w-4" />
            </motion.div>
          )}
        </div>

        <DepositPagination
          page={page}
          pageSize={DEFAULT_PAGE_SIZE}
          count={count}
          setPage={setPage}
        />
      </div>
    </div>
  );
});
