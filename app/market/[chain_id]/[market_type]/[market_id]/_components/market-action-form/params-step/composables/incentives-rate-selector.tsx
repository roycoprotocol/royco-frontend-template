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
import { useActiveMarket } from "../../../hooks";

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
    const { currentMarketData } = useActiveMarket();

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
            token_ids={currentMarketData?.base_incentive_ids ?? []}
            selected_token_ids={marketActionForm
              .watch("incentive_tokens")
              .map((token) => token.id)}
            onSelect={(token) => {
              const incentiveTokens =
                marketActionForm.watch("incentive_tokens");

              if (incentiveTokens.some((t) => t.id === token.id)) {
                /**
                 * Remove the token from the list
                 */
                marketActionForm.setValue(
                  "incentive_tokens",
                  incentiveTokens.filter((t) => t.id !== token.id)
                );
              } else {
                /**
                 * Add the token to the list
                 */
                marketActionForm.setValue("incentive_tokens", [
                  ...incentiveTokens,
                  {
                    ...token,
                    fdv: token.fdv?.toString() ?? "0",
                  },
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
                      <div className="grid grow  grid-cols-3 items-center gap-1 ">
                        <InputAmountSelector
                          containerClassName="col-span-2"
                          currentValue={token.fdv ?? ""}
                          setCurrentValue={(value) => {
                            /**
                             * Set the fdv of the token
                             */
                            marketActionForm.setValue(
                              "incentive_tokens",
                              marketActionForm
                                .watch("incentive_tokens")
                                .map((t) =>
                                  t.id === token.id ? { ...t, fdv: value } : t
                                )
                            );

                            /**
                             * Update distribution
                             */

                            let distribution = 0;

                            try {
                              let aip = parseFloat(token.aip ?? "0") / 100;
                              let incentive_token_fdv = parseFloat(value);
                              let input_token_amount = parseFloat(
                                marketActionForm.watch("quantity.amount") ?? "0"
                              );
                              let input_token_price =
                                currentMarketData?.input_token_price ?? 0;
                              let incentive_token_total_supply = parseFloat(
                                token.total_supply ?? "0"
                              );

                              distribution =
                                (aip *
                                  input_token_amount *
                                  input_token_price *
                                  incentive_token_total_supply) /
                                incentive_token_fdv;
                            } catch (err) {}

                            /**
                             * Set new distribution
                             */
                            if (!isNaN(distribution)) {
                              marketActionForm.setValue(
                                "incentive_tokens",
                                marketActionForm
                                  .watch("incentive_tokens")
                                  .map((t) =>
                                    t.id === token.id
                                      ? {
                                          ...t,
                                          distribution: distribution.toString(),
                                        }
                                      : t
                                  )
                              );
                            }
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
                         * aip selector
                         */}
                        <InputAmountSelector
                          containerClassName="col-span-1"
                          currentValue={token.aip ?? ""}
                          setCurrentValue={(value) => {
                            /**
                             * Set the aip of the token
                             */
                            marketActionForm.setValue(
                              "incentive_tokens",
                              marketActionForm
                                .watch("incentive_tokens")
                                .map((t) =>
                                  t.id === token.id ? { ...t, aip: value } : t
                                )
                            );

                            /**
                             * Update distribution
                             */
                            let distribution = 0;

                            try {
                              let aip = parseFloat(value) / 100;
                              let incentive_token_fdv = parseFloat(
                                token.fdv ?? "0"
                              );
                              let input_token_amount = parseFloat(
                                marketActionForm.watch("quantity.amount") ?? "0"
                              );
                              let input_token_price =
                                currentMarketData?.input_token_price ?? 0;
                              let incentive_token_total_supply = parseFloat(
                                token.total_supply ?? "0"
                              );

                              distribution =
                                (aip *
                                  input_token_amount *
                                  input_token_price *
                                  incentive_token_total_supply) /
                                incentive_token_fdv;
                            } catch (err) {}

                            /**
                             * Set new distribution
                             */
                            if (!isNaN(distribution)) {
                              marketActionForm.setValue(
                                "incentive_tokens",
                                marketActionForm
                                  .watch("incentive_tokens")
                                  .map((t) =>
                                    t.id === token.id
                                      ? {
                                          ...t,
                                          distribution: distribution.toString(),
                                        }
                                      : t
                                  )
                              );
                            }
                          }}
                          Suffix={() => {
                            return (
                              <SecondaryLabel className="font-light text-black">
                                %
                              </SecondaryLabel>
                            );
                          }}
                          // @ts-ignore
                          placeholder="APR"
                        />
                      </div>

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
                     * distribution selector
                     */}
                    <div className="grid w-full grid-cols-1 items-center gap-1">
                      <InputAmountSelector
                        currentValue={token.distribution ?? ""}
                        setCurrentValue={(value) => {
                          /**
                           * Set the distribution of the token
                           */
                          marketActionForm.setValue(
                            "incentive_tokens",
                            marketActionForm
                              .watch("incentive_tokens")
                              .map((t) =>
                                t.id === token.id
                                  ? { ...t, distribution: value }
                                  : t
                              )
                          );

                          /**
                           * Update aip
                           */

                          let aip = 0;

                          try {
                            let incentive_token_distribution =
                              parseFloat(value);
                            let incentive_token_fdv = parseFloat(
                              token.fdv ?? "0"
                            );
                            let input_token_amount = parseFloat(
                              marketActionForm.watch("quantity.amount") ?? "0"
                            );
                            let input_token_price =
                              currentMarketData?.input_token_price ?? 0;
                            let incentive_token_total_supply = parseFloat(
                              token.total_supply ?? "0"
                            );

                            aip =
                              ((incentive_token_distribution *
                                incentive_token_fdv) /
                                (input_token_amount *
                                  input_token_price *
                                  incentive_token_total_supply)) *
                              100;
                          } catch (err) {}

                          /**
                           * Set new aip
                           */
                          if (!isNaN(aip)) {
                            marketActionForm.setValue(
                              "incentive_tokens",
                              marketActionForm
                                .watch("incentive_tokens")
                                .map((t) =>
                                  t.id === token.id
                                    ? { ...t, aip: aip.toString() }
                                    : t
                                )
                            );
                          } else {
                            marketActionForm.setValue(
                              "incentive_tokens",
                              marketActionForm
                                .watch("incentive_tokens")
                                .map((t) =>
                                  t.id === token.id ? { ...t, aip: "0" } : t
                                )
                            );
                          }
                        }}
                        Suffix={() => {
                          return (
                            <SecondaryLabel className="font-light text-black">
                              {`${token.symbol.toUpperCase()}/year`}
                            </SecondaryLabel>
                          );
                        }}
                        // @ts-ignore
                        placeholder="Incentive/Year"
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
