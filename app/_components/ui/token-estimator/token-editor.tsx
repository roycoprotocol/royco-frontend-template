"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TokenDisplayer } from "@/components/common";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { X as CloseIcon } from "lucide-react";
import { SupportedTokenList } from "royco/constants";
import { FormInputLabel, SpringNumber } from "@/components/composables";
import { UseFormReturn } from "react-hook-form";
import { EstimatorCustomTokenDataSchema } from "./token-estimator";
import { z } from "zod";
import {
  SONIC_APP_TYPE,
  SONIC_GEM_DISTRIBUTION_MAP,
  SONIC_ROYCO_GEM_BOOST_ID,
  SONIC_TOKEN_ID,
  sonicPointsMap,
  TOTAL_SONIC_AIRDROP,
  TOTAL_SONIC_GEM_DISTRIBUTION,
} from "royco/sonic";
import {
  CustomTokenDataElement,
  useGlobalStates,
} from "@/store/use-global-states";
import { BERA_TOKEN_ID } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-info/annual-yield-details/incentive-details";
import { useTokenQuotes } from "royco/hooks";
import {
  parseFormattedValueToText,
  parseTextToFormattedValue,
} from "royco/utils";

export const SONIC_CHAIN_ID = 146;

export const TokenEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index: number;
    tokens: CustomTokenDataElement[];
    customTokenForm: UseFormReturn<
      z.infer<typeof EstimatorCustomTokenDataSchema>
    >;
    onRemove?: () => void;
    marketCategory?: string;
  }
