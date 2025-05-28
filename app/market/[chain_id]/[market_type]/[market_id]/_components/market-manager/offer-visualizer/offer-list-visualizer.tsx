"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Vibrant } from "node-vibrant/browser";
import { SecondaryLabel, TertiaryLabel } from "../../composables";
import { Circle } from "lucide-react";
import { DEFAULT_TOKEN_COLOR } from "../market-info/annual-yield-details/incentive-details";
import formatNumber from "@/utils/numbers";
import { useAtomValue } from "jotai";
import { loadableChartAtom, loadableEnrichedMarketAtom } from "@/store/market";
import { LoadingCircle } from "@/components/animations/loading-circle";

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
        {formatNumber(token_data.tokenAmount)}
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
  const { data: rawChartData, isLoading: isLoadingRawChartData } =
    useAtomValue(loadableChartAtom);
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const [tokenColor, setTokenColor] = useState<string | null>(null);

  const highestIncentiveToken = useMemo(() => {
    if (enrichedMarket && enrichedMarket.activeIncentives.length > 0) {
      return enrichedMarket.activeIncentives[0];
    } else {
      return null;
    }
  }, [enrichedMarket]);

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
  }, [rawChartData]);

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
  }, [enrichedMarket, tokenColor]);

  const chartData = useMemo(() => {
    if (!rawChartData) {
      return [];
    }

    const data = rawChartData.offers.map((offer) => {
      return {
        market_type: enrichedMarket?.marketType,
        annual_change_ratio: offer.yieldRate,
        quantity_value_usd: offer.inputTokenData.tokenAmountUsd,
        fill:
          offer.offerSide === 0
            ? chartConfig.ap_offer.color
            : chartConfig.ip_offer.color,
        offer_side: offer.offerSide,
        quantity: offer.inputTokenData.tokenAmount,
        input_token_amount: offer.inputTokenData.tokenAmount,
        input_token_data: offer.inputTokenData,
        incentive_value_usd: offer.incentiveTokensData.reduce(
          (acc, token) => acc + token.tokenAmountUsd,
          0
        ),
        tokens_data: offer.incentiveTokensData,
        textColor:
          offer.offerSide === 0
            ? chartConfig.ap_offer.textColor
            : chartConfig.ip_offer.textColor,
      };
    });

    // Sort the data by `annual_change_ratio`
    return data.sort(
      (a, b) => (a.annual_change_ratio ?? 0) - (b.annual_change_ratio ?? 0)
    );
  }, [rawChartData, enrichedMarket, tokenColor]);

  if (isLoadingRawChartData) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-80 w-full flex-col place-content-center items-center",
          className
        )}
        {...props}
      >
        <LoadingCircle />
      </div>
    );
  }

  if (!chartData.length) {
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
              tokens={
                enrichedMarket?.inputToken ? [enrichedMarket.inputToken] : []
              }
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
                return formattedValue ?? "0";
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
