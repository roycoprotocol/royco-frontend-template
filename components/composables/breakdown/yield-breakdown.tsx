"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EnrichedMarketDataType } from "royco/queries";
import { TokenDisplayer } from "@/components/common";
import { SparklesIcon, SquarePenIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { MarketType } from "@/store";
import { TokenEstimator } from "@/app/_components/ui/token-estimator/token-estimator";
import {
  BERA_TOKEN_ID,
  DEFAULT_TOKEN_COLOR,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-info/annual-yield-details/incentive-details";
import { Vibrant } from "node-vibrant/browser";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ShieldIcon from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/shield";
import SparkleIcon from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/sparkle";
import formatNumber from "@/utils/numbers";

const BreakdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

const BreakdownTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("font-normal", className)} {...props} />;
});

const BreakdownRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: EnrichedMarketDataType["yield_breakdown"][number];
    base_key: string;
    closeParentModal?: () => void;
    marketType?: number;
  }
>(
  (
    { className, item, base_key, closeParentModal, marketType, ...props },
    ref
  ) => {
    const beraToken = useMemo(() => {
      return item.id === BERA_TOKEN_ID;
    }, [item.id]);

    const [tokenColor, setTokenColor] = useState<string | null>(null);

    useEffect(() => {
      const getTokenColor = async () => {
        if (item.image) {
          const url = new URL(item.image);
          url.search = "";
          try {
            const palette = await Vibrant.from(url.toString()).getPalette();
            if (palette) {
              const swatches = Object.values(palette).filter(
                (swatch) => swatch !== null
              );
              const color = swatches.reduce((prev, current) => {
                return (prev?.population ?? 0) > (current?.population ?? 0)
                  ? prev
                  : current;
              });
              if (color) {
                setTokenColor(color.hex);
              }
            }
          } catch (error) {
            setTokenColor(DEFAULT_TOKEN_COLOR);
          }
        }
      };

      getTokenColor();
    }, [item.image]);

    return (
      <div
        ref={ref}
        key={`yield-breakdown:${base_key}:${item.category}:${item.id}`}
        className="flex flex-row items-center justify-between font-light"
        {...props}
      >
        <TokenDisplayer tokens={[item] as any} symbols={true} />

        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center">
            {item.category === "base" && (
              <Tooltip>
                <TooltipTrigger className={cn("cursor-pointer")}>
                  {marketType === MarketType.recipe.value ? (
                    <ShieldIcon
                      className="h-5 w-5"
                      style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                    />
                  ) : (
                    <SparkleIcon
                      className="h-5 w-5"
                      style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                    />
                  )}
                </TooltipTrigger>
                {createPortal(
                  <TooltipContent className={cn("bg-white", "max-w-80")}>
                    {marketType === MarketType.recipe.value
                      ? "Fixed Incentive Rate"
                      : "Variable Incentive Rate, based on # of participants"}
                  </TooltipContent>,
                  document.body
                )}
              </Tooltip>
            )}

            <span
              style={{
                color:
                  item.category === "base"
                    ? tokenColor || DEFAULT_TOKEN_COLOR
                    : "black",
              }}
            >
              {formatNumber(item.annual_change_ratio, {
                type: "percent",
              })}
            </span>
          </div>

          {(item.category === "base" || beraToken) && (
            <TokenEstimator defaultTokenId={item.id}>
              <SquarePenIcon
                strokeWidth={2}
                className="h-4 w-4 cursor-pointer text-secondary transition-all duration-200 ease-in-out hover:opacity-80"
                color={tokenColor || DEFAULT_TOKEN_COLOR}
              />
            </TokenEstimator>
          )}
        </div>
      </div>
    );
  }
);

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["yield_breakdown"];
    base_key: string;
    closeParentModal?: () => void;
    marketType?: number;
  }
>(
  (
    { className, breakdown, base_key, closeParentModal, marketType, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {breakdown.map((item) => (
          <BreakdownRow
            key={item.id}
            item={item}
            base_key={base_key}
            closeParentModal={closeParentModal}
            marketType={marketType}
          />
        ))}
      </div>
    );
  }
);

const NetYield = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    base_key: string;
    annual_change_ratio: number;
  }
>(({ className, base_key, annual_change_ratio, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3 font-normal text-success", className)}
      {...props}
    >
      <div className="w-full border-b border-divider"></div>
      <div
        key={`yield-breakdown:${base_key}:net-yield`}
        className=" flex flex-row items-center justify-between"
      >
        <div className="flex flex-row items-center gap-2">
          <SparklesIcon className="h-4 w-4" color="#3CC27A" strokeWidth={2} />
          <span>Net APY</span>
        </div>
        <div className="">
          {formatNumber(annual_change_ratio, {
            type: "percent",
          })}
        </div>
      </div>
    </div>
  );
});

export const YieldBreakdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["yield_breakdown"];
    base_key: string;
    marketType?: number;
  }
>(({ className, breakdown, base_key, marketType, ...props }, ref) => {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger className={cn("flex cursor-pointer items-end")}>
        {props.children}
      </HoverCardTrigger>
      {typeof window !== "undefined" &&
        breakdown.length > 0 &&
        createPortal(
          <HoverCardContent className="w-full min-w-64">
            <div
              ref={ref}
              className={cn(
                "flex flex-col gap-3 text-base font-normal text-black",
                className
              )}
              {...props}
            >
              {breakdown.some((item) => item.category === "base") && (
                <div>
                  <BreakdownItem>
                    <BreakdownTitle>Negotiable Rate</BreakdownTitle>
                    <BreakdownContent
                      className="mt-1"
                      breakdown={breakdown.filter(
                        (item) => item.category === "base"
                      )}
                      base_key={base_key}
                      marketType={marketType}
                    />
                  </BreakdownItem>
                </div>
              )}

              {breakdown.some((item) => item.category !== "base") && (
                <BreakdownItem>
                  <BreakdownTitle>Underlying Rate</BreakdownTitle>
                  <BreakdownContent
                    className="mt-1"
                    breakdown={breakdown.filter(
                      (item) => item.category !== "base"
                    )}
                    base_key={base_key}
                  />
                </BreakdownItem>
              )}

              <BreakdownItem>
                <NetYield
                  base_key={base_key}
                  annual_change_ratio={breakdown.reduce(
                    (acc, item) => acc + item.annual_change_ratio,
                    0
                  )}
                />
              </BreakdownItem>
            </div>
          </HoverCardContent>,
          document.body
        )}
    </HoverCard>
  );
});
