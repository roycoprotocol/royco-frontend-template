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
import {
  BASE_MARGIN_TOP,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  PrimaryLabel,
} from "../composables";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { AlertIndicator } from "@/components/common";

export const description = "A bar chart with an active bar";

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

  const chartConfig = useMemo(() => {
    return {
      ap_offer: {
        label: "AP Offer",
        color: "#BE2525",
      },
      ip_offer: {
        label: "IP Offer",
        color: "#25BE25",
      },
    };
  }, [currentMarketData]);

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
      {/* <PrimaryLabel
        className={cn(
          "text-3xl font-light",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT,
          BASE_MARGIN_TOP.SM
        )}
      >
        <SpringNumber
          previousValue={previousMarketData?.annual_change_ratio ?? 0}
          currentValue={currentMarketData?.annual_change_ratio ?? 0}
          numberFormatOptions={{
            style: "percent",
            notation: "compact",
            useGrouping: true,
            compactDisplay: "short",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
      </PrimaryLabel> */}

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
              margin={{ left: 30, bottom: 30 }}
              accessibilityLayer
              data={chartData}
            >
              <XAxis
                dataKey="incentive_value_usd"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                label={{
                  value: "Incentives via Royco",
                  position: "insideBottom",
                  offset: -20,
                }}
                tickFormatter={(value, index) => {
                  const token_data = chartData[index]?.tokens_data ?? [];

                  const incentive_token_data =
                    Intl.NumberFormat("en-US", {
                      style: "decimal",
                      notation: "compact",
                      useGrouping: true,
                      compactDisplay: "short",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(token_data[0]?.token_amount ?? 0) +
                    " " +
                    (token_data[0]?.symbol ?? "") +
                    (token_data.length > 1 ? " + ..." : "");

                  return incentive_token_data;
                }}
              />
              <YAxis
                orientation="left"
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Fillable Size",
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
