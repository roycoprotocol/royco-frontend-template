import React, { useMemo } from "react";
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
import { parseTokenAmountToRawAmount } from "royco/utils";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { useAtomValue } from "jotai";

export const IncentivesAmountSelector = React.forwardRef<
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
    const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

    // const { userType } = useMarketManager();

    // const { marketMetadata, currentHighestOffers, currentMarketData } =
    //   useActiveMarket();
    // const currentIncentives =
    //   marketMetadata.market_type === RoycoMarketType.recipe.id &&
    //   !!currentHighestOffers &&
    //   currentHighestOffers.ip_offers.length > 0
    //     ? currentHighestOffers.ip_offers[0].tokens_data
    //     : [];

    // const { incentiveData } = useMarketFormDetails(marketActionForm);

    // const hasLowerAPR = useMemo(() => {
    //   if (enrichedMarket) {
    //     return marketActionForm.watch("incentive_tokens").some((token) => {
    //       const currentIncentive = enrichedMarket?.activeIncentives.find(
    //         (i) => i.id === token.id
    //       );
    //       const incentive = incentiveData.find((i) => i.token_id === token.id);

    //       if (currentIncentive && incentive && enrichedMarket) {
    //         return incentive.annual_change_ratio < currentIncentive.yieldRate;
    //       }
    //       return false;
    //     });
    //   } else {
    //     return false;
    //   }
    // }, [
    //   marketActionForm.watch("incentive_tokens"),
    //   currentIncentives,
    //   incentiveData,
    //   enrichedMarket,
    // ]);

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <SlideUpWrapper className="mt-5" delay={delayTitle}>
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
                marketActionForm.setValue("incentive_tokens", []);
              } else {
                marketActionForm.setValue("incentive_tokens", [token]);
              }
            }}
            token_ids={enrichedMarket?.incentiveTokenIds}
            // onSelect={(token) => {
            //   const incentiveTokens =
            //     marketActionForm.watch("incentive_tokens");

            //   if (incentiveTokens.some((t) => t.id === token.id)) {
            //     marketActionForm.setValue(
            //       "incentive_tokens",
            //       incentiveTokens.filter((t) => t.id !== token.id)
            //     );
            //   } else {
            //     marketActionForm.setValue("incentive_tokens", [
            //       ...incentiveTokens,
            //       token,
            //     ]);
            //   }
            // }}
            className="mt-2"
          />
        </SlideUpWrapper>

        {/* {hasLowerAPR && (
          <SlideUpWrapper className="mt-3" delay={0.4}>
            <WarningAlert>
              WARNING: Your offered APR is below market rate
            </WarningAlert>
          </SlideUpWrapper>
        )} */}

        <SlideUpWrapper className="mt-2" delay={delayContent}>
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
                        currentValue={token.amount ?? ""}
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
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
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
