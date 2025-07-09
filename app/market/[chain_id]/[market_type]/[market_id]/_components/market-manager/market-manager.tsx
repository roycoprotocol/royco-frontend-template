"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useMarketManager } from "@/store";
import {
  MarketType,
  MarketUserType,
  MarketViewType,
  TypedMarketViewType,
} from "@/store/market-manager-props";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables";
import { Switch } from "@/components/ui/switch";
import { AlertIndicator } from "@/components/common";
import { SlideUpWrapper } from "@/components/animations";
import { SecondaryLabel } from "../composables";
import { ChevronLeftIcon } from "lucide-react";
import { WarningBox } from "@/components/composables";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import { useAccount } from "wagmi";
import { SimpleMarketManager } from "./simple-market-manager";
import { AdvanceMarketManager } from "./advance-market-manager";
import { useAtom, useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { userTypeAtom } from "@/store/market/atoms";
import Link from "next/link";
import { useMixpanel } from "@/services/mixpanel";

export const MarketManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { trackMarketAdvancedModeToggled, trackMarketUserTypeToggled } =
    useMixpanel();
  const { viewType, setViewType, userType, setUserType } = useMarketManager();

  const { data: enrichedMarket, isLoading } = useAtomValue(
    loadableEnrichedMarketAtom
  );

  const { address: walletAddress } = useAccount();
  const [connectWalletAddress, setConnectWalletAddress] = useState<
    `0x${string}` | undefined
  >(undefined);

  const [userTypeAtomValue, setUserTypeAtomValue] = useAtom(userTypeAtom);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateViewType =
        (localStorage.getItem(
          "royco_market_view_type"
        ) as TypedMarketViewType) || MarketViewType.simple.id;
      setViewType(updateViewType);
    }
  }, []);

  useEffect(() => {
    if (enrichedMarket && walletAddress !== connectWalletAddress) {
      setConnectWalletAddress(walletAddress);
    }
  }, [walletAddress, enrichedMarket]);

  useEffect(() => {
    if (
      enrichedMarket &&
      enrichedMarket?.owner &&
      !!connectWalletAddress &&
      enrichedMarket.marketType === MarketType.vault.value &&
      connectWalletAddress.toLowerCase() === enrichedMarket?.owner.toLowerCase()
    ) {
      setUserType(MarketUserType.ip.id);
    }
  }, [connectWalletAddress]);

  useEffect(() => {
    if (userType === MarketUserType.ap.id && userTypeAtomValue !== 0) {
      setUserTypeAtomValue(0);
    } else if (userType === MarketUserType.ip.id && userTypeAtomValue !== 1) {
      setUserTypeAtomValue(1);
    }
  }, [userType]);

  if (isLoading) {
    return <LoadingSpinner className="h-5 w-5" />;
  }

  if (!enrichedMarket) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center">
        <AlertIndicator
          className={cn(
            "h-96 w-full rounded-2xl border border-divider bg-white",
            MAX_SCREEN_WIDTH
          )}
        >
          Market dashboard isn't live yet. Check back later. This takes a few
          minutes if you've just deployed your market.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  }

  return (
    <Fragment>
      {/**
       * Unverified warning
       */}
      {enrichedMarket?.isVerified === false && (
        <SlideUpWrapper className="w-fit">
          <WarningBox
            className={cn("mb-10")}
            title="THIS MARKET MAY LEAD TO LOSS OF FUNDS. IT IS UNVERIFIED."
            text="This market may be malicious or not function as expected, it has not yet been verified."
          />
        </SlideUpWrapper>
      )}

      {/**
       * Explore header
       */}
      <div
        className={cn(
          "flex w-full flex-col justify-between gap-3 pb-3 md:flex-row md:items-center",
          viewType === MarketViewType.simple.id ? "max-w-lg" : MAX_SCREEN_WIDTH
        )}
      >
        <Link href="/">
          <SecondaryLabel
            className={cn(
              "flex cursor-pointer items-center font-light",
              "transition-all duration-200 ease-in-out hover:opacity-80"
            )}
          >
            <ChevronLeftIcon
              strokeWidth={1.5}
              className="-ml-2 h-6 w-6 text-secondary"
            />
            <span>Explore</span>
          </SecondaryLabel>
        </Link>

        {viewType === MarketViewType.advanced.id && (
          <div
            className={cn(
              "flex shrink-0 flex-row justify-between md:w-fit md:items-center md:justify-end md:gap-3",
              viewType === MarketViewType.simple.id && "opacity-0"
            )}
          >
            {/**
             * User Type Switch
             */}
            <SecondaryLabel className="flex items-center gap-2 font-light">
              <span>Incentive Provider</span>
              <Switch
                checked={userType === MarketUserType.ip.id}
                onCheckedChange={() => {
                  if (userType === MarketUserType.ap.id) {
                    setUserType(MarketUserType.ip.id);
                    trackMarketUserTypeToggled({
                      user_type: "ip",
                    });
                  } else {
                    setUserType(MarketUserType.ap.id);
                    trackMarketUserTypeToggled({
                      user_type: "ap",
                    });
                  }
                }}
              />
            </SecondaryLabel>

            {/**
             * Advanced View Switch
             */}
            <SecondaryLabel className="flex items-center gap-2 font-light">
              <span>Advanced Mode</span>
              <Switch
                checked={viewType === MarketViewType.advanced.id}
                onCheckedChange={() => {
                  let updateViewType;
                  if (viewType === MarketViewType.advanced.id) {
                    updateViewType = MarketViewType.simple.id;
                  } else {
                    updateViewType = MarketViewType.advanced.id;
                  }

                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "royco_market_view_type",
                      updateViewType
                    );
                  }

                  setViewType(updateViewType);
                  trackMarketAdvancedModeToggled({
                    advanced_mode:
                      updateViewType === MarketViewType.advanced.id,
                  });
                }}
              />
            </SecondaryLabel>
          </div>
        )}
      </div>

      {/**
       * Simple Market Manager
       */}
      {viewType === MarketViewType.simple.id && <SimpleMarketManager />}

      {/**
       * Advanced Market Manager
       */}
      {viewType === MarketViewType.advanced.id && <AdvanceMarketManager />}
    </Fragment>
  );
});
