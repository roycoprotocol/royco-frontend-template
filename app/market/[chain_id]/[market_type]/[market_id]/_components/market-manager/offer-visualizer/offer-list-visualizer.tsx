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
import { AlertIndicator } from "@/components/common";
import { Vibrant } from "node-vibrant/browser";
import { useActiveMarket } from "../../hooks";
import { TertiaryLabel } from "../../composables";
import { Circle, Square } from "lucide-react";

export const description = "A bar chart with an active bar";

function CustomizedXAxisTick(props: any) {
  const { x, y, payload, data } = props;

  const apr = data[payload.index]?.annual_change_ratio ?? 0;
  const token_data = data[payload.index]?.tokens_data?.[0] ?? null;
  const textColor = data[payload.index]?.textColor;

  const formatted_apr = (
    <tspan textAnchor="middle" x="0" dy="16">
      {apr >= 0 ? "+" : "-"}
      {Intl.NumberFormat("en-US", {
        style: "percent",
        notation: "compact",
        useGrouping: true,
        compactDisplay: "short",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Math.abs(apr))}
    </tspan>
  );

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} fill={textColor} textAnchor="middle">
        {formatted_apr}
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
  const { propsHighestOffers, currentHighestOffers, currentMarketData } =
    useActiveMarket();

  const nativeIncentives = {
    native_annual_change_ratio: currentMarketData.yield_breakdown
      .filter((yield_breakdown) => yield_breakdown.category !== "base")
      .reduce(
        (acc, yield_breakdown) => acc + yield_breakdown.annual_change_ratio,
        0
      ),
    native_annual_change_ratios: currentMarketData.yield_breakdown.filter(
      (yield_breakdown) => yield_breakdown.category !== "base"
    ),
  };

  const [tokenColor, setTokenColor] = useState<string | null>(null);

  useEffect(() => {
    if (
      currentHighestOffers &&
      currentHighestOffers.ip_offers &&
      currentHighestOffers.ip_offers.length > 0
    ) {
      const offer = currentHighestOffers.ip_offers[0];
      const token_data = offer.tokens_data?.[0];

      const getTokenColor = async () => {
        if (token_data.image) {
          const url = new URL(token_data.image);
          url.search = "";
          try {
            const palette = await Vibrant.from(url.toString()).getPalette();
            if (palette && palette.Vibrant) {
              setTokenColor(palette.Vibrant?.hex);
            }
          } catch (error) {
            setTokenColor("#bdc5d1");
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
        color: "#E7E7E7",
        textColor: "#737373",
      },
      ip_offer: {
        label: "IP Offer",
        color: tokenColor ?? "#25BE25",
        textColor: tokenColor ?? "#25BE25",
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
        ...currentHighestOffers.ip_offers.map((offer) => {
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
            tokens_data: offer.tokens_data,
            textColor: chartConfig.ip_offer.textColor,
          };
        })
      );
    }

    // Sort the data by `annual_change_ratio`
    return data.sort(
      (a, b) => (a.annual_change_ratio ?? 0) - (b.annual_change_ratio ?? 0)
    );
  }, [currentHighestOffers, currentMarketData, tokenColor]);

  if (propsHighestOffers.isLoading) {
    return (
      <div className="flex h-80 flex-col place-content-center">
        <LoadingSpinner className="h-4 w-4" />
      </div>
    );
  }

  if (!chartData.length || !currentHighestOffers) {
    return (
      <div className="flex h-80 flex-col place-content-center">
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
            label={{
              value: "Offer Size",
              position: "left",
              angle: -90,
            }}
            tickMargin={0}
            tickFormatter={(value) => {
              const formattedValue = Intl.NumberFormat("en-US", {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(value as number);
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
  );
});
