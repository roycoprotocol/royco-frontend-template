import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { InfoIcon } from "lucide-react";
import { SpringNumber } from "@/components/composables";
import { MarketRewardStyle } from "@/store";
import { LogOutIcon } from "lucide-react";
import { MarketType } from "@/store/market-manager-props";
import { Button } from "@/components/ui/button";
import LightningIcon from "../../../icons/lightning";
import { PrimaryLabel, SecondaryLabel } from "../../../composables";
import { TertiaryLabel } from "../../../composables";
import { IncentiveDetails } from "./incentive-details";
import { useActiveMarket } from "../../../hooks";
import { TokenEstimator } from "@/app/_components/ui/token-estimator";
import { InfoTip } from "@/components/common";
import { SONIC_CHAIN_ID, sonicMarketMap } from "royco/sonic";

export const AnnualYieldDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentMarketData, previousMarketData } = useActiveMarket();

  // find break of point where annual_change_ratio is 0
  const breakdowns = currentMarketData.yield_breakdown.filter(
    (item: any) =>
      item.category === "base" &&
      item.type === "point" &&
      item.annual_change_ratio === 0
  );

  // get first token data of point where annual_change_ratio is 0
  let point_token_data;
  if (breakdowns.length > 0) {
    point_token_data = {
      ...currentMarketData.incentive_tokens_data.find(
        (token: any) => token.id === breakdowns[0].id
      ),
      ...breakdowns[0],
    };
  }

  const aprInfo = useMemo(() => {
    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
      return "APY calculated assuming deposit made at market creation";
    }

    return;
  }, []);

  const sonicInfo = useMemo(() => {
    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic") {
      const sonicMarket = sonicMarketMap.find(
        (market) => market.id === currentMarketData.id
      );

      if (sonicMarket) {
        return sonicMarket.info;
      }
    }

    return;
  }, [currentMarketData]);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden rounded-lg border px-4 py-3", className)}
      {...props}
    >
      <div className="grid grid-cols-2 gap-6">
        {/**
         * APY
         */}

        <div>
          <TertiaryLabel className="gap-1 text-sm">
            <div>APY</div>
            {aprInfo && (
              <div>
                <InfoTip size="sm" type="tertiary">
                  {aprInfo}
                </InfoTip>
              </div>
            )}
          </TertiaryLabel>
          {currentMarketData.annual_change_ratio === 0 &&
          breakdowns.length > 0 ? (
            <TokenEstimator
              defaultTokenId={point_token_data?.id ? [point_token_data.id] : []}
              marketCategory={
                currentMarketData &&
                currentMarketData.chain_id === SONIC_CHAIN_ID
                  ? "sonic"
                  : undefined
              }
            >
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
              >
                <LightningIcon className="h-5 w-5 fill-black" />
                <span className="text-sm font-medium">Estimate</span>
              </Button>
            </TokenEstimator>
          ) : (
            <PrimaryLabel className="mt-1 text-2xl font-medium">
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
              <span className="text-p flex items-center gap-1 text-dodger_blue">
                Forfeitable
                <LogOutIcon className="h-4 w-4" />
              </span>
            ) : (
              "Lockup Period"
            )}
          </TertiaryLabel>
          <PrimaryLabel className="mt-1 text-2xl font-medium">
            {currentMarketData.market_type === MarketType.recipe.value &&
            currentMarketData.lockup_time !== "0"
              ? (() => {
                  const seconds = Number(currentMarketData.lockup_time);
                  if (seconds < 3600) {
                    return `${seconds} ${seconds === 1 ? "Second" : "Seconds"}`;
                  }
                  const hours = Math.ceil(seconds / 3600);
                  if (seconds < 86400) {
                    return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
                  }
                  const days = Math.ceil(seconds / 86400);
                  return `${days} ${days === 1 ? "Day" : "Days"}`;
                })()
              : "None"}
          </PrimaryLabel>
        </div>
      </div>

      {/**
       * Boyco Market Info
       */}
      {currentMarketData?.category === "boyco" && (
        <div className="mt-3 flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
          <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
          <SecondaryLabel className="break-normal text-xs">
            <span>
              <span>
                TVL as at market launch on the 12th of February. BERA price as
                current market price.{" "}
              </span>
              {/* <span className="underline">
                <a
                  href="https://blog.berachain.com/blog/boyco-markets-overview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more.
                </a>
              </span> */}
            </span>
          </SecondaryLabel>
        </div>
      )}

      {sonicInfo && (
        <div className="mt-3 flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
          <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
          <SecondaryLabel className="break-normal text-xs">
            <span>
              <span className="font-semibold">App Gems:</span>{" "}
              <span>{sonicInfo.description}</span>{" "}
              {sonicInfo.url && (
                <span className="underline">
                  <a
                    href={sonicInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more.
                  </a>
                </span>
              )}
            </span>
          </SecondaryLabel>
        </div>
      )}

      {process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic" && (
        <div className="mt-3 flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
          <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
          <SecondaryLabel className="break-normal text-xs">
            <span>
              <span className="font-semibold">Royco Gem Bonus:</span>{" "}
              <span>
                An additional 16,800 Gems will be distributed equally to Sonic
                apps using Royco, and then pro-rata to depositors.
              </span>
            </span>
          </SecondaryLabel>
        </div>
      )}

      {/**
       * Forfeitable Info
       */}
      {currentMarketData.reward_style ===
        MarketRewardStyle.forfeitable.value && (
        <div className="mt-3 flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
          <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
          <SecondaryLabel className="break-normal text-xs">
            <span>
              <span className="font-semibold">Forfeitable:</span>{" "}
              <span>
                Depositors may exit at anytime, however withdrawing before the
                end of the forfeitable period will forfeit all incentives earned
                to date.
              </span>
            </span>
          </SecondaryLabel>
        </div>
      )}

      {/* <hr className="-mx-4 my-3" /> */}

      {/**
       * Incentive Details
       */}
      <IncentiveDetails />
    </div>
  );
});
