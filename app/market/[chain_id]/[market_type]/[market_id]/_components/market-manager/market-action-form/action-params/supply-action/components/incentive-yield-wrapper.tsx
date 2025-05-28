"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInputLabel, TertiaryLabel } from "../../../../../composables";
import { MarketActionFormSchema } from "../../../market-action-form-schema";
import { z } from "zod";
import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { InputYieldSelector } from "../../composables/input-yield-selector";
import { DEFAULT_TOKEN_COLOR } from "../../../../market-info/annual-yield-details/incentive-details";
import ShieldIcon from "../../../../../icons/shield";
import { RoycoMarketType } from "royco/market";
import { Vibrant } from "node-vibrant/browser";
import SparkleIcon from "../../../../../icons/sparkle";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import formatNumber from "@/utils/numbers";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";

export const IncentiveYieldWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    onYieldChange?: (value: string) => void;
  }
>(({ className, marketActionForm, onYieldChange, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const [tokenColor, setTokenColor] = useState<string | null>(null);

  const highestIncentiveToken = useMemo(() => {
    if (enrichedMarket?.marketType === 0) {
      if (!enrichedMarket || enrichedMarket.activeIncentives.length === 0) {
        return null;
      }

      return enrichedMarket.activeIncentives[0];
    }

    if (enrichedMarket?.marketType === 1) {
      if (!enrichedMarket || enrichedMarket.activeIncentives.length === 0) {
        return null;
      }

      return enrichedMarket.activeIncentives.find((token) => {
        return BigInt(token.rawAmount ?? "0") > BigInt(0);
      });
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
  }, [highestIncentiveToken]);

  const selectedYield =
    marketActionForm.watch("annual_change_ratio")?.toString() || "";

  const selectedIncentiveToken =
    marketActionForm.watch("incentive_tokens")?.[0] || null;

  const formLabel = useMemo(() => {
    if (selectedIncentiveToken) {
      return `Desired % ${selectedIncentiveToken.symbol}`;
    }
    return "Desired %";
  }, [selectedIncentiveToken]);

  const totalYield = useMemo(() => {
    let result = selectedYield ? parseFloat(selectedYield) / 100 : 0;
    if (enrichedMarket?.nativeIncentives?.length) {
      result += enrichedMarket.nativeIncentives.reduce(
        (acc, item) => acc + (item.yieldRate || 0),
        0
      );
    }
    return result;
  }, [selectedYield, enrichedMarket]);

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FormInputLabel size="sm" label={formLabel} />

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
              <Tooltip>
                <TooltipTrigger className={cn("cursor-pointer")}>
                  {enrichedMarket?.marketType ===
                  RoycoMarketType.recipe.value ? (
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
                </TooltipTrigger>
                {createPortal(
                  <TooltipContent className={cn("bg-white", "max-w-80")}>
                    {enrichedMarket?.marketType === RoycoMarketType.recipe.value
                      ? "Fixed Incentive Rate"
                      : "Variable Incentive Rate, based on # of participants"}
                  </TooltipContent>,
                  document.body
                )}
              </Tooltip>
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

      {/**
       * Total APY
       */}
      <TertiaryLabel className="mt-2 space-x-1 italic">
        <span>Total APY:</span>

        <span className="flex items-center justify-center">
          {formatNumber(totalYield || 0, {
            type: "percent",
          })}
        </span>
      </TertiaryLabel>
    </div>
  );
});
