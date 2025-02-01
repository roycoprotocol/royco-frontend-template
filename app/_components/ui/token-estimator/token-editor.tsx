"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TokenDisplayer } from "@/components/common";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { X as CloseIcon } from "lucide-react";
import { CustomTokenDataElementType } from "royco/types";
import { SupportedTokenList } from "royco/constants";
import { FormInputLabel, SpringNumber } from "@/components/composables";
import { UseFormReturn } from "react-hook-form";
import { EstimatorCustomTokenDataSchema } from "./token-estimator";
import { z } from "zod";
import {
  parseFormattedValueToText,
  parseTextToFormattedValue,
} from "royco/utils";
import {
  CustomTokenDataElement,
  useGlobalStates,
} from "@/store/use-global-states";
import { BERA_TOKEN_ID } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-info/annual-yield-details/incentive-details";

export const TokenEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index: number;
    token: CustomTokenDataElement;
    customTokenForm: UseFormReturn<
      z.infer<typeof EstimatorCustomTokenDataSchema>
    >;
    onRemove?: () => void;
  }
>(({ className, token, onRemove, customTokenForm, index, ...props }, ref) => {
  const { customTokenData } = useGlobalStates();

  const previousTokenData = useMemo(() => {
    return customTokenData.find((t) => t.token_id === token.token_id);
  }, [token.token_id]);

  const tokenData = useMemo(() => {
    return SupportedTokenList.find((t) => t.id === token.token_id);
  }, [token.token_id]);

  const handleFDVChange = (value: string) => {
    const allocation = parseFloat(token.allocation || "100");
    const fdv = parseFloat(value || "0");
    const total_supply = parseFloat(token.total_supply || "0");

    const new_fdv = fdv;
    const new_total_supply = total_supply / (allocation / 100);
    let new_price = new_fdv / new_total_supply;
    if (isNaN(new_price)) {
      new_price = 0;
    }

    customTokenForm.setValue(
      `customTokenData.${index}.price`,
      new_price.toString()
    );
    customTokenForm.setValue(`customTokenData.${index}.fdv`, value);
  };

  const handlePriceChange = (value: string) => {
    const allocation = parseFloat(token.allocation || "100");
    const total_supply = parseFloat(token.total_supply || "0");

    const price = parseFloat(value || "0");
    const new_total_supply = total_supply / (allocation / 100);
    const new_fdv = price * new_total_supply;

    customTokenForm.setValue(
      `customTokenData.${index}.fdv`,
      new_fdv.toString()
    );
    customTokenForm.setValue(`customTokenData.${index}.price`, value);
  };

  const handleAllocationChange = (value: string) => {
    const allocation = parseFloat(value || "100");
    const fdv = parseFloat(token.fdv || "0");
    const total_supply = parseFloat(token.total_supply || "0");

    const new_fdv = fdv;
    const new_total_supply = total_supply / (allocation / 100);
    let new_price = new_fdv / new_total_supply;
    if (isNaN(new_price)) {
      new_price = 0;
    }

    customTokenForm.setValue(
      `customTokenData.${index}.price`,
      new_price.toString()
    );
    customTokenForm.setValue(`customTokenData.${index}.allocation`, value);
  };

  if (!tokenData) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border px-4 py-3", className)}
      {...props}
    >
      {/**
       * Token header
       */}
      <div className="flex items-center justify-between">
        <TokenDisplayer
          tokens={[tokenData] as any}
          size={4}
          symbols={true}
          symbolClassName="font-medium"
        />

        <Button
          variant="ghost"
          size="sm"
          className="rounded p-2"
          onClick={onRemove}
        >
          <CloseIcon className="h-4 w-4" />
        </Button>
      </div>

      {/**
       * Token Stats
       */}
      {tokenData.id !== BERA_TOKEN_ID && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <SecondaryLabel className="break-normal font-light">
              {tokenData.type === "point"
                ? "# Points on Royco"
                : "Total Supply"}
            </SecondaryLabel>
            <PrimaryLabel className="hide-scrollbar mt-1 overflow-x-auto text-2xl">
              <SpringNumber
                previousValue={parseFloat(
                  previousTokenData?.total_supply || "0"
                )}
                currentValue={parseFloat(
                  customTokenForm.watch(
                    `customTokenData.${index}.total_supply`
                  ) || "0"
                )}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }}
              />
            </PrimaryLabel>
          </div>

          <div>
            <SecondaryLabel className="break-normal font-light">
              {tokenData.type === "point"
                ? "Estimated Price per Point"
                : "Price"}
            </SecondaryLabel>
            <PrimaryLabel className="hide-scrollbar mt-1 overflow-x-auto text-2xl">
              <SpringNumber
                previousValue={parseFloat(previousTokenData?.price || "0")}
                currentValue={parseFloat(
                  customTokenForm.watch(`customTokenData.${index}.price`) || "0"
                )}
                numberFormatOptions={{
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                }}
              />
            </PrimaryLabel>
          </div>
        </div>
      )}

      <hr className="my-3" />

      {/**
       * Allocation Input
       */}
      {tokenData.type === "point" && (
        <div className="mb-4">
          <FormInputLabel
            size="sm"
            label={
              process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
                ? "% Supply Allocated to Boyco"
                : "% Supply Allocated to Royco"
            }
          />

          <Input
            type="text"
            placeholder="Enter Allocation"
            containerClassName="mt-2"
            className="w-full"
            value={parseTextToFormattedValue(
              customTokenForm.watch(`customTokenData.${index}.allocation`)
            )}
            onChange={(e) =>
              handleAllocationChange(parseFormattedValueToText(e.target.value))
            }
          />
        </div>
      )}

      {/**
       * FDV Input
       */}
      <div>
        <div className="hide-scrollbar max-w-full overflow-scroll">
          <FormInputLabel
            size="sm"
            label={
              tokenData.type === "point"
                ? "Estimated Value of dApp Incentives"
                : "Adjust FDV"
            }
          />
        </div>

        <Input
          type="text"
          placeholder={
            tokenData.type === "point"
              ? "Enter Estimated Value"
              : "Enter FDV Amount"
          }
          containerClassName="mt-2"
          className="w-full"
          value={parseTextToFormattedValue(
            customTokenForm.watch(`customTokenData.${index}.fdv`)
          )}
          onChange={(e) =>
            handleFDVChange(parseFormattedValueToText(e.target.value))
          }
        />
      </div>

      {/**
       * Price Input
       */}
      {tokenData.type === "point" && (
        <div className="mt-4">
          <FormInputLabel size="sm" label="Estimated Price per Point" />

          <Input
            type="text"
            placeholder="Enter Estimated Price"
            containerClassName="mt-2"
            className="w-full"
            value={parseTextToFormattedValue(
              customTokenForm.watch(`customTokenData.${index}.price`)
            )}
            onChange={(e) =>
              handlePriceChange(parseFormattedValueToText(e.target.value))
            }
          />
        </div>
      )}
    </div>
  );
});
