"use client";

import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import validator from "validator";
import { MarketDetails } from "./market-details/market-details";
import { AnnualYieldDetails } from "./annual-yield-details/annual-yield-details";
import { useActiveMarket } from "../../hooks";
import { PrimaryLabel, SecondaryLabel } from "../../composables";
import { TokenEstimator } from "@/app/_components/ui/token-estimator";
import { Button } from "@/components/ui/button";
import { ExternalIncentiveDetails } from "./external-incentive-details.tsx/external-incentive-detail";
import { LockIcon } from "lucide-react";

export const MarketInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isLoading, marketMetadata, currentMarketData, propsReadMarket } =
    useActiveMarket();

  const fillableAmount = useMemo(() => {
    return parseFloat(currentMarketData?.quantity_ip ?? "0");
  }, [currentMarketData]);

  if (
    !isLoading &&
    !!currentMarketData &&
    !!marketMetadata &&
    !!propsReadMarket.data
  ) {
    return (
      <div
        ref={ref}
        className={cn("flex h-fit w-full shrink-0 flex-col", className)}
        {...props}
      >
        {/**
         * Market Title
         */}
        <PrimaryLabel
          className={cn("mt-1 break-normal text-4xl font-semibold")}
        >
          {currentMarketData.name && currentMarketData.name.trim() !== ""
            ? validator.unescape(currentMarketData.name)
            : "Unknown Market"}
        </PrimaryLabel>

        {/**
         * Deposit Cap Hit
         */}
        {currentMarketData?.category === "boyco" && fillableAmount === 0 && (
          <div className="mt-2 w-fit rounded-lg bg-primary px-4 py-3">
            <SecondaryLabel className="flex items-center gap-1 font-500 text-white">
              <LockIcon className="h-4 w-4" />
              <span>Deposit Cap Reached</span>
            </SecondaryLabel>
          </div>
        )}

        {/**
         * Market Details
         */}
        <div className="mt-5">
          <MarketDetails />
        </div>

        {/**
         * Annual Incentive Percent
         */}
        <div className="mt-5">
          <AnnualYieldDetails />
        </div>

        {/**
         * Token Estimate
         */}
        <div className="mt-2">
          <TokenEstimator>
            <Button
              variant="link"
              size="sm"
              className="w-fit p-0 text-tertiary underline outline-none"
            >
              APY Calculator
            </Button>
          </TokenEstimator>
        </div>

        {/**
         * External Incentive Details
         */}
        {currentMarketData &&
          currentMarketData.external_incentives &&
          currentMarketData.external_incentives.length > 0 && (
            <div className="mt-5">
              <ExternalIncentiveDetails />
            </div>
          )}
      </div>
    );
  }
});
