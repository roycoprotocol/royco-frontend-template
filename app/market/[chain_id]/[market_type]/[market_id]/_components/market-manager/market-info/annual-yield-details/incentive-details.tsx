import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MarketType, useGlobalStates, useMarketManager } from "@/store";
import {
  AlertIndicator,
  InfoCard,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";
import { format } from "date-fns";
import { RoycoMarketType } from "royco/market";
import { BigNumber } from "ethers";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LoadingSpinner, TokenEditor } from "@/components/composables";
import { SlideUpWrapper } from "@/components/animations";
import { useActiveMarket } from "../../../hooks";
import {
  BASE_MARGIN_TOP,
  INFO_ROW_CLASSES,
  SecondaryLabel,
  TertiaryLabel,
} from "../../../composables";
import LightningIcon from "../../../icons/lightning";
import { Vibrant } from "node-vibrant/browser";
import ShieldIcon from "../../../icons/shield";
import SparkleIcon from "../../../icons/sparkle";
import { TokenEstimator } from "@/app/_components/ui/token-estimator";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import formatNumber from "@/utils/numbers";
export const DEFAULT_TOKEN_COLOR = "#bdc5d1";

export const BERA_TOKEN_ID = "80094-0x0000000000000000000000000000000000000000";

export const TokenEstimatePopover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: any;
  }
>(({ className, token_data, children, ...props }, ref) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      openDelay={200}
      closeDelay={200}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger
        asChild
        onClick={() => {
          if (open === false) {
            setOpen(true);
          }
        }}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 overflow-hidden p-0">
        <TokenEditor
          closeHoverCard={() => {
            setOpen(false);
            triggerRef.current?.blur();
          }}
          token_data={{
            ...token_data,
            fdv: token_data.fdv ?? 0,
            total_supply: token_data.total_supply
              ? token_data.total_supply === 0
                ? 1
                : token_data.total_supply
              : 0,
            price: token_data.price ?? 0,
            allocation: token_data.allocation
              ? token_data.allocation * 100
              : 100,
            token_amount: token_data.token_amount ?? 0,
          }}
        />
      </HoverCardContent>
    </HoverCard>
  );
});

export const IncentiveToken = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: any;
    symbolClassName?: string;
  }
>(({ className, token_data, symbolClassName, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {token_data.length && token_data.length > 0 ? (
        <div className="flex items-center">
          <TokenDisplayer
            className={cn("")}
            imageClassName="grayscale"
            tokens={token_data}
            size={4}
            symbols={false}
          />
          <div className="text-sm font-medium">
            {token_data
              .map((token: any) => {
                return token.symbol;
              })
              .join(", ")}
          </div>
        </div>
      ) : (
        <TokenDisplayer
          className={cn("")}
          symbolClassName={cn("text-sm font-medium", symbolClassName)}
          tokens={[token_data]}
          size={4}
          symbols={true}
        />
      )}
    </div>
  );
});

export const IncentiveTokenDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: any;
    category: string;
    labelClassName?: string;
  }
