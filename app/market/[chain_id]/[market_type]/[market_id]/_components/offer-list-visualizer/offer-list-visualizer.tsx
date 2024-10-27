"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useActiveMarket } from "../hooks";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  BASE_PADDING_TOP,
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { AlertIndicator } from "@/components/common";

export const description = "A bar chart with an active bar";

const chartConfig = {
  ap_offer: {
    label: "AP Offer",
    color: "#EB3C27",
  },
  ip_offer: {
    label: "IP Offer",
    color: "#3CC27A",
  },
} satisfies ChartConfig;

export const OfferListVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    propsHighestOffers,
    previousHighestOffers,
    currentHighestOffers,
    currentMarketData,
    previousMarketData,
  } = useActiveMarket();

  const currentChangeRatioDepth = Math.abs(
    currentHighestOffers
      ? currentHighestOffers.ap_offers.length > 0 &&
        currentHighestOffers.ip_offers.length > 0
        ? (currentHighestOffers.ip_offers[0].annual_change_ratio ?? 0) -
          (currentHighestOffers.ap_offers[0].annual_change_ratio ?? 0)
        : 0
      : 0
  );

  const previousChangeRatioDepth = Math.abs(
    previousHighestOffers
      ? previousHighestOffers.ap_offers.length > 0 &&
        previousHighestOffers.ip_offers.length > 0
        ? (previousHighestOffers.ip_offers[0].annual_change_ratio ?? 0) -
          (previousHighestOffers.ap_offers[0].annual_change_ratio ?? 0)
        : 0
      : 0
  );

  const chartData = currentHighestOffers
    ? [
        ...currentHighestOffers.ap_offers.map((offer) => {
          return {
            annual_change_ratio: offer.annual_change_ratio,
            quantity_value_usd: offer.quantity_value_usd,
            fill: chartConfig.ap_offer.color,
          };
        }),
        ...currentHighestOffers.ip_offers.map((offer) => {
          return {
            annual_change_ratio: offer.annual_change_ratio,
            quantity_value_usd: offer.quantity_value_usd,
            fill: chartConfig.ip_offer.color,
          };
        }),
      ] // Sort the data by `change_ratio` (X-axis key)
        .sort(
          (a, b) => (a.annual_change_ratio ?? 0) - (b.annual_change_ratio ?? 0)
        )
    : [];

  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      <TertiaryLabel
        className={cn(
          "flex-none shrink-0",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT,
          BASE_PADDING_TOP
        )}
      >
        DEPTH
      </TertiaryLabel>

      <PrimaryLabel
        className={cn(
          "text-3xl font-light",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT,
          BASE_MARGIN_TOP.SM
        )}
      >
        <SpringNumber
          previousValue={previousChangeRatioDepth}
          currentValue={currentChangeRatioDepth}
          numberFormatOptions={{
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
      </PrimaryLabel>

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
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="annual_change_ratio"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const formattedValue = Intl.NumberFormat("en-US", {
                    style: "percent",
                    notation: "compact",
                    compactDisplay: "short",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(value as number);

                  return formattedValue;
                }}
              />
              <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => {
                  const formattedValue = Intl.NumberFormat("en-US", {
                    style: "decimal",
                    // currency: "USD",
                    useGrouping: true,
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value as number);

                  return formattedValue;
                }}
              />
              {/* <ChartTooltip
cursor={false}
content={<ChartTooltipContent hideLabel />}
/> */}
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
