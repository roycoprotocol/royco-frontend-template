import React, { useState } from "react";
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
import { useMarketManager } from "@/store";
import { SecondaryLabel, TertiaryLabel } from "../../../../composables";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market";

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
    const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

    const [isExpanded, setIsExpanded] = useState(false);

    const inputTokenSupplyInUSD =
      (Number(marketActionForm.watch("quantity.amount")) || 0) *
      (enrichedMarket?.inputToken.price || 0);

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <SlideUpWrapper className="mt-5" delay={delayTitle}>
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
                marketActionForm.setValue("incentive_tokens", []);
              } else {
                /**
                 * Replace existing tokens with the new one
                 */
                marketActionForm.setValue("incentive_tokens", [
                  {
                    ...token,
                    fdv: token.fdv?.toString() ?? "0",
                  },
                ]);
              }
            }}
            // onSelect={(token) => {
            //   const incentiveTokens =
            //     marketActionForm.watch("incentive_tokens");

            //   if (incentiveTokens.some((t) => t.id === token.id)) {
            //     /**
            //      * Remove the token from the list
            //      */
            //     marketActionForm.setValue(
            //       "incentive_tokens",
            //       incentiveTokens.filter((t) => t.id !== token.id)
            //     );
            //   } else {
            //     /**
            //      * Add the token to the list
            //      */
            //     marketActionForm.setValue("incentive_tokens", [
            //       ...incentiveTokens,
            //       {
            //         ...token,
            //         fdv: token.fdv?.toString() ?? "0",
            //       },
            //     ]);
            //   }
            // }}
            className="mt-2"
          />
        </SlideUpWrapper>

        <SlideUpWrapper className="mt-2" delay={delayContent}>
          <div className="flex h-fit w-full flex-col gap-1 rounded-xl border border-divider bg-z2">
            {marketActionForm.watch("incentive_tokens").length === 0 ? (
              <AlertIndicator className="w-full ">
                No incentives selected
              </AlertIndicator>
            ) : (
              marketActionForm.watch("incentive_tokens").map((token) => {
                return (
                  <div key={token.id} className="relative flex flex-col gap-1">
                    <button
                      className="absolute right-5 top-5 h-fit outline-none"
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      <TertiaryLabel className="text-[10px] leading-none text-secondary">
                        {isExpanded ? "Shrink" : "Expand"}
                      </TertiaryLabel>
                    </button>

                    {/**
                     * Market Cap Selector
                     */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-b border-dashed"
                        >
                          <div className="p-4">
                            <TertiaryLabel className="mb-3">
                              {`Incentive Calculator - ${token.symbol}`}
                            </TertiaryLabel>

                            <div className="mb-3">
                              <TertiaryLabel className="mb-1 font-medium text-secondary">
                                Total Deposit Size
                              </TertiaryLabel>

                              <InputAmountSelector
                                containerClassName="col-span-2"
                                currentValue={String(inputTokenSupplyInUSD)}
                                setCurrentValue={(value) => {}}
                                Suffix={() => {
                                  return (
                                    <SecondaryLabel className="shrink-0 font-light text-black">
                                      in USD
                                    </SecondaryLabel>
                                  );
                                }}
                                // @ts-ignore
                                placeholder="Total Deposit"
                              />
                            </div>

                            <div className="mb-3 grid grid-cols-2 gap-x-1">
                              <div>
                                <TertiaryLabel className="mb-1 font-medium text-secondary">
                                  {token.symbol} FDV
                                </TertiaryLabel>

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
                                          t.id === token.id
                                            ? { ...t, fdv: value }
                                            : t
                                        )
                                    );

                                    /**
                                     * Update price
                                     */
                                    marketActionForm.setValue(
                                      "incentive_tokens",
                                      marketActionForm
                                        .watch("incentive_tokens")
                                        .map((t) =>
                                          t.id === token.id
                                            ? {
                                                ...t,
                                                price:
                                                  parseFloat(value) /
                                                  parseFloat(
                                                    token.total_supply as string
                                                  ),
                                              }
                                            : t
                                        )
                                    );

                                    /**
                                     * Update distribution
                                     */

                                    let distribution = 0;

                                    try {
                                      let aip =
                                        parseFloat(token.aip ?? "0") / 100;
                                      let incentive_token_fdv =
                                        parseFloat(value);
                                      let input_token_amount = parseFloat(
                                        marketActionForm.watch(
                                          "quantity.amount"
                                        ) ?? "0"
                                      );
                                      let input_token_price =
                                        enrichedMarket?.inputToken.price ?? 0;
                                      let incentive_token_total_supply =
                                        parseFloat(token.total_supply ?? "0");

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
                                                  distribution:
                                                    distribution.toString(),
                                                }
                                              : t
                                          )
                                      );
                                    }
                                  }}
                                  Suffix={() => {
                                    return (
                                      <SecondaryLabel className="shrink-0 font-light text-black">
                                        USD
                                      </SecondaryLabel>
                                    );
                                  }}
                                  // @ts-ignore
                                  placeholder="FDV"
                                />
                              </div>

                              <div>
                                <TertiaryLabel className="mb-1 font-medium text-secondary">
                                  {token.symbol} Price
                                </TertiaryLabel>

                                <InputAmountSelector
                                  containerClassName="col-span-2"
                                  currentValue={String(token.price || 0)}
                                  setCurrentValue={(value) => {
                                    /**
                                     * Set the fdv of the token
                                     */
                                    marketActionForm.setValue(
                                      "incentive_tokens",
                                      marketActionForm
                                        .watch("incentive_tokens")
                                        .map((t) =>
                                          t.id === token.id
                                            ? { ...t, price: parseFloat(value) }
                                            : t
                                        )
                                    );

                                    /**
                                     * Update fdv
                                     */
                                    marketActionForm.setValue(
                                      "incentive_tokens",
                                      marketActionForm
                                        .watch("incentive_tokens")
                                        .map((t) =>
                                          t.id === token.id
                                            ? {
                                                ...t,
                                                fdv: (
                                                  parseFloat(value) *
                                                  parseFloat(
                                                    token.total_supply as string
                                                  )
                                                ).toString(),
                                              }
                                            : t
                                        )
                                    );

                                    /**
                                     * Update distribution
                                     */
                                    let distribution = 0;

                                    try {
                                      let aip =
                                        parseFloat(token.aip ?? "0") / 100;
                                      let incentive_token_fdv =
                                        parseFloat(value) *
                                        parseFloat(
                                          token.total_supply as string
                                        );
                                      let input_token_amount = parseFloat(
                                        marketActionForm.watch(
                                          "quantity.amount"
                                        ) ?? "0"
                                      );
                                      let input_token_price =
                                        enrichedMarket?.inputToken.price ?? 0;
                                      let incentive_token_total_supply =
                                        parseFloat(token.total_supply ?? "0");

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
                                                  distribution:
                                                    distribution.toString(),
                                                }
                                              : t
                                          )
                                      );
                                    }
                                  }}
                                  Suffix={() => {
                                    return (
                                      <SecondaryLabel className="shrink-0 font-light text-black">
                                        USD
                                      </SecondaryLabel>
                                    );
                                  }}
                                  // @ts-ignore
                                  placeholder="Price"
                                />
                              </div>
                            </div>

                            <div className="mb-3">
                              <TertiaryLabel className="mb-1 font-medium text-secondary">
                                APR
                              </TertiaryLabel>

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
                                        t.id === token.id
                                          ? { ...t, aip: value }
                                          : t
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
                                      marketActionForm.watch(
                                        "quantity.amount"
                                      ) ?? "0"
                                    );
                                    let input_token_price =
                                      enrichedMarket?.inputToken.price ?? 0;
                                    let incentive_token_total_supply =
                                      parseFloat(token.total_supply ?? "0");

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
                                                distribution:
                                                  distribution.toString(),
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
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4">
                      <TertiaryLabel className="mb-1 font-medium text-secondary">
                        {`Incentive Token per ${enrichedMarket?.inputToken.symbol}`}
                      </TertiaryLabel>

                      {/**
                       * distribution selector
                       */}
                      <InputAmountSelector
                        containerClassName="py-5 pr-1"
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
                              enrichedMarket?.inputToken.price ?? 0;
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
                            <div className="flex w-fit shrink-0 flex-row items-center gap-1">
                              <TokenDisplayer
                                size={4}
                                tokens={[token]}
                                symbols={false}
                              />

                              <SecondaryLabel className="font-light text-black">
                                {`${token.symbol.toUpperCase()} / YEAR`}
                              </SecondaryLabel>

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
                          );
                        }}
                        // @ts-ignore
                        placeholder="Incentive / Year"
                      />

                      <TertiaryLabel className="mt-2 text-secondary">
                        {`The position will be deposited when there are ${token.distribution || 0} ${token.symbol.toUpperCase()} / YEAR being streamed per ${enrichedMarket?.inputToken.symbol}`}
                      </TertiaryLabel>
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
