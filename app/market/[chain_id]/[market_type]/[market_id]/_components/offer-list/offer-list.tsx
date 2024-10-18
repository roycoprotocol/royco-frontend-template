import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useActiveMarket } from "../hooks";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { useHighestOffers } from "@/sdk/hooks";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { produce } from "immer";
import { SpringNumber } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { FallMotion } from "@/components/animations";

const OfferListRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type: "ap" | "ip";
    indexKey: string;
    customKey: string;
    keyInfo: {
      previousValue: number;
      currentValue: number;
    };
    valueInfo: {
      previousValue: number;
      currentValue: number;
    };
    delay?: number;
  }
>(
  (
    {
      className,
      delay,
      indexKey,
      type,
      customKey,
      keyInfo,
      valueInfo,
      ...props
    },
    ref
  ) => {
    return (
      <FallMotion
        delay={delay}
        key={indexKey}
        ref={ref}
        customKey={customKey}
        height="1rem"
        className={cn("w-full", className)}
        contentClassName="flex flex-row items-center justify-between w-full h-4 text-sm"
        {...props}
      >
        <SecondaryLabel>
          <SpringNumber
            defaultColor={type === "ap" ? "text-success" : "text-error"}
            previousValue={keyInfo.previousValue}
            currentValue={keyInfo.currentValue}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              useGrouping: true,
            }}
          />
        </SecondaryLabel>
        <SecondaryLabel>
          <SpringNumber
            previousValue={valueInfo.previousValue}
            currentValue={valueInfo.currentValue}
            numberFormatOptions={{
              style: "percent",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          />
        </SecondaryLabel>
      </FallMotion>
    );
  }
);

export const OfferList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    currentMarketData,
    propsHighestOffers,
    currentHighestOffers,
    previousHighestOffers,
  } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-[18rem] w-full shrink-0 grow flex-col overflow-hidden",
        "pb-5",
        className
      )}
      {...props}
    >
      <TertiaryLabel className={cn("flex-none shrink-0", BASE_PADDING)}>
        OFFER LIST
      </TertiaryLabel>

      <div
        className={cn(
          "flex w-full flex-none shrink-0 flex-row justify-between",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT
        )}
      >
        <TertiaryLabel className="text-tertiary">SIZE</TertiaryLabel>
        <TertiaryLabel className="text-tertiary">AIP</TertiaryLabel>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col-reverse overflow-y-scroll",
          "gap-2 py-2",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT,
          BASE_MARGIN_TOP.SM
        )}
      >
        {!!currentHighestOffers &&
        !!currentHighestOffers.ip_offers &&
        currentHighestOffers.ip_offers.length !== 0 ? (
          currentHighestOffers?.ip_offers.map((offer, offerIndex) => {
            const BASE_KEY = `market:offer:${offer.offer_id}-${offer.offer_side}`;
            const INDEX_KEY = `market:offer:${offer.offer_side}:${offerIndex}`;

            const keyInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ip_offers.length
                  ? previousHighestOffers?.ip_offers[offerIndex]
                      .quantity_value_usd ?? 0
                  : 0,

              currentValue: offer.quantity_value_usd as number,
            };

            const valueInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ip_offers.length
                  ? previousHighestOffers?.ip_offers[offerIndex]
                      .annual_change_ratio ?? 0
                  : 0,
              currentValue: offer.annual_change_ratio as number,
            };

            return (
              <OfferListRow
                type="ap"
                customKey={`${BASE_KEY}:${keyInfo.previousValue}:${keyInfo.currentValue}:${valueInfo.previousValue}:${valueInfo.currentValue}`}
                indexKey={INDEX_KEY}
                keyInfo={keyInfo}
                valueInfo={valueInfo}
              />
            );
          })
        ) : (
          <AlertIndicator className="h-full">No offers yet</AlertIndicator>
        )}
      </div>

      {/**
       * Central Bar
       */}
      <div
        className={cn(
          "flex flex-none flex-row items-center justify-between border-y border-divider",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT,
          "py-2"
        )}
      >
        <SecondaryLabel className="font-medium text-black">
          {/**
           * @TODO
           * For Recipe, this should be currentMarketData.quantity_value_usd
           * For Vault, this needs to be calculated
           */}
          {/* {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            useGrouping: true,
          }).format(
           currentMarketData?.input_token_data.quantity_value_usd
          )} */}
        </SecondaryLabel>

        <SecondaryLabel className="font-medium text-black">
          MARKET
        </SecondaryLabel>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-scroll",
          "gap-2 py-2",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT
        )}
      >
        {!!currentHighestOffers &&
        !!currentHighestOffers.ap_offers &&
        currentHighestOffers.ap_offers.length !== 0 ? (
          currentHighestOffers?.ap_offers.map((offer, offerIndex) => {
            const BASE_KEY = `market:offer:${offer.offer_id}-${offer.offer_side}`;
            const INDEX_KEY = `market:offer:${offer.offer_side}:${offerIndex}`;

            const keyInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ap_offers.length
                  ? previousHighestOffers?.ap_offers[offerIndex]
                      .quantity_value_usd ?? 0
                  : 0,

              currentValue: offer.quantity_value_usd as number,
            };

            const valueInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ap_offers.length
                  ? previousHighestOffers?.ap_offers[offerIndex].change_ratio ??
                    0
                  : 0,
              currentValue: offer.annual_change_ratio as number,
            };

            return (
              <OfferListRow
                type="ip"
                customKey={`${BASE_KEY}:${keyInfo.previousValue}:${keyInfo.currentValue}:${valueInfo.previousValue}:${valueInfo.currentValue}`}
                indexKey={INDEX_KEY}
                keyInfo={keyInfo}
                valueInfo={valueInfo}
              />
            );
          })
        ) : (
          <AlertIndicator className="h-full">No offers yet</AlertIndicator>
        )}
      </div>
    </div>
  );
});
