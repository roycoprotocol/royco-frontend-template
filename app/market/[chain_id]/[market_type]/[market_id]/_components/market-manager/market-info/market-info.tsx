"use client";

import { cn } from "@/lib/utils";
import React, { useMemo, useState, useEffect } from "react";
import validator from "validator";
import { MarketDetails } from "./market-details/market-details";
import { AnnualYieldDetails } from "./annual-yield-details/annual-yield-details";
import { useActiveMarket } from "../../hooks";
import { PrimaryLabel, SecondaryLabel } from "../../composables";
import { TokenEstimator } from "@/app/_components/ui/token-estimator";
import { Button } from "@/components/ui/button";
import { ExternalIncentiveDetails } from "./external-incentive-details.tsx/external-incentive-detail";
import { LockIcon } from "lucide-react";
import { SONIC_CHAIN_ID } from "royco/sonic";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import {
  loadableSpecificRecipePositionAtom,
  loadableSpecificVaultPositionAtom,
} from "@/store/market/atoms";

export const MarketInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const [showDescription, setShowDescription] = useState(false);

  const pointTokenIds = (enrichedMarket?.activeIncentives ?? [])
    .filter((item) => item.type === "point")
    .map((item) => item.id);

  if (!!enrichedMarket) {
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
          {enrichedMarket?.name && enrichedMarket?.name.trim() !== ""
            ? validator.unescape(enrichedMarket?.name)
            : "Unknown Market"}
        </PrimaryLabel>

        {/**
         * Market Description
         */}
        <div className="mt-3 h-auto">
          <pre
            className={cn(
              "whitespace-pre-wrap break-normal font-gt text-sm font-light text-black",
              !showDescription && "line-clamp-2"
            )}
          >
            {validator.unescape(enrichedMarket.description ?? "") ||
              "No description available"}
          </pre>
        </div>

        {/**
         * Show/Hide Market Details
         */}
        <button
          className="mt-2 flex w-full flex-row justify-between text-sm font-light text-tertiary underline underline-offset-4"
          onClick={() => setShowDescription((prev) => !prev)}
        >
          {showDescription ? "View Less" : "View More"}
        </button>

        {/**
         * Deposit Cap Hit
         * @note disabled this condition as per request from @capnjack
         */}
        {false &&
          enrichedMarket?.category === "boyco" &&
          enrichedMarket?.fillableUsd === 0 && (
            <div className="mt-5 w-fit rounded-lg bg-primary px-4 py-3">
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
          <TokenEstimator
            defaultTokenId={pointTokenIds}
            marketCategory={
              enrichedMarket && enrichedMarket.chainId === SONIC_CHAIN_ID
                ? "sonic"
                : undefined
            }
          >
            <Button
              variant="link"
              size="sm"
              className="w-fit p-0 font-medium text-black underline outline-none"
            >
              APY Calculator
            </Button>
          </TokenEstimator>
        </div>

        {/**
         * External Incentive Details
         */}
        {enrichedMarket &&
          enrichedMarket.externalIncentives &&
          enrichedMarket.externalIncentives.length > 0 && (
            <div className="mt-5">
              <ExternalIncentiveDetails />
            </div>
          )}
      </div>
    );
  }
});
