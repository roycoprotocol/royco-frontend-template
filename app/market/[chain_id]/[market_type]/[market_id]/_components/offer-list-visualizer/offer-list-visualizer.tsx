"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useActiveMarket } from "../hooks";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { MarketType } from "@/store";

export const description = "A bar chart with an active bar";

function CustomizedXAxisTick(props: any) {
  const { x, y, payload, data, nativeIncentives } = props;

  const apr = data[payload.index]?.annual_change_ratio ?? 0;
  const token_data = data[payload.index]?.tokens_data ?? [];

  const incentive_token_data = token_data.map((token: any) => {
    return (
      <tspan textAnchor="middle" x="0">
        {Intl.NumberFormat("en-US", {
          style: "decimal",
          notation: "compact",
          useGrouping: true,
          compactDisplay: "short",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(token.token_amount ?? 0) +
          " " +
          (token.symbol ?? "")}
      </tspan>
    );
  });

  const formatted_apr = (
    <tspan textAnchor="middle" x="0" dy="16">
      {Intl.NumberFormat("en-US", {
        style: "percent",
        notation: "compact",
        useGrouping: true,
        compactDisplay: "short",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(apr + nativeIncentives.native_annual_change_ratio)}
      <title>
        {`Royco APR: ${Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(apr)}\n`}
        {nativeIncentives.native_annual_change_ratios
          .map(
            (ratio: any) =>
              ratio.label +
              ": " +
              Intl.NumberFormat("en-US", {
                style: "percent",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ratio.annual_change_ratio)
          )
          .join("\n")}
      </title>
    </tspan>
  );

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} fill="#666">
        {incentive_token_data}
        {formatted_apr}
      </text>
    </g>
  );
}

export const OfferListVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { propsHighestOffers, currentHighestOffers, currentMarketData } =
    useActiveMarket();

  const nativeIncentives = currentMarketData.native_yield ?? {
    native_annual_change_ratio: 0,
    native_annual_change_ratios: [],
  };

  const chartConfig = useMemo(() => {
    return {
      ap_offer: {
        label: "AP Offer",
        color:
          currentMarketData.market_type === MarketType.vault.value
            ? "#25BE25"
            : "#BE2525",
      },
      ip_offer: {
        label: "IP Offer",
        color:
          currentMarketData.market_type === MarketType.vault.value
            ? "#BE2525"
            : "#25BE25",
      },
    };
  }, [currentMarketData]);

  const chartData = currentHighestOffers
    ? [
        ...currentHighestOffers.ap_offers.map((offer) => {
          return {
            annual_change_ratio: offer.annual_change_ratio,
            quantity_value_usd: offer.quantity_value_usd,
            fill: chartConfig.ap_offer.color,
            offer_side: offer.offer_side,
            quantity: offer.quantity,
            input_token_data: offer.input_token_data,
            incentive_value_usd: offer.incentive_value_usd,
            tokens_data: offer.tokens_data,
          };
        }),
        ...currentHighestOffers.ip_offers.map((offer) => {
          return {
            annual_change_ratio: offer.annual_change_ratio,
            quantity_value_usd: offer.quantity_value_usd,
            fill: chartConfig.ip_offer.color,
            offer_side: offer.offer_side,
            quantity: offer.quantity,
            input_token_data: offer.input_token_data,
            incentive_value_usd: offer.incentive_value_usd,
            tokens_data: offer.tokens_data,
          };
        }),
      ] // Sort the data by `change_ratio` (X-axis key)
        .sort(
          (a, b) => (a.incentive_value_usd ?? 0) - (b.incentive_value_usd ?? 0)
        )
    : [];

  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {propsHighestOffers.isLoading && (
        <div className="flex grow flex-col place-content-center items-center">
          <LoadingSpinner className="h-4 w-4" />
        </div>
      )}

      {!propsHighestOffers.isLoading &&
        (chartData.length !== 0 || currentHighestOffers === undefined ? (
          <ChartContainer
            className={cn("mt-5 flex grow flex-col", "pb-4 pl-5 pr-1")}
            config={chartConfig}
          >
            <BarChart
              margin={{ left: 30, bottom: 20 }}
              accessibilityLayer
              data={chartData}
            >
              <XAxis
                dataKey="incentive_value_usd"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
                tick={
                  <CustomizedXAxisTick
                    data={chartData}
                    nativeIncentives={nativeIncentives}
                  />
                }
              />
              <YAxis
                orientation="left"
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Size",
                  position: "left",
                  offset: 20,
                  angle: -90,
                }}
                tickMargin={0}
                tickFormatter={(value) => {
                  const formattedValue = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    useGrouping: true,
                    notation: "compact",
                    minimumFractionDigits: 2,
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
                maxBarSize={60}
                dataKey="quantity_value_usd"
                strokeWidth={2}
                radius={2}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex grow flex-col place-content-center items-center">
            <AlertIndicator>No market activity yet</AlertIndicator>
          </div>
        ))}
    </div>
  );
});
