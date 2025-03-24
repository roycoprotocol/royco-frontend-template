"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Vibrant } from "node-vibrant/browser";
import { useActiveMarket } from "../../hooks";
import { SecondaryLabel, TertiaryLabel } from "../../composables";
import { Circle } from "lucide-react";
import { RoycoMarketType } from "royco/market";
import { DEFAULT_TOKEN_COLOR } from "../market-info/annual-yield-details/incentive-details";
import formatNumber from "@/utils/numbers";

const DEFAULT_OFFER_TEXT_COLOR = "#737373";

const DEFAULT_AP_OFFER_COLOR = "#e7e7e7";
const DEFAULT_IP_OFFER_COLOR = "#25be25";

export const description = "A bar chart with an active bar";

function CustomizedXAxisTick(props: any) {
  const { x, y, payload, data } = props;

  const apr = data[payload.index]?.annual_change_ratio ?? 0;
  const token_data = data[payload.index]?.tokens_data?.[0] ?? null;
  const textColor = data[payload.index]?.textColor;

  let formatted_data = (
    <tspan textAnchor="middle" x="0" dy="16">
      {apr >= 0 ? "+" : "-"}
      {formatNumber(Math.abs(apr), {
        type: "percent",
      })}
    </tspan>
  );

  if (token_data && token_data.type === "point" && apr === 0) {
    formatted_data = (
      <tspan textAnchor="middle" x="0" dy="16">
        {formatNumber(token_data.token_amount)}
      </tspan>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} fill={textColor} textAnchor="middle">
        {formatted_data}
      </text>
      {token_data && (
        <text x={0} y={0} dy={30} fill={textColor} textAnchor="middle">
          {token_data.symbol}
        </text>
      )}
    </g>
  );
}

