import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { SlideUpWrapper } from "@/components/animations";
import { FormInputLabel } from "@/components/composables";
import { IncentiveTokenSelector } from "./incentive-token-selector";
import { MarketActionFormSchema } from "../..";
import { UseFormReturn } from "react-hook-form";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { InputAmountSelector } from "./input-amount-selector";
import { DeleteTokenButton } from "./delete-token-button";
import { parseTokenAmountToRawAmount } from "@/sdk/utils";
import { useMarketManager } from "@/store";
import { SecondaryLabel } from "../../../composables";

export const IncentivesRateSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    delayTitle?: number;
    delayContent?: number;
  }
>(
  (
    { className, marketActionForm, delayTitle, delayContent, ...props },
    ref
  ) => {
    const { userType } = useMarketManager();

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:incentive-tokens-selector:${userType}`}
          className="mt-5"
          delay={delayTitle}
        >
          <FormInputLabel
            size="sm"
            label="Incentive Tokens"
            info="The tokens you want to use as incentives"
          />

          <IncentiveTokenSelector
            selected_token_ids={marketActionForm
              .watch("incentive_tokens")
              .map((token) => token.id)}
            onSelect={(token) => {
              const incentiveTokens =
                marketActionForm.watch("incentive_tokens");

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
          layoutId={`motion:market:incentive-tokens-list:${userType}`}
          className="mt-2"
          delay={delayContent}
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
                     * Market Cap Selector
                     */}
                    <div className="flex w-full flex-row items-center gap-1">
                      <InputAmountSelector
                        currentValue={token.fdv ?? ""}
                        setCurrentValue={(value) => {
                          /**
                           * Set the amount of the token
                           */
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id ? { ...t, fdv: value } : t
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
                        // @ts-ignore
                        placeholder="Market Cap"
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
                     * aip and distribution selector
                     */}
                    <div className="grid w-full grid-cols-2 items-center gap-1">
                      <InputAmountSelector
                        currentValue={token.aip ?? ""}
                        setCurrentValue={(value) => {
                          /**
                           * Set the amount of the token
                           */
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id ? { ...t, aip: value } : t
                              )
                          );
                        }}
                        Suffix={() => {
                          return (
                            <SecondaryLabel className="font-light text-black">
                              %
                            </SecondaryLabel>
                          );
                        }}
                        // @ts-ignore
                        placeholder="Yield"
                      />

                      {/**
                       * Total Supply Selector
                       */}
                      <InputAmountSelector
                        currentValue={token.total_supply ?? ""}
                        setCurrentValue={(value) => {
                          /**
                           * Set the amount of the token
                           */
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id
                                  ? { ...t, total_supply: value }
                                  : t
                              )
                          );
                        }}
                        Suffix={() => {
                          return (
                            <SecondaryLabel className="font-light text-black">
                              {`${token.symbol.toUpperCase()}/year`}
                            </SecondaryLabel>
                          );
                        }}
                        // @ts-ignore
                        placeholder="Distribution"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SlideUpWrapper>
      </div>
    );
  }
);
