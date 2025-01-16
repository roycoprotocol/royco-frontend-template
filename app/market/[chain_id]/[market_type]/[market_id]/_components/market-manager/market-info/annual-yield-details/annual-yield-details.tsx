import { cn } from "@/lib/utils";
import React from "react";
import { InfoIcon, ZapIcon } from "lucide-react";
import { SpringNumber } from "@/components/composables";
import { MarketRewardStyle } from "@/store";
import { LogOutIcon } from "lucide-react";
import { formatDuration } from "date-fns";
import { secondsToDuration } from "@/app/create/_components/market-builder-form";
import { MarketType } from "@/store/market-manager-props";
import { Button } from "@/components/ui/button";
import LightningIcon from "./icons/lightning";
import { PrimaryLabel, SecondaryLabel } from "../../../composables";
import { TertiaryLabel } from "../../../composables";
import { IncentiveDetails, TokenEstimatePopover } from "./incentive-details";
import { useActiveMarket } from "../../../hooks";

export const AnnualYieldDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentMarketData, previousMarketData } = useActiveMarket();

  const breakdowns = currentMarketData.yield_breakdown.filter(
    (item: any) =>
      item.category === "base" &&
      item.type === "point" &&
      item.annual_change_ratio === 0
  );

  let point_token_data;
  if (breakdowns.length > 0) {
    point_token_data = {
      ...currentMarketData.incentive_tokens_data.find(
        (token: any) => token.id === breakdowns[0].id
      ),
      ...breakdowns[0],
    };
  }

  return (
    <div
      className={cn("mt-5 rounded-lg border px-4 py-3", className)}
      {...props}
    >
      <div className="grid grid-cols-2 gap-6">
        {/**
         * APY
         */}
        <div>
          <TertiaryLabel className="text-sm">APY</TertiaryLabel>
          {breakdowns.length > 0 &&
          currentMarketData.annual_change_ratio === 0 ? (
            <TokenEstimatePopover token_data={point_token_data}>
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
              >
                <LightningIcon className="h-5 w-5 fill-black" />
                <span className="text-sm font-medium">Estimate</span>
              </Button>
            </TokenEstimatePopover>
          ) : (
            <PrimaryLabel className="mt-1 text-2xl font-500">
              <SpringNumber
                previousValue={
                  previousMarketData && previousMarketData.annual_change_ratio
                    ? previousMarketData.annual_change_ratio
                    : 0
                }
                currentValue={currentMarketData.annual_change_ratio ?? 0}
                numberFormatOptions={{
                  style: "percent",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
                defaultColor="text-success"
              />
            </PrimaryLabel>
          )}
        </div>

        {/**
         * Lockup Period
         */}
        <div>
          <TertiaryLabel className="text-sm">
            {currentMarketData.reward_style ===
            MarketRewardStyle.forfeitable.value ? (
              <span className="text-p flex items-center gap-1 text-[#007AFF]">
                Forfeitable
                <LogOutIcon className="h-4 w-4" />
              </span>
            ) : (
              "Lockup Period"
            )}
          </TertiaryLabel>
          <PrimaryLabel className="mt-1 text-2xl font-500">
            {currentMarketData.market_type === MarketType.recipe.value &&
            currentMarketData.lockup_time !== "0"
              ? formatDuration(
                  Object.entries(
                    secondsToDuration(currentMarketData.lockup_time)
                  )
                    .filter(([_, value]) => value > 0)
                    .slice(0, 2)
                    .reduce(
                      (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                      {}
                    )
                ).replace(/months?/g, "Mo.")
              : "None"}
          </PrimaryLabel>
        </div>
      </div>

      {/**
       * Forfeitable Info
       */}
      {currentMarketData.reward_style ===
        MarketRewardStyle.forfeitable.value && (
        <div className="mt-3 flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
          <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
          <SecondaryLabel className="break-normal text-xs">
            Withdrawing before the end of the forfeitable period will forfeit
            all incentives earned to date.
          </SecondaryLabel>
        </div>
      )}

      <hr className="-mx-4 my-3" />

      {/**
       * Incentive Details
       */}
      <IncentiveDetails />
    </div>
  );
});
