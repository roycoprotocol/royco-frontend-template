"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useExplore, useGlobalStates } from "@/store";
import { useEnrichedMarkets } from "royco/hooks";
import { LoadingSpinner, SpringNumber } from "@/components/composables";

import {
  AssetsFilter,
  ChainsFilter,
  IncentivesFilter,
  ViewSelector,
} from "./ui";
import { Switch } from "../../../components/ui/switch";
import { useParams, usePathname } from "next/navigation";
import { PoolTypeFilter } from "./ui/pool-type-filter";
import { AppTypeFilter } from "./ui/app-type-filter";

type TableMenuProps = React.HTMLAttributes<HTMLDivElement> & {};

const noChainSelectors = ["boyco", "corn", "sonic", "plume"];

export const TableMenu = React.forwardRef<HTMLDivElement, TableMenuProps>(
  ({ className }, ref) => {
    const pathname = usePathname();

    const showVerifiedMarket = useMemo(
      () => (pathname === "/" ? true : false),
      [pathname]
    );

    const {
      exploreView: view,
      setExploreView,
      exploreIsVerified,
      setExploreIsVerified,
      exploreAllMarkets,
      setExploreAllMarkets,
    } = useExplore();

    /**
     * @description Placeholder data state
     */
    const [placeholderDatas, setPlaceholderDatas] = useImmer([null, null]);

    const {
      exploreSort: sorting,
      exploreFilters: filters,
      exploreSearch: searchKey,
      explorePageIndex: pageIndex,
      exploreCustomPoolParams: customPoolParams,
      exploreAllMarkets: showAllMarkets,
      setExplorePageIndex: setPageIndex,
    } = useExplore();

    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateIsVerified = localStorage.getItem(
          "royco_verified_market_filter_type"
        );
        setExploreIsVerified(updateIsVerified === "false" ? false : true);
      }
    }, []);

    // const { isLoading, isError, isRefetching, count } = usePoolTable({
    //   sorting,
    //   filters,
    //   searchKey,
    //   pageIndex,
    //   customPoolParams,
    // });

    const { customTokenData } = useGlobalStates();

    const updatedFilters = useMemo(() => {
      if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "default") {
        const filterItem = filters.find((filter) => filter.id === "category");

        if (filterItem && showAllMarkets) {
          return filters.filter((filter) => filter.id !== "category");
        }

        if (!filterItem && !showAllMarkets) {
          return [
            ...filters,
            {
              id: "category",
              value: "boyco",
              condition: "NOT",
            },
          ];
        }
      }

      return filters;
    }, [filters, showAllMarkets]);

    const { isLoading, isError, isRefetching, count } = useEnrichedMarkets({
      sorting,
      filters: updatedFilters,
      page_index: pageIndex,
      search_key: searchKey,
      is_verified: showVerifiedMarket ? true : exploreIsVerified,
      custom_token_data: customTokenData,
    });

    /**
     * @description Placeholder data setter
     */
    useEffect(() => {
      if (
        isLoading === false &&
        count !== undefined &&
        count !== null &&
        !isEqual(count, placeholderDatas[1])
      ) {
        setPlaceholderDatas((prevDatas: any) => {
          const newData = [...prevDatas, count];

          if (newData.length > 2) {
            return newData.slice(1);
          }

          return newData;
        });
      }
    }, [count]);

    return (
      <div
        style={{
          height: "fit-content",
        }}
        className={cn(
          "flex h-full w-full shrink-0 flex-col overflow-y-scroll rounded-[1.25rem] border border-divider bg-white md:max-h-[80vh]",
          className
        )}
      >
        <div className="body-2 sticky top-0 z-20 flex h-16 shrink-0 flex-row place-content-center items-center justify-between border-b border-divider bg-white px-5 text-primary">
          <h3 className="flex flex-row items-center gap-2">
            <div className="tabular-nums">
              {isLoading ? (
                <LoadingSpinner className="inline-block h-4 w-4" />
              ) : (
                <SpringNumber
                  previousValue={placeholderDatas[0] || 0}
                  currentValue={count ?? 0}
                  numberFormatOptions={{
                    maximumFractionDigits: 0,
                    style: "decimal",
                  }}
                />
              )}
            </div>
            <div>Markets</div>
          </h3>
          <div className="flex h-5 w-5 flex-col place-content-center items-center overflow-hidden">
            <AnimatePresence mode="sync">
              {placeholderDatas[1] !== null &&
                (isLoading === true || isRefetching === true) && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="flex h-32 w-full flex-col place-content-center items-center"
                  >
                    <LoadingSpinner className="h-5 w-5" />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-divider px-5 py-4">
          <h4 className="badge text-tertiary">VIEW AS</h4>

          <ViewSelector />
        </div>

        <div className="flex flex-col px-5 py-4">
          <h4 className="badge text-tertiary">FILTER</h4>

          {!showVerifiedMarket && (
            <div className="body-2 mt-4 flex justify-between text-primary">
              <h5 className="">Show Unverified Markets</h5>

              <Switch
                checked={!exploreIsVerified}
                onCheckedChange={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "royco_verified_market_filter_type",
                      !exploreIsVerified ? "true" : "false"
                    );
                  }
                  setExploreIsVerified(!exploreIsVerified);
                }}
              />
            </div>
          )}

          {/**
           * @description Show all markets
           */}
          {process.env.NEXT_PUBLIC_FRONTEND_TAG === "default" && (
            <div className="body-2 mt-4 flex justify-between text-primary">
              <h5 className="">Show Inactive Markets</h5>

              <Switch
                checked={exploreAllMarkets}
                onCheckedChange={() => {
                  setPageIndex(0);
                  setExploreAllMarkets(!exploreAllMarkets);
                }}
              />
            </div>
          )}

          {/**
           * @description Pool Type filter
           */}

          {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" && (
            <div className="body-2 mt-4 flex flex-col gap-2 text-primary">
              <h5 className="">Pool Type</h5>

              <div className="flex flex-wrap gap-2">
                <PoolTypeFilter />
              </div>
            </div>
          )}

          {process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic" && (
            <div className="body-2 mt-4 flex flex-col gap-2 text-primary">
              <h5 className="">App Type</h5>

              <div className="flex flex-wrap gap-2">
                <AppTypeFilter />
              </div>
            </div>
          )}

          {/**
           * @description Asset filter
           */}
          <div className="body-2 mt-4 flex flex-col gap-2 text-primary">
            <h5 className="">Input Asset</h5>

            <div className="flex flex-wrap gap-2">
              <AssetsFilter />
            </div>
          </div>

          {/**
           * @description Incentive filter
           */}
          {/* <div className="body-2 mt-[1.375rem] flex flex-col gap-2 text-primary">
            <h5 className="">Incentive</h5>

            <div className="flex flex-wrap gap-2">
              <IncentivesFilter />
            </div>
          </div> */}

          {/**
           * @description Chain filter
           */}

          {!noChainSelectors.includes(
            process.env.NEXT_PUBLIC_FRONTEND_TAG ?? ""
          ) && (
            <div className="body-2 mt-[1.375rem] flex flex-col gap-2 text-primary">
              <h5 className="">Chain</h5>

              <div className="flex flex-wrap gap-2">
                <ChainsFilter />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
