import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { InfoIcon } from "lucide-react";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LightningIcon from "../../../icons/lightning";
import { PrimaryLabel, SecondaryLabel } from "../../../composables";
import { TertiaryLabel } from "../../../composables";
import { IncentiveDetails } from "./incentive-details";
import { TokenEstimator } from "@/app/_components/token-estimator";
import { InfoTip } from "@/components/common";
import { SONIC_CHAIN_ID, sonicMarketMap } from "royco/sonic";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { useAtomValue } from "jotai";
import NumberFlow from "@number-flow/react";

export const AnnualYieldDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  // find break of point where annual_change_ratio is 0
  const breakdowns =
    enrichedMarket?.activeIncentives.filter(
      (item) => item.type === "point" && item.yieldRate === 0
    ) ?? [];

  // get first token data of point where annual_change_ratio is 0
  let point_token_data;
  if (breakdowns.length > 0) {
    point_token_data = {
      ...enrichedMarket?.activeIncentives.find(
        (token) => token.id === breakdowns[0].id
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
        (market) => market.id === enrichedMarket?.id
      );

      if (sonicMarket) {
        return sonicMarket.info;
      }
    }

    return;
  }, [enrichedMarket]);

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
          {enrichedMarket?.yieldRate === 0 && breakdowns.length > 0 ? (
            <TokenEstimator
              defaultTokenId={point_token_data?.id ? [point_token_data.id] : []}
              marketCategory={
                enrichedMarket && enrichedMarket.chainId === SONIC_CHAIN_ID
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
            <PrimaryLabel className="text-2xl font-medium text-success">
              <NumberFlow
                value={enrichedMarket?.yieldRate ?? 0}
                format={{
                  style: "percent",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
              />
            </PrimaryLabel>
          )}
        </div>

        {/**
         * Lockup Period
         */}
        <div>
          <TertiaryLabel className="text-sm">
            {/**
             * Forfeitable Reward Style
             */}
            {enrichedMarket?.rewardStyle === 2 ? (
              <span className="text-p flex items-center gap-1 text-dodger_blue">
                Forfeitable
                <LogOutIcon className="h-4 w-4" />
              </span>
            ) : (
              "Lockup Period"
            )}
          </TertiaryLabel>
          <PrimaryLabel className="mt-1 text-2xl font-medium">
            {enrichedMarket?.marketType === 0 &&
            enrichedMarket?.lockupTime !== "0"
              ? (() => {
                  const seconds = Number(enrichedMarket?.lockupTime);
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
      {enrichedMarket?.category === "boyco" && (
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
      {enrichedMarket?.rewardStyle === 2 && (
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
