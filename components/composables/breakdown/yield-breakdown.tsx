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
import { TokenEstimator } from "@/app/_components/token-estimator/token-estimator";
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
import { SONIC_CHAIN_ID } from "royco/sonic";
import { EnrichedMarket, TokenQuote } from "@/app/api/royco/data-contracts";

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
    item: TokenQuote & {
      rawAmount?: string;
      tokenAmount?: number;
      tokenAmountUsd?: number;
      yieldRate?: number;
      yieldText?: string;
    };
    baseKey: string;
    closeParentModal?: () => void;
    marketType?: number;
    marketCategory?: string;
  }
>(
  (
    {
      className,
      item,
      baseKey,
      closeParentModal,
      marketType,
      marketCategory,
      ...props
    },
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
        key={`yield-breakdown:${baseKey}:${item.id}`}
        className="flex flex-row items-center justify-between gap-3 font-light"
        {...props}
      >
        <TokenDisplayer tokens={[item] as any} symbols={true} />

        {item.yieldRate && item.yieldRate > 0 && (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center">
              <Tooltip>
                <TooltipTrigger className={cn("cursor-pointer")}>
                  {(() => {
                    if (
                      marketType === MarketType.vault.value ||
                      marketCategory === "boyco" ||
                      item.chainId === SONIC_CHAIN_ID
                    ) {
                      return (
                        <SparkleIcon
                          className="h-5 w-5"
                          style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                        />
                      );
                    }

                    return (
                      <ShieldIcon
                        className="h-5 w-5"
                        style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                      />
                    );
                  })()}
                </TooltipTrigger>
                {createPortal(
                  <TooltipContent className={cn("bg-white", "max-w-80")}>
                    {(() => {
                      if (marketCategory === "boyco") {
                        return "Variable Rate, will change based on # of deposits";
                      }
                      if (
                        marketType === MarketType.vault.value ||
                        item.chainId === SONIC_CHAIN_ID
                      ) {
                        return "Variable Incentive Rate, based on # of participants";
                      }
                      return "Fixed Incentive Rate";
                    })()}
                  </TooltipContent>,
                  document.body
                )}
              </Tooltip>

              <span
                style={{
                  color: tokenColor || DEFAULT_TOKEN_COLOR,
                }}
              >
                {formatNumber(item.yieldRate, {
                  type: "percent",
                })}
              </span>
            </div>

            {beraToken && (
              <TokenEstimator defaultTokenId={[item.id]}>
                <SquarePenIcon
                  strokeWidth={2}
                  className="h-4 w-4 cursor-pointer text-secondary transition-all duration-200 ease-in-out hover:opacity-80"
                  color={tokenColor || DEFAULT_TOKEN_COLOR}
                />
              </TokenEstimator>
            )}
          </div>
        )}
      </div>
    );
  }
);

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: (TokenQuote & {
      rawAmount?: string;
      tokenAmount?: number;
      tokenAmountUsd?: number;
      yieldRate?: number;
      yieldText?: string;
    })[];
    baseKey: string;
    closeParentModal?: () => void;
    marketType?: number;
    marketCategory?: string;
  }
>(
  (
    {
      className,
      breakdown,
      baseKey,
      closeParentModal,
      marketType,
      marketCategory,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {breakdown.map((item) => (
          <BreakdownRow
            key={item.id}
            item={item}
            baseKey={baseKey}
            closeParentModal={closeParentModal}
            marketType={marketType}
            marketCategory={marketCategory}
          />
        ))}
      </div>
    );
  }
);

const NetYield = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    baseKey: string;
    yieldRate: number;
  }
>(({ className, baseKey, yieldRate, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3 font-normal text-success", className)}
      {...props}
    >
      <div className="w-full border-b border-divider"></div>
      <div
        key={`yield-breakdown:${baseKey}:net-yield`}
        className=" flex flex-row items-center justify-between"
      >
        <div className="flex flex-row items-center gap-2">
          <SparklesIcon className="h-4 w-4" color="#3CC27A" strokeWidth={2} />
          <span>Net APY</span>
        </div>
        <div className="">
          {formatNumber(yieldRate, {
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
    baseKey: string;
    marketType?: number;
    marketCategory?: string;
    activeIncentives?: EnrichedMarket["activeIncentives"];
    underlyingIncentives?: EnrichedMarket["underlyingIncentives"];
    nativeIncentives?: EnrichedMarket["nativeIncentives"];
    externalIncentives?: EnrichedMarket["externalIncentives"];
  }
>(
  (
    {
      className,
      baseKey,
      marketType,
      marketCategory,
      activeIncentives,
      underlyingIncentives,
      nativeIncentives,
      externalIncentives,
      ...props
    },
    ref
  ) => {
    const allIncentives = useMemo(() => {
      return [
        ...(activeIncentives || []),
        ...(underlyingIncentives || []),
        ...(nativeIncentives || []),
        ...(externalIncentives || []),
      ];
    }, [
      activeIncentives,
      underlyingIncentives,
      nativeIncentives,
      externalIncentives,
    ]);

    const combinedUnderlyingAndNativeIncentives = [
      ...(underlyingIncentives || []),
      ...(nativeIncentives || []),
    ];

    const totalLength = allIncentives.length;

    const netYield = useMemo(() => {
      return (
        (activeIncentives?.reduce((acc, item) => acc + item.yieldRate, 0) ||
          0) +
        (combinedUnderlyingAndNativeIncentives?.reduce(
          (acc, item) => acc + item.yieldRate,
          0
        ) || 0)
      );
    }, [activeIncentives, combinedUnderlyingAndNativeIncentives]);

    return (
      <HoverCard openDelay={200} closeDelay={200}>
        <HoverCardTrigger className={cn("flex cursor-pointer items-end")}>
          {props.children}
        </HoverCardTrigger>
        {typeof window !== "undefined" &&
          totalLength > 0 &&
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
                {activeIncentives && activeIncentives.length > 0 && (
                  <div>
                    <BreakdownItem>
                      <BreakdownTitle>Royco Fixed Rate</BreakdownTitle>
                      <BreakdownContent
                        className="mt-1"
                        breakdown={activeIncentives}
                        baseKey={baseKey}
                        marketType={marketType}
                        marketCategory={marketCategory}
                      />
                    </BreakdownItem>
                  </div>
                )}

                {combinedUnderlyingAndNativeIncentives.length > 0 && (
                  <BreakdownItem>
                    <BreakdownTitle>Variable Rate</BreakdownTitle>
                    <BreakdownContent
                      className="mt-1"
                      breakdown={combinedUnderlyingAndNativeIncentives}
                      baseKey={baseKey}
                      marketType={marketType}
                      marketCategory={marketCategory}
                    />
                  </BreakdownItem>
                )}

                <BreakdownItem>
                  <NetYield baseKey={baseKey} yieldRate={netYield} />
                </BreakdownItem>
              </div>
            </HoverCardContent>,
            document.body
          )}
      </HoverCard>
    );
  }
);
