import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { FormInputLabel } from "@/components/composables";
import { SlideUpWrapper } from "@/components/animations";
import {
  DeleteTokenButton,
  IncentiveTokenSelector,
  InputAmountSelector,
  TimestampLabel,
  TimestampSelector,
} from "../composables";
import { AlertIndicator, TokenDisplayer } from "@/components/common";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import {
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from "@/sdk/utils";
import { MarketVaultIncentiveAction, useMarketManager } from "@/store";
import { useActiveMarket } from "../../../hooks";
import { BigNumber } from "ethers";

export const IPLimitOfferIncentivesUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { vaultIncentiveActionType } = useMarketManager();

  const { currentMarketData } = useActiveMarket();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <SlideUpWrapper
        layout="position"
        layoutId="motion:market:incentive-tokens-selector"
        delay={0.2}
        className="mt-5"
      >
        <FormInputLabel
          size="sm"
          label="Incentive Tokens"
          info="The tokens you want to use as incentives"
        />

        <IncentiveTokenSelector
          {...(vaultIncentiveActionType === MarketVaultIncentiveAction.add.id
            ? {
                not_token_ids:
                  (currentMarketData?.base_incentive_ids ?? []).filter(
                    (base_incentive_id, index) => {
                      const base_start_timestamp = BigNumber.from(
                        currentMarketData?.base_start_timestamps?.[index] ?? "0"
                      );
                      return base_start_timestamp.eq(0);
                    }
                  ) ?? [],
              }
            : vaultIncentiveActionType === MarketVaultIncentiveAction.extend.id
              ? {
                  token_ids: (
                    currentMarketData?.base_incentive_ids ?? []
                  ).filter((base_incentive_id, index) => {
                    const base_incentive_amount = BigNumber.from(
                      currentMarketData?.base_incentive_amounts?.[index] ?? "0"
                    );
                    return base_incentive_amount.gt(0);
                  }),
                }
              : vaultIncentiveActionType ===
                  MarketVaultIncentiveAction.refund.id
                ? {
                    token_ids: (
                      currentMarketData?.base_incentive_ids ?? []
                    ).filter((base_incentive_id, index) => {
                      const current_time_in_seconds = Math.floor(
                        new Date().getTime() / 1000
                      );

                      const current_timestamp = BigNumber.from(
                        current_time_in_seconds
                      );
                      const start_timestamp = BigNumber.from(
                        currentMarketData?.base_start_timestamps?.[index] ?? "0"
                      );
                      return current_timestamp.lt(start_timestamp);
                    }),
                  }
                : {})}
          selected_token_ids={marketActionForm
            .watch("incentive_tokens")
            .map((token) => token.id)}
          onSelect={(token) => {
            const incentiveTokens = marketActionForm.watch("incentive_tokens");

            if (incentiveTokens.some((t) => t.id === token.id)) {
              marketActionForm.setValue(
                "incentive_tokens",
                incentiveTokens.filter((t) => t.id !== token.id)
              );
            } else {
              marketActionForm.setValue("incentive_tokens", [
                ...incentiveTokens,
                token,
              ]);
            }
          }}
          className="mt-2"
        />
      </SlideUpWrapper>

      <SlideUpWrapper
        layout="position"
        layoutId="motion:market:incentive-tokens-list"
        delay={0.3}
        className="mt-2"
      >
        <div className="flex h-fit w-full flex-col gap-1 rounded-xl border border-divider bg-z2 p-1">
          {marketActionForm.watch("incentive_tokens").length === 0 ? (
            <AlertIndicator className="w-full ">
              No incentives selected
            </AlertIndicator>
          ) : (
            marketActionForm.watch("incentive_tokens").map((token) => {
              return (
                <div
                  key={token.id}
                  className="flex flex-col items-center gap-1 rounded-xl border border-divider bg-white p-1"
                >
                  {/**
                   * Amount Selector
                   */}
                  <div className="flex w-full flex-row items-center gap-1">
                    <InputAmountSelector
                      disabled={
                        vaultIncentiveActionType ===
                        MarketVaultIncentiveAction.refund.id
                      }
                      currentValue={
                        vaultIncentiveActionType ===
                        MarketVaultIncentiveAction.refund.id
                          ? (() => {
                              const tokenIndex =
                                currentMarketData?.base_incentive_ids?.findIndex(
                                  (id) => id === token.id
                                );
                              if (tokenIndex === undefined || tokenIndex === -1)
                                return "0";
                              return (
                                parseRawAmountToTokenAmount(
                                  currentMarketData?.base_incentive_amounts?.[
                                    tokenIndex
                                  ] ?? "0",
                                  token.decimals
                                ).toString() ?? "0"
                              );
                            })()
                          : (token.amount ?? "")
                      }
                      setCurrentValue={(value) => {
                        /**
                         * Set the amount of the token
                         */
                        marketActionForm.setValue(
                          "incentive_tokens",
                          marketActionForm
                            .watch("incentive_tokens")
                            .map((t) =>
                              t.id === token.id ? { ...t, amount: value } : t
                            )
                        );

                        /**
                         * Set the raw amount of the token
                         */
                        marketActionForm.setValue(
                          "incentive_tokens",
                          marketActionForm.watch("incentive_tokens").map((t) =>
                            t.id === token.id
                              ? {
                                  ...t,
                                  raw_amount: parseTokenAmountToRawAmount(
                                    value,
                                    token.decimals
                                  ),
                                }
                              : t
                          )
                        );
                      }}
                      Suffix={() => {
                        return (
                          <TokenDisplayer
                            size={4}
                            tokens={[token]}
                            symbols={true}
                          />
                        );
                      }}
                    />

                    {/**
                     * Delete Token
                     */}
                    <DeleteTokenButton
                      onClick={() => {
                        marketActionForm.setValue(
                          "incentive_tokens",
                          marketActionForm
                            .watch("incentive_tokens")
                            .filter((t) => t.id !== token.id)
                        );
                      }}
                    />
                  </div>

                  {/**
                   * Start Timestamp
                   */}
                  {vaultIncentiveActionType ===
                    MarketVaultIncentiveAction.add.id && (
                    <div className="flex w-full flex-row items-center gap-1">
                      {/**
                       * Start Timestamp Label
                       */}
                      <TimestampLabel>Start</TimestampLabel>

                      {/**
                       * Start Timestamp Selector
                       */}
                      <TimestampSelector
                        currentValue={token.start_timestamp}
                        setCurrentValue={(date) => {
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id
                                  ? { ...t, start_timestamp: date }
                                  : t
                              )
                          );
                        }}
                      />
                    </div>
                  )}

                  {/**
                   * End Timestamp
                   */}
                  {(vaultIncentiveActionType ===
                    MarketVaultIncentiveAction.add.id ||
                    vaultIncentiveActionType ===
                      MarketVaultIncentiveAction.extend.id) && (
                    <div className="flex w-full flex-row items-center gap-1">
                      {/**
                       * End Timestamp Label
                       */}
                      <TimestampLabel>End</TimestampLabel>

                      {/**
                       * End Timestamp Selector
                       */}
                      <TimestampSelector
                        currentValue={token.end_timestamp}
                        setCurrentValue={(date) => {
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id
                                  ? { ...t, end_timestamp: date }
                                  : t
                              )
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SlideUpWrapper>
    </div>
  );
});