>(({ className, token_data, category, labelClassName, ...props }, ref) => {
  const { currentMarketData } = useActiveMarket();
  const { customTokenData } = useGlobalStates();

  const [tokenColor, setTokenColor] = useState<string | null>(null);

  useEffect(() => {
    const getTokenColor = async () => {
      if (token_data && token_data.image) {
        const url = new URL(token_data.image);
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
  }, [token_data.image]);

  const showEstimate = useMemo(() => {
    if (token_data.type === "point" && token_data.annual_change_ratio === 0) {
      return true;
    }
    return false;
  }, [token_data]);

  const beraToken = useMemo(() => {
    if (token_data && token_data.tokens && token_data.tokens.length > 0) {
      const token = token_data.tokens.find(
        (token: any) => token.id === BERA_TOKEN_ID
      );
      if (token) {
        return token;
      }
    }
    return;
  }, [token_data]);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-end", className)}
      {...props}
    >
      <SecondaryLabel
        className={cn("flex items-center gap-2 text-black", labelClassName)}
      >
        {showEstimate ? (
          <TokenEstimator defaultTokenId={[token_data.id]}>
            <Button
              variant="link"
              className="flex w-full items-center gap-1 py-0 outline-none"
            >
              <LightningIcon className="h-5 w-5 fill-black" />
              <span className="text-sm font-medium underline">Estimate</span>
            </Button>
          </TokenEstimator>
        ) : (
          <>
            {category === "base" ? (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger className={cn("cursor-pointer")}>
                    {(() => {
                      if (
                        currentMarketData.market_type ===
                          MarketType.vault.value ||
                        currentMarketData?.category === "boyco"
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
                    <TooltipContent
                      className={cn("bg-white text-sm", "max-w-80")}
                    >
                      {(() => {
                        if (currentMarketData?.category === "boyco") {
                          return "Variable Rate, will change based on # of deposits";
                        }
                        if (
                          currentMarketData.market_type ===
                          MarketType.vault.value
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
                  className="flex h-5 items-center font-medium"
                  style={{ color: tokenColor || DEFAULT_TOKEN_COLOR }}
                >
                  {token_data.annual_change_ratio >= 0 ? "+" : "-"}
                  {formatNumber(Math.abs(token_data.annual_change_ratio), {
                    type: "percent",
                  })}
                </span>
              </div>
            ) : (
              <div className="flex gap-1">
                {beraToken && (
                  <Tooltip>
                    <TooltipTrigger className={cn("cursor-pointer")}>
                      <SparkleIcon className="h-5 w-5 text-secondary" />
                    </TooltipTrigger>
                    {createPortal(
                      <TooltipContent
                        className={cn("bg-white text-sm", "max-w-80")}
                      >
                        Variable Rate, will change based on # of deposits
                      </TooltipContent>,
                      document.body
                    )}
                  </Tooltip>
                )}

                <span className="flex h-5 items-center font-medium">
                  {formatNumber(token_data.annual_change_ratio, {
                    type: "percent",
                  })}
                </span>

                {beraToken && (
                  <InfoTip size="sm">
                    BERA is distributed among all depositors in Boyco. Rate is
                    variable based on Total TVL supplied, and not guaranteed.
                  </InfoTip>
                )}
              </div>
            )}
          </>
        )}
      </SecondaryLabel>

      {!!token_data.per_input_token && (
        <TertiaryLabel
          className={cn("mt-1 flex items-center justify-end gap-1", className)}
        >
          <span className="text-right">
            {formatNumber(token_data.per_input_token)}{" "}
          </span>
          <TokenDisplayer
            className="h-4 w-4"
            size={4}
            tokens={[token_data]}
            symbols={false}
          />
          <span>per</span>
          <TokenDisplayer
            className="h-4 w-4"
            size={4}
            tokens={[currentMarketData.input_token_data] as any}
            symbols={false}
          />
        </TertiaryLabel>
      )}

      {category === "base" && token_data.type !== "point" && (
        <div className="mt-1 flex flex-row items-center gap-1">
          <TertiaryLabel className={cn("text-right", className)}>
            {formatNumber(token_data.fdv, {
              type: "currency",
            })}{" "}
            FDV
          </TertiaryLabel>
        </div>
      )}
    </div>
  );
});

export const IncentiveDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { marketMetadata, currentMarketData, currentHighestOffers, isLoading } =
    useActiveMarket();

  const { incentiveType, viewType } = useMarketManager();

  const highestIncentives = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.recipe.id) {
      if (
        !currentHighestOffers ||
        currentHighestOffers.ip_offers.length === 0 ||
        currentHighestOffers.ip_offers[0].tokens_data.length === 0
      ) {
        return [];
      }

      return currentHighestOffers.ip_offers[0].tokens_data;
    }

    if (marketMetadata.market_type === RoycoMarketType.vault.id) {
      if (
        !currentMarketData ||
        currentMarketData.incentive_tokens_data.length === 0
      ) {
        return [];
      }

      return currentMarketData.incentive_tokens_data.filter((token_data) => {
        return BigNumber.from(token_data.raw_amount ?? "0").gt(0);
      });
    }
  }, [currentMarketData, currentHighestOffers, marketMetadata]);

  const currentNativeIncentives = useMemo(() => {
    const tokens = currentMarketData.yield_breakdown.filter(
      (yield_breakdown) => yield_breakdown.category !== "base"
    );
    const annual_change_ratio = tokens.reduce(
      (acc, curr) => acc + curr.annual_change_ratio,
      0
    );
    return {
      tokens,
      annual_change_ratio,
    };
  }, [currentMarketData]);

  if (isLoading) {
    return (
      <div className="flex w-full shrink-0 flex-col items-center justify-center py-3">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (!!currentMarketData && !!marketMetadata) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-fit w-full shrink-0 flex-col",
          className,
          currentMarketData.incentive_tokens_data.length === 0 &&
            currentMarketData.yield_breakdown.length === 0 &&
            currentMarketData.external_incentives.length === 0
            ? "mt-0"
            : "mt-4"
        )}
        {...props}
      >
        {/* {(!highestIncentives || highestIncentives.length === 0) && (
          <AlertIndicator>No add. incentives offered</AlertIndicator>
        )} */}

        {/**
         * Market Incentives
         */}
        {highestIncentives && highestIncentives.length !== 0 && (
          <InfoCard
            className={cn(
              "-mx-4 flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll border-t border-divider px-4 py-2"
            )}
          >
            {highestIncentives.map((token_data, token_data_index) => {
              const BASE_KEY = `market:incentive-info:${incentiveType}:${token_data.id}`;

              const start_date = Number(
                currentMarketData.base_start_timestamps?.[token_data_index]
              );
              const end_date = Number(
                currentMarketData.base_end_timestamps?.[token_data_index]
              );

              const base_breakdown = currentMarketData.yield_breakdown.find(
                (breakdown: any) =>
                  breakdown.category === "base" &&
                  breakdown.id === token_data.id
              );

              return (
                <SlideUpWrapper delay={0.1 + token_data_index * 0.1}>
                  <InfoCard.Row key={BASE_KEY} className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>
                      <IncentiveToken
                        className="mb-1"
                        token_data={{
                          ...token_data,
                          ...base_breakdown,
                        }}
                      />

                      <TertiaryLabel className="ml-5">
                        Negotiable Rate
                      </TertiaryLabel>

                      {start_date && end_date ? (
                        <TertiaryLabel className={cn("ml-5")}>
                          {`${format(start_date * 1000, "dd MMM yyyy")} - ${format(end_date * 1000, "dd MMM yyyy")}`}
                        </TertiaryLabel>
                      ) : null}
                    </InfoCard.Row.Key>

                    <InfoCard.Row.Value>
                      <IncentiveTokenDetails
                        token_data={{
                          ...token_data,
                          ...base_breakdown,
                        }}
                        category={"base"}
                      />
                    </InfoCard.Row.Value>
                  </InfoCard.Row>
                </SlideUpWrapper>
              );
            })}
          </InfoCard>
        )}

        {currentNativeIncentives &&
          currentNativeIncentives.tokens.length !== 0 && (
            <InfoCard
              className={cn(
                "flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll border-t border-divider",
                "-mx-4 -mb-3 bg-z2 px-4 py-3",
                BASE_MARGIN_TOP.MD
              )}
            >
              <SlideUpWrapper delay={0.1}>
                <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
                  <InfoCard.Row.Key>
                    <IncentiveToken
                      className="mb-1"
                      symbolClassName="text-secondary font-normal"
                      token_data={currentNativeIncentives.tokens}
                    />

                    <TertiaryLabel className="ml-5">
                      Underlying Rate
                    </TertiaryLabel>
                  </InfoCard.Row.Key>

                  <InfoCard.Row.Value>
                    <IncentiveTokenDetails
                      token_data={currentNativeIncentives}
                      category={"underlying_native"}
                      labelClassName="text-secondary"
                    />
                  </InfoCard.Row.Value>
                </InfoCard.Row>
              </SlideUpWrapper>
            </InfoCard>
          )}
      </div>
    );
  }
});
