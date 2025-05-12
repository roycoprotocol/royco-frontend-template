import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMarketManager } from "@/store";
import { InfoCard, InfoTip, TokenDisplayer } from "@/components/common";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SlideUpWrapper } from "@/components/animations";
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
import { SONIC_CHAIN_ID, SONIC_ROYCO_GEM_BOOST_ID } from "royco/sonic";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { TokenQuote } from "royco/api";

export const DEFAULT_TOKEN_COLOR = "#bdc5d1";

export const BERA_TOKEN_ID = "80094-0x0000000000000000000000000000000000000000";

export const IncentiveToken = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: TokenQuote;
    symbolClassName?: string;
    category?: string;
  }
>(({ className, token_data, category, symbolClassName, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {category === "underlying_native" ? (
        <div className="flex items-center">
          <TokenDisplayer
            className={cn("")}
            imageClassName="grayscale"
            tokens={[token_data]}
            size={4}
            symbols={false}
          />
          <div className="text-sm font-medium">
            {(() => {
              if (token_data.id === SONIC_ROYCO_GEM_BOOST_ID) {
                return "Royco Gem Bonus";
              }
              return token_data.symbol;
            })()}
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
    token_data: TokenQuote & {
      yieldRate: number;
      tokens?: TokenQuote[];
      perInputToken?: number;
    };
    category: string;
    labelClassName?: string;
  }
>(({ className, token_data, category, labelClassName, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

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
    if (
      (token_data.type === "point" ||
        (token_data.tokens &&
          token_data.tokens.find(
            (token) => token.id === SONIC_ROYCO_GEM_BOOST_ID
          ))) &&
      token_data.yieldRate === 0
    ) {
      return true;
    }
    return false;
  }, [token_data]);

  const beraToken = useMemo(() => {
    if (token_data && token_data.tokens && token_data.tokens.length > 0) {
      const token = token_data.tokens.find(
        (token) => token.id === BERA_TOKEN_ID
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
          <TokenEstimator
            defaultTokenId={[token_data.id]}
            marketCategory={
              enrichedMarket && enrichedMarket.chainId === SONIC_CHAIN_ID
                ? "sonic"
                : undefined
            }
          >
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
                        enrichedMarket?.marketType === 1 ||
                        enrichedMarket?.category === "boyco" ||
                        enrichedMarket?.chainId === SONIC_CHAIN_ID
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
                        if (enrichedMarket?.category === "boyco") {
                          return "Variable Rate, will change based on # of deposits";
                        }
                        if (
                          enrichedMarket?.marketType === 1 ||
                          enrichedMarket?.chainId === SONIC_CHAIN_ID
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
                  {token_data.yieldRate >= 0 ? "+" : "-"}
                  {formatNumber(Math.abs(token_data.yieldRate), {
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
                  {formatNumber(token_data.yieldRate, {
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

      {!!token_data.perInputToken && (
        <TertiaryLabel
          className={cn("mt-1 flex items-center justify-end gap-1", className)}
        >
          <span className="text-right">
            {formatNumber(token_data.perInputToken)}{" "}
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
            tokens={
              enrichedMarket?.inputToken ? [enrichedMarket?.inputToken] : []
            }
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
  const { data: enrichedMarket, isLoading } = useAtomValue(
    loadableEnrichedMarketAtom
  );

  const { incentiveType } = useMarketManager();

  const currentNativeIncentives = useMemo(() => {
    const tokens = [
      ...(enrichedMarket?.underlyingIncentives ?? []),
      ...(enrichedMarket?.nativeIncentives ?? []),
    ];

    const yieldRate = tokens.reduce((acc, curr) => acc + curr.yieldRate, 0);
    return {
      tokens,
      yieldRate,
    };
  }, [enrichedMarket]);

  if (isLoading) {
    return (
      <div className="flex w-full shrink-0 flex-col items-center justify-center py-3">
        <LoadingCircle />
      </div>
    );
  }

  if (!!enrichedMarket) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-fit w-full shrink-0 flex-col",
          className,
          enrichedMarket.activeIncentives.length === 0 &&
            enrichedMarket?.underlyingIncentives?.length === 0 &&
            enrichedMarket?.nativeIncentives?.length === 0
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
        {enrichedMarket && enrichedMarket.activeIncentives.length !== 0 && (
          <InfoCard
            className={cn(
              "-mx-4 flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll border-t border-divider px-4 py-2"
            )}
          >
            {enrichedMarket.activeIncentives.map(
              (token_data, token_data_index) => {
                const BASE_KEY = `market:incentive-info:${incentiveType}:${token_data.id}`;

                return (
                  <SlideUpWrapper delay={0.1 + token_data_index * 0.1}>
                    <InfoCard.Row key={BASE_KEY} className={INFO_ROW_CLASSES}>
                      <InfoCard.Row.Key>
                        <IncentiveToken
                          className="mb-1"
                          token_data={{
                            ...token_data,
                          }}
                        />

                        <TertiaryLabel className="ml-5">
                          Negotiable Rate
                        </TertiaryLabel>

                        {token_data.startTimestamp &&
                        token_data.endTimestamp ? (
                          <TertiaryLabel className={cn("ml-5")}>
                            {`${format(Number(token_data.startTimestamp) * 1000, "dd MMM yyyy")} - ${format(Number(token_data.endTimestamp) * 1000, "dd MMM yyyy")}`}
                          </TertiaryLabel>
                        ) : null}
                      </InfoCard.Row.Key>

                      <InfoCard.Row.Value>
                        <IncentiveTokenDetails
                          token_data={{
                            ...token_data,
                          }}
                          category={"base"}
                        />
                      </InfoCard.Row.Value>
                    </InfoCard.Row>
                  </SlideUpWrapper>
                );
              }
            )}
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
              {currentNativeIncentives.tokens.map(
                (token_data, token_data_index) => {
                  return (
                    <SlideUpWrapper delay={0.1 + token_data_index * 0.1}>
                      <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
                        <InfoCard.Row.Key>
                          <IncentiveToken
                            className="mb-1"
                            category={"underlying_native"}
                            symbolClassName="text-secondary font-normal"
                            token_data={token_data}
                          />

                          <TertiaryLabel className="ml-5">
                            Underlying Rate
                          </TertiaryLabel>
                        </InfoCard.Row.Key>

                        <InfoCard.Row.Value>
                          <IncentiveTokenDetails
                            token_data={token_data}
                            category={"underlying_native"}
                            labelClassName="text-secondary"
                          />
                        </InfoCard.Row.Value>
                      </InfoCard.Row>
                    </SlideUpWrapper>
                  );
                }
              )}
            </InfoCard>
          )}
      </div>
    );
  }
});