>(
  (
    {
      className,
      tokens,
      onRemove,
      customTokenForm,
      index,
      marketCategory,
      ...props
    },
    ref
  ) => {
    const { data: sonicTokenQuote } = useTokenQuotes({
      token_ids: [SONIC_TOKEN_ID],
    });

    const { customTokenData } = useGlobalStates();

    const previousTokensData = useMemo(() => {
      return tokens.map((t) => {
        return customTokenData.find((c) => c.token_id === t.token_id);
      });
    }, [tokens]);

    const tokensData = useMemo(() => {
      return tokens.map((t) => {
        return SupportedTokenList.find((c) => c.id === t.token_id);
      });
    }, [tokens]);

    const handleFDVChange = (value: string) => {
      const token = tokens[0];
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
      const token = tokens[0];
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
      const token = tokens[0];
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

    const handleSonicAllocationChange = (value: string) => {
      if (!sonicTokenQuote || sonicTokenQuote.length === 0) {
        return;
      }

      const allocation = parseFloat(value || "0");

      for (const i in tokens) {
        const token = tokens[i];

        if (token.token_id === SONIC_ROYCO_GEM_BOOST_ID) {
          const gemPriceInSonic =
            (TOTAL_SONIC_AIRDROP * (allocation / 100) * (50 / 100)) /
            TOTAL_SONIC_GEM_DISTRIBUTION;

          const new_price = gemPriceInSonic * sonicTokenQuote[0].price;
          const new_total_supply = TOTAL_SONIC_GEM_DISTRIBUTION;
          const new_fdv =
            gemPriceInSonic *
            TOTAL_SONIC_GEM_DISTRIBUTION *
            sonicTokenQuote[0].price;

          customTokenForm.setValue(
            `customTokenData.${i as any}.price`,
            new_price.toString()
          );
          customTokenForm.setValue(
            `customTokenData.${i as any}.total_supply`,
            new_total_supply.toString()
          );
          customTokenForm.setValue(
            `customTokenData.${i as any}.fdv`,
            new_fdv.toString()
          );
          customTokenForm.setValue(
            `customTokenData.${i as any}.allocation`,
            value
          );
        } else {
          const appType = sonicPointsMap.find(
            (p) => p.id === token.token_id
          )?.appType;

          if (!appType) {
            continue;
          }

          const gemPriceInSonic =
            (TOTAL_SONIC_AIRDROP * (allocation / 100) * (50 / 100)) /
            TOTAL_SONIC_GEM_DISTRIBUTION;
          const allocatedGemPriceInSonic =
            SONIC_GEM_DISTRIBUTION_MAP[appType as SONIC_APP_TYPE] *
            gemPriceInSonic;
          const allocatedGemPriceInUSD =
            allocatedGemPriceInSonic * sonicTokenQuote[0].price;

          const new_fdv = allocatedGemPriceInUSD;
          const total_supply = parseFloat(token.total_supply || "0");
          let new_price = new_fdv / total_supply;
          if (isNaN(new_price) || new_price === Infinity) {
            new_price = 0;
          }

          customTokenForm.setValue(
            `customTokenData.${i as any}.fdv`,
            new_fdv.toString()
          );
          customTokenForm.setValue(
            `customTokenData.${i as any}.price`,
            new_price.toString()
          );
          customTokenForm.setValue(
            `customTokenData.${i as any}.allocation`,
            value
          );
        }
      }
    };

    const sonicTokenAllocation = useMemo(() => {
      const token = tokens[0];
      const allocation = parseFloat(token.allocation || "0");

      return {
        total: TOTAL_SONIC_AIRDROP,
        userTotal: TOTAL_SONIC_AIRDROP * (allocation / 100),
      };
    }, [customTokenForm.watch(`customTokenData.${index}.allocation`)]);

    if (!tokensData || tokensData.length === 0) {
      return null;
    }

    if (marketCategory === "sonic") {
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
            <FormInputLabel
              size="sm"
              label="Estimated Sonic Season 1 Airdrop"
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

          <hr className="my-3" />

          <div>
            <div className="hide-scrollbar max-w-full overflow-scroll">
              <FormInputLabel
                size="sm"
                label="% of Total Sonic Airdrop to S1"
              />
            </div>

            <Input
              type="text"
              placeholder="% of Sonic Airdrop"
              containerClassName="mt-2"
              className="w-full"
              value={parseTextToFormattedValue(
                customTokenForm.watch(`customTokenData.${index}.allocation`)
              )}
              onChange={(e) =>
                handleSonicAllocationChange(
                  parseFormattedValueToText(e.target.value)
                )
              }
            />
          </div>

          <TertiaryLabel className="mt-2">
            Total Sonic Airdrop (All Season): {sonicTokenAllocation.total} $S
          </TertiaryLabel>

          <TertiaryLabel className="mt-2 flex gap-1 font-semibold text-secondary">
            <span className="flex items-center gap-1">
              <span className="underline">Airdrop to Season 1: </span>
              <span>{sonicTokenAllocation.userTotal} $S</span>
            </span>
          </TertiaryLabel>
        </div>
      );
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
            tokens={tokensData as any}
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
        {tokensData?.[0]?.id !== BERA_TOKEN_ID && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <SecondaryLabel className="break-normal font-light">
                {tokensData?.[0]?.type === "point"
                  ? "# Points on Royco"
                  : "Total Supply"}
              </SecondaryLabel>
              <PrimaryLabel className="hide-scrollbar mt-1 overflow-x-auto text-2xl">
                <SpringNumber
                  previousValue={parseFloat(
                    previousTokensData?.[0]?.total_supply || "0"
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
                {tokensData?.[0]?.type === "point"
                  ? "Estimated Price per Point"
                  : "Price"}
              </SecondaryLabel>
              <PrimaryLabel className="hide-scrollbar mt-1 overflow-x-auto text-2xl">
                <SpringNumber
                  previousValue={parseFloat(
                    previousTokensData?.[0]?.price || "0"
                  )}
                  currentValue={parseFloat(
                    customTokenForm.watch(`customTokenData.${index}.price`) ||
                      "0"
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
        {/* {tokenData.type === "point" && (
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
      )} */}

        {/**
         * FDV Input
         */}
        <div>
          <div className="hide-scrollbar max-w-full overflow-scroll">
            <FormInputLabel
              size="sm"
              label={
                tokensData?.[0]?.type === "point"
                  ? "Estimated Value of dApp Incentives"
                  : "Adjust FDV"
              }
            />
          </div>

          <Input
            type="text"
            placeholder={
              tokensData?.[0]?.type === "point"
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
        {tokensData?.[0]?.type === "point" && (
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
  }
);
