"use client";

import React, { Fragment, useEffect } from "react";
import { useMarketManager } from "@/store";
import { MarketSteps, MarketViewType } from "@/store/market-manager-props";
import { cn } from "@/lib/utils";
import { MarketForm, MarketFormSchema } from "../market-form";
import { useActiveMarket } from "../hooks";
import { LoadingSpinner, TransactionModal } from "@/components/composables";
import { Switch } from "@/components/ui/switch";
import { MarketInfo } from "../market-info";
import { IncentiveInfo } from "../incentive-info";
import { AlertIndicator } from "@/components/common";
import { OfferList } from "../offer-list";
import { SlideUpWrapper } from "@/components/animations";
import {
  BASE_PADDING,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  BASE_UNDERLINE,
  PrimaryLabel,
  SecondaryLabel,
} from "../composables";
import { ChevronLeft } from "lucide-react";
import { OfferListVisualizer } from "../offer-list-visualizer";
import { BalanceIndicator } from "../balance-indicator";
import { motion, AnimatePresence } from "framer-motion";
import { OfferTable } from "../stats-tables";
import { StatsTables } from "../stats-tables/stats-tables";
import { WarningBox } from "@/components/composables";

export const MarketManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { viewType, setViewType, marketStep, setMarketStep } =
    useMarketManager();

  const {
    isLoading,
    propsEnrichedMarket,
    currentMarketData,
    previousMarketData,
    marketMetadata,
  } = useActiveMarket();

  // console.log("currentMarketData", currentMarketData);

  if (isLoading) {
    return <LoadingSpinner className="h-5 w-5" />;
  } else if (
    !currentMarketData ||
    process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET"
  ) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center">
        <AlertIndicator className="h-96 w-full max-w-[83.625rem] rounded-2xl border border-divider bg-white">
          Market dashboard isn't live yet. Check back later.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  } else if (!!currentMarketData && !!marketMetadata) {
    return (
      <Fragment>
        {currentMarketData.is_verified === false && (
          <WarningBox
            className={cn(
              "max-w-[83.625rem]",
              viewType === MarketViewType.simple.id && "",
              viewType === MarketViewType.advanced.id && "mb-10 w-full"
            )}
            text="This is an unverified market and may lead to loss of assets upon interaction. Please make sure that you understand the risks before interacting with this market."
          />
        )}

        <div
          className={cn(
            "relative flex w-full max-w-[83.625rem] shrink-0 flex-row place-content-end items-center gap-3 pb-3",
            viewType === MarketViewType.simple.id && "opacity-0"
          )}
        >
          {viewType === MarketViewType.simple.id && (
            <div className="absolute left-0 top-0 h-full w-full"></div>
          )}

          <div className="font-gt text-sm font-light text-secondary">
            Advanced Mode
          </div>
          <Switch
            checked={viewType === MarketViewType.advanced.id}
            onCheckedChange={() => {
              setViewType(
                viewType === MarketViewType.advanced.id
                  ? MarketViewType.simple.id
                  : MarketViewType.advanced.id
              );
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeIn" }}
          key={`market-manager:${viewType}`}
          className={cn(
            "flex items-center rounded-2xl border border-divider bg-white",
            "w-full overflow-hidden",
            "max-w-[83.625rem]",
            viewType === MarketViewType.advanced.id &&
              "h-fit flex-col md:h-[70rem] md:flex-row md:divide-x",
            viewType === MarketViewType.simple.id &&
              "h-fit max-w-lg flex-col md:h-[70rem]",
            "flex-0"
          )}
        >
          {viewType === MarketViewType.simple.id ? (
            <Fragment>
              {marketStep === MarketSteps.params.id && <MarketInfo />}

              <MarketForm
                key={`market-form:simple`}
                className={cn(
                  marketStep === MarketSteps.params.id &&
                    "border-t border-divider"
                )}
              />

              {/**
               * Temporarily disabled advanced mode on live networks
               */}
              {process.env.NEXT_PUBLIC_FRONTEND_TYPE === "TESTNET" && (
                <div
                  className={cn(
                    "flex-0",
                    "flex w-full shrink-0 flex-row items-center justify-between border-t border-divider",
                    BASE_PADDING_LEFT,
                    BASE_PADDING_RIGHT,
                    "py-3"
                  )}
                >
                  <div className="font-gt text-sm font-light text-secondary">
                    Advanced Mode
                  </div>
                  <Switch
                    checked={viewType === MarketViewType.advanced.id}
                    onCheckedChange={() => {
                      setViewType(
                        viewType === MarketViewType.advanced.id
                          ? MarketViewType.simple.id
                          : MarketViewType.advanced.id
                      );
                    }}
                  />
                </div>
              )}
            </Fragment>
          ) : (
            // <MarketForm />
            <Fragment>
              {/**
               * @info Left section
               */}
              <div
                className={cn(
                  "flex h-full shrink-0 flex-col divide-y divide-divider",
                  "w-full md:w-[50%] xl:w-[25%]"
                )}
              >
                <MarketInfo />

                <IncentiveInfo />

                <OfferList />
              </div>

              {/**
               * @info Middle section
               */}
              <div
                className={cn(
                  "border-t border-divider md:border-t-0",
                  "h-full shrink-0 flex-col divide-y divide-divider md:hidden xl:flex",
                  "w-full md:w-[40%] xl:w-[50%]",
                  "flex h-full grow flex-col"
                )}
              >
                <OfferListVisualizer className="h-1/2 w-full" />

                <StatsTables className="flex h-[18rem] w-full flex-col overflow-hidden xl:h-1/2" />
              </div>

              {/**
               * @info Right section
               */}
              <div
                className={cn(
                  "border-t border-divider md:border-t-0",
                  "flex h-full shrink-0 flex-col divide-y divide-divider",
                  "w-full md:w-[50%] xl:w-[25%]"
                )}
              >
                {/* <BalanceIndicator /> */}

                <MarketForm />
              </div>
            </Fragment>
          )}
        </motion.div>
      </Fragment>
    );
  }
});
