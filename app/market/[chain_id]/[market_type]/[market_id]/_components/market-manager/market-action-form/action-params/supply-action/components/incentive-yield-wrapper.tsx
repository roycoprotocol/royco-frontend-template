"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInputLabel } from "../../../../../composables";
import { MarketActionFormSchema } from "../../../market-action-form-schema";
import { z } from "zod";
import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { InputYieldSelector } from "../../composables/input-yield-selector";
import { DEFAULT_TOKEN_COLOR } from "../../../../market-info/annual-yield-details/incentive-details";
import ShieldIcon from "../../../../market-info/annual-yield-details/icons/shield";
import { BigNumber } from "ethers";
import { RoycoMarketType } from "royco/market";
import { useActiveMarket } from "../../../../../hooks/use-active-market";
import { Vibrant } from "node-vibrant/browser";
import SparkleIcon from "../../../../market-info/annual-yield-details/icons/sparkle";

export const IncentiveYieldWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    onYieldChange?: (value: string) => void;
  }
>(({ className, marketActionForm, onYieldChange, ...props }, ref) => {
  const { currentMarketData, marketMetadata, currentHighestOffers } =
    useActiveMarket();

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
        return BigNumber.from(token_data.raw_amount ?? "0").gt(0);
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
  }, [currentHighestOffers, highestIncentiveToken]);

  const selectedYield =
    marketActionForm.watch("annual_change_ratio")?.toString() || "";

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FormInputLabel size="sm" label="Desired %" />

      {/**
       * Input yield selector
       */}
      <InputYieldSelector
        containerClassName="mt-2"
        style={{
          color: tokenColor || DEFAULT_TOKEN_COLOR,
        }}
        currentValue={selectedYield}
        setCurrentValue={(value) => {
          marketActionForm.setValue("annual_change_ratio", value);

          if (onYieldChange) {
            onYieldChange(value);
          }
        }}
        Suffix={() => {
          return (
            <div className="flex flex-row items-center gap-1">
              {marketMetadata.market_type === RoycoMarketType.recipe.id ? (
                <ShieldIcon
                  className="h-5 w-5"
                  style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                />
              ) : (
                <SparkleIcon
                  className="h-5 w-5"
                  style={{ fill: tokenColor || DEFAULT_TOKEN_COLOR }}
                />
              )}
              <span
                className="text-sm"
                style={{ color: tokenColor || DEFAULT_TOKEN_COLOR }}
              >
                Rate
              </span>
            </div>
          );
        }}
      />
    </div>
  );
});
