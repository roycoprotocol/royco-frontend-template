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
import { ExploreChainFilter } from "./ui/explore-chain-filter";
import {
  exploreFiltersAtom,
  loadableExploreMarketAtom,
} from "@/store/explore/atoms";
import { useAtom, useAtomValue } from "jotai";
import { explorePageAtom } from "@/store/explore/atoms";
import NumberFlow from "@number-flow/react";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { ExploreMarketResponse } from "royco/api";
import { produce } from "immer";

type TableMenuProps = React.HTMLAttributes<HTMLDivElement> & {};

const noChainSelectors = ["boyco", "corn", "sonic", "plume"];

export const TableMenu = React.forwardRef<HTMLDivElement, TableMenuProps>(
  ({ className }, ref) => {
    const pathname = usePathname();

    const showVerifiedMarket = useMemo(
      () => (pathname === "/" ? true : false),
      [pathname]
    );

    const [filters, setFilters] = useAtom(exploreFiltersAtom);
    const [page, setPage] = useAtom(explorePageAtom);

    const exploreIsVerified = useMemo(() => {
      return (
        filters.find((filter) => filter.id === "isVerified")?.value ?? true
      );
    }, [filters]);

    const setExploreIsVerified = (isVerified: boolean) => {
      const isVerifiedFilterIndex = filters.findIndex(
        (filter) => filter.id === "isVerified"
      );

      if (isVerifiedFilterIndex !== -1) {
        let newFilters = [...filters];
        newFilters[isVerifiedFilterIndex].value = isVerified;
        setFilters(newFilters);
      }
    };

    /**
     * @description Placeholder data state
     */
    const [placeholderDatas, setPlaceholderDatas] = useImmer([null, null]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateIsVerified = localStorage.getItem(
          "royco_verified_market_filter_type"
        );
        setExploreIsVerified(updateIsVerified === "false" ? false : true);
      }
    }, []);

    const { customTokenData } = useGlobalStates();

    const {
      data: propsData,
      isLoading,
      isRefetching,
    } = useAtomValue(loadableExploreMarketAtom);

    const [placeholderData, setPlaceholderData] = useImmer<
      Array<ExploreMarketResponse | undefined>
    >([undefined, undefined]);

    useEffect(() => {
      if (!isEqual(propsData, placeholderData[1]) && !!propsData) {
        setPlaceholderData((prevDatas) => {
          return produce(prevDatas, (draft) => {
            // Prevent overwriting previous data with the same object reference
            if (!isEqual(draft[1], propsData)) {
              draft[0] = draft[1]; // Set previous data to the current data
              draft[1] = propsData; // Set current data to the new data
            }
          });
        });
      }
    }, [propsData]);

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
              {placeholderData[1]?.count !== undefined ? (
                <NumberFlow value={placeholderData[1]?.count ?? 0} />
              ) : (
                <LoadingCircle size={16} className="inline-block" />
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
          <div className="body-2 mt-4 flex justify-between text-primary">
            <h5 className="">Show Inactive Markets</h5>

            <Switch
              checked={
                filters.some((filter) => filter.id === "fillableUsd")
                  ? false
                  : true
              }
              onCheckedChange={(e) => {
                if (e === true) {
                  // Show all markets (active + inactive)
                  const newFilters = filters.filter(
                    (filter) => filter.id !== "fillableUsd"
                  );

                  setFilters(newFilters);
                } else {
                  // Show only active markets
                  let newFilters = filters.filter(
                    (filter) => filter.id !== "fillableUsd"
                  );

                  newFilters.push({
                    id: "fillableUsd",
                    value: 0,
                    condition: "gt",
                  });

                  setFilters(newFilters);
                }

                setPage(1);
              }}
            />
          </div>

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
              <h5 className="">Gem Allocation</h5>

              <div className="flex flex-wrap gap-2">
                <AppTypeFilter />
              </div>
            </div>
          )}

          {/**
           * @description Asset filter
           */}
          {process.env.NEXT_PUBLIC_FRONTEND_TAG !== "sonic" && (
            <div className="body-2 mt-4 flex flex-col gap-2 text-primary">
              <h5 className="">Input Asset</h5>

              <div className="flex flex-wrap gap-2">
                <AssetsFilter />
              </div>
            </div>
          )}

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
                <ExploreChainFilter />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
