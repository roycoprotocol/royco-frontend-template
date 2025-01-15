"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { PrimaryLabel } from "../composables";
import { useActiveMarket } from "../hooks";
import validator from "validator";
import { MarketDetails } from "./market-details";
import { AnnualYieldDetails } from "./annual-yield-details";

export const MarketInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isLoading, marketMetadata, currentMarketData, propsReadMarket } =
    useActiveMarket();

  if (
    !isLoading &&
    !!currentMarketData &&
    !!marketMetadata &&
    !!propsReadMarket.data
  ) {
    return (
      <div
        ref={ref}
        className={cn("flex h-fit w-full shrink-0 flex-col p-6", className)}
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
         * Market Details
         */}
        <MarketDetails />

        {/**
         * Annual Incentive Percent
         */}
        <AnnualYieldDetails />
      </div>
    );
  }
});
