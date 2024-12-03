"use client";

import React, { useMemo } from "react";

import { LoadingSpinner } from "@/components/composables";
import { DataTable } from "./data-table";

import { isEqual } from "lodash";

import { useEffect } from "react";

import { columns } from "./columns";
import { useExplore } from "@/store";
import { useEnrichedMarkets } from "@/sdk/hooks";

import { AnimatePresence, motion } from "framer-motion";

import { produce } from "immer";

import { useImmer } from "use-immer";
import { usePathname } from "next/navigation";

export const MarketsTable = () => {
  const [placeholderDatas, setPlaceholderDatas] = useImmer<Array<any | null>>([
    null,
    null,
  ]);

  const pathname = usePathname();
  const showVerifiedMarket = useMemo(
    () => (pathname === "/" ? true : false),
    [pathname]
  );

  const {
    exploreSortKey: sortKey,
    exploreFilters: filters,
    exploreSort: sorting,
    exploreSearch: searchKey,
    explorePageIndex: pageIndex,
    exploreCustomPoolParams: customPoolParams,
    exploreIsVerified: isVerified,
  } = useExplore();

  const { data, isLoading, isError, error, isRefetching, count } =
    useEnrichedMarkets({
      sorting,
      filters,
      page_index: pageIndex,
      search_key: searchKey,
      is_verified: showVerifiedMarket ? true : isVerified,
    });

  /**
   * @description Optimized for speed
   */
  useEffect(() => {
    if (
      isLoading === false &&
      data !== undefined &&
      data !== null &&
      !isEqual(data, placeholderDatas[1])
    ) {
      // @ts-ignore
      setPlaceholderDatas((prevDatas: any) => {
        return produce(prevDatas, (draft: any) => {
          draft.push(data);

          if (draft.length > 2) {
            draft.shift();
          }
        });
      });
    }
  }, [data, isLoading, placeholderDatas]);

  if (
    isLoading === true &&
    placeholderDatas[0] === null &&
    placeholderDatas[1] === null
  ) {
    return (
      <div className="flex flex-col items-center p-5">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (isError || count === 0) {
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
    <DataTable
      /**
       * @TODO Strictly type this
       */
      // @ts-ignore
      columns={columns}
      // @ts-ignore
      data={placeholderDatas[1] === null ? data : placeholderDatas[1]}
      // @ts-ignore
      placeholderDatas={placeholderDatas}
      props={{
        sorting,
      }}
    />
  );
};