export const OfferListVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    propsHighestOffers,
    currentHighestOffers,
    currentMarketData,
    marketMetadata,
  } = useActiveMarket();

  const [tokenColor, setTokenColor] = useState<string | null>(null);

  const highestIncentiveToken = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.recipe.id) {
      if (
        !currentHighestOffers ||
        currentHighestOffers.ip_offers.length === 0 ||
        currentHighestOffers.ip_offers[0].tokens_data.length === 0
      ) {
        return null;
      }

      return currentHighestOffers.ip_offers[0].tokens_data[0];
    }

    if (marketMetadata.market_type === RoycoMarketType.vault.id) {
      if (
        !currentMarketData ||
        currentMarketData.incentive_tokens_data.length === 0
      ) {
        return null;
      }

      return currentMarketData.incentive_tokens_data.find((token_data) => {
        return BigInt(token_data.raw_amount ?? "0") > BigInt(0);
      });
    }
  }, [currentMarketData, currentHighestOffers, marketMetadata]);

  useEffect(() => {
    if (highestIncentiveToken) {
      const getTokenColor = async () => {
        if (highestIncentiveToken.image) {
          const url = new URL(highestIncentiveToken.image);
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
    }
  }, [currentHighestOffers]);

  const chartConfig = useMemo(() => {
    return {
      ap_offer: {
        label: "AP Offer",
        color: DEFAULT_AP_OFFER_COLOR,
        textColor: DEFAULT_OFFER_TEXT_COLOR,
      },
      ip_offer: {
        label: "IP Offer",
        color: tokenColor ?? DEFAULT_IP_OFFER_COLOR,
        textColor: tokenColor ?? DEFAULT_OFFER_TEXT_COLOR,
      },
    };
  }, [currentMarketData, tokenColor]);

  const chartData = useMemo(() => {
    if (!currentHighestOffers) {
      return [];
    }

    const data = [];
    if (currentHighestOffers.ap_offers.length > 0) {
      data.push(
        ...currentHighestOffers.ap_offers.map((offer) => {
          return {
            market_type: currentMarketData.market_type,
            annual_change_ratio: offer.annual_change_ratio,
            quantity_value_usd: offer.quantity_value_usd,
            fill: chartConfig.ap_offer.color,
            offer_side: offer.offer_side,
            quantity: offer.quantity,
            input_token_amount: offer.input_token_data.token_amount,
            input_token_data: offer.input_token_data,
            incentive_value_usd: offer.incentive_value_usd,
            tokens_data: offer.tokens_data,
            textColor: chartConfig.ap_offer.textColor,
          };
        })
      );
    }
    if (currentHighestOffers.ip_offers.length > 0) {
      data.push(
        ...currentHighestOffers.ip_offers
          .map((offer) => {
            let tokensData = offer.tokens_data;
            if (currentMarketData.market_type === RoycoMarketType.vault.value) {
              tokensData = offer.tokens_data
                .map((token) => {
                  const index = currentMarketData.base_incentive_ids?.findIndex(
                    (id) => id === token.id
                  );

                  if (index === undefined || index === -1) {
                    return null;
                  }

                  const startTimestamp = parseInt(
                    currentMarketData.base_start_timestamps?.[index] ?? "0"
                  );
                  const endTimestamp = parseInt(
                    currentMarketData.base_end_timestamps?.[index] ?? "0"
                  );
                  const currentTimestamp = Math.floor(Date.now() / 1000);

                  const isActive =
                    startTimestamp &&
                    endTimestamp &&
                    currentTimestamp >= startTimestamp &&
                    currentTimestamp <= endTimestamp;

                  if (!isActive) {
                    return null;
                  }

                  return token;
                })
                .filter((token) => token !== null);
            }

            if (tokensData.length === 0) {
              return null;
            }

            return {
              market_type: currentMarketData.market_type,
              annual_change_ratio: offer.annual_change_ratio,
              quantity_value_usd: offer.quantity_value_usd,
              fill: chartConfig.ip_offer.color,
              offer_side: offer.offer_side,
              quantity: offer.quantity,
              input_token_amount: offer.input_token_data.token_amount,
              input_token_data: offer.input_token_data,
              incentive_value_usd: offer.incentive_value_usd,
              tokens_data: tokensData,
              textColor: chartConfig.ip_offer.textColor,
            };
          })
          .filter((offer) => offer !== null)
      );
    }

    // Sort the data by `annual_change_ratio`
    return data.sort(
      (a, b) => (a.annual_change_ratio ?? 0) - (b.annual_change_ratio ?? 0)
    );
  }, [currentHighestOffers, currentMarketData, tokenColor]);

  const YAxisLabel = useMemo(() => {
    if (currentMarketData && currentMarketData.input_token_data) {
      return `${currentMarketData.input_token_data.symbol} Offer Size`;
    }
    return "Offer Size";
  }, [currentMarketData]);

  if (propsHighestOffers.isLoading) {
    return (
      <div
        ref={ref}
        className={cn("flex h-80 flex-col place-content-center", className)}
        {...props}
      >
        <LoadingSpinner className="h-4 w-4" />
      </div>
    );
  }

  if (!chartData.length || !currentHighestOffers) {
    return (
      <div
        ref={ref}
        className={cn("flex h-80 flex-col place-content-center", className)}
        {...props}
      >
        <AlertIndicator>No market activity yet</AlertIndicator>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("px-6 pb-6", className)} {...props}>
      {/**
       * Offer Chart Legend
       */}
      <div className="mt-3 flex justify-end">
        <div className="flex flex-col gap-1">
          <TertiaryLabel>
            <Circle
              className="h-4 w-4"
              fill={chartConfig.ip_offer.color}
              stroke="none"
            />
            <span className="ml-1 text-secondary">
              Incentive Provider Offer
            </span>
          </TertiaryLabel>
          <TertiaryLabel>
            <Circle
              className="h-4 w-4"
              fill={chartConfig.ap_offer.color}
              stroke="none"
            />
            <span className="ml-1 text-secondary">User Offer</span>
          </TertiaryLabel>
        </div>
      </div>

      {/**
       * Offer Chart
       */}
      <div className="relative">
        {/**
         * Y Axis Label
         */}
        <div className="absolute bottom-0 left-0 top-0 flex w-5 items-center justify-center">
          <div className="flex shrink-0 -rotate-90 items-center gap-1">
            <TokenDisplayer
              tokens={[currentMarketData.input_token_data] as any}
              size={4}
              symbols={true}
              symbolClassName="text-black text-xs font-medium"
            />
            <SecondaryLabel className="font-regular text-xs">
              Offer Size
            </SecondaryLabel>
          </div>
        </div>

        <ChartContainer
          className={cn("mt-5 flex grow flex-col")}
          config={chartConfig}
        >
          <BarChart
            margin={{
              left: 10,
              bottom: 20,
            }}
            accessibilityLayer
            data={chartData}
          >
            <XAxis
              dataKey="annual_change_ratio"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={<CustomizedXAxisTick data={chartData} />}
            />

            <YAxis
              dataKey="input_token_amount"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickFormatter={(value) => {
                const formattedValue = formatNumber(value as number);
                return formattedValue;
              }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              maxBarSize={20}
              dataKey="input_token_amount"
              strokeWidth={2}
              radius={[10, 10, 10, 10]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
});
