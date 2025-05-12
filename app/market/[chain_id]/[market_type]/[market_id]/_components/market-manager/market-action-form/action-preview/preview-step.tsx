import { cn } from "@/lib/utils";
import React from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../../composables";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator, InfoTip, TokenDisplayer } from "@/components/common";
import {
  MarketOfferType,
  MarketType,
  MarketUserType,
  RewardStyleMap,
  useMarketManager,
} from "@/store";
import { TransactionRow } from "@/components/composables/transaction-modal/transaction-row";
import { TriangleAlertIcon } from "lucide-react";
import { SlideUpWrapper } from "@/components/animations";
import formatNumber from "@/utils/numbers";
import { enrichTxOptions } from "royco/transaction";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useMarketFormDetailsApi } from "../use-market-form-details-api";

export const PreviewStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { userType, offerType } = useMarketManager();

  const propsAction = useMarketFormDetailsApi(marketActionForm);

  if (propsAction.isLoading) {
    return (
      <div className="flex h-[12rem] w-full grow flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (propsAction.isError) {
    return (
      <div className="flex h-[12rem] w-full grow flex-col place-content-center items-center">
        <AlertIndicator>{propsAction.error?.message}</AlertIndicator>
      </div>
    );
  } else if (propsAction.data?.fillStatus === "empty") {
    return (
      <div className="flex h-[12rem] w-full grow flex-col place-content-center items-center">
        <AlertIndicator>
          {offerType === MarketOfferType.market.id &&
          userType === MarketUserType.ap.id
            ? "Offer cannot be filled because there are no incentives available"
            : "Offer cannot be filled"}
        </AlertIndicator>
      </div>
    );
  } else if (propsAction.data) {
    return (
      <div className={cn("grow overflow-y-scroll", className)} {...props}>
        {/* {showSimulation && (
          <div className={cn("mb-5 rounded-2xl border px-3 pb-3 pt-5")}>
            <SimulationViewer marketActionForm={marketActionForm} />
          </div>
        )} */}

        <div className={cn("rounded-2xl border px-3 pb-3 pt-5")}>
          <SlideUpWrapper delay={0.3}>
            <SecondaryLabel className={cn(BASE_LABEL_BORDER)}>
              Incentives{" "}
              {userType === MarketUserType.ap.id
                ? offerType === MarketOfferType.market.id
                  ? "Received"
                  : "Asked"
                : offerType === MarketOfferType.market.id
                  ? "Given"
                  : "Offered"}
            </SecondaryLabel>
          </SlideUpWrapper>

          {/**
           * Incentive Table
           */}
          <div className="flex h-fit shrink-0 flex-col">
            {propsAction.data.incentiveTokens &&
              propsAction.data.incentiveTokens.map((incentive, index) => {
                const key = `incentive-data:${incentive.id}:${index}`;

                return (
                  <SlideUpWrapper
                    key={key}
                    delay={0.4 + index * 0.05}
                    className={cn(
                      "flex h-fit w-full flex-row place-content-center items-center justify-between border-b border-divider py-3"
                    )}
                  >
                    <TokenDisplayer symbols={true} tokens={[incentive]} />

                    <div className="flex w-fit flex-col items-end text-right">
                      <SecondaryLabel className="font-light text-black">
                        +
                        {formatNumber(
                          enrichedMarket?.marketType === MarketType.recipe.value
                            ? incentive.yieldRate
                            : // vault market
                              userType === MarketUserType.ap.id &&
                                offerType === MarketOfferType.limit.id
                              ? incentive.yieldRate
                              : userType === MarketUserType.ip.id &&
                                  MarketOfferType.limit.id
                                ? incentive.tokenAmount
                                : incentive.yieldRate,
                          {
                            type:
                              // recipe market
                              enrichedMarket?.marketType ===
                              MarketType.recipe.value
                                ? "percent"
                                : // vault market
                                  userType === MarketUserType.ap.id &&
                                    offerType === MarketOfferType.limit.id
                                  ? "percent"
                                  : userType === MarketUserType.ip.id &&
                                      MarketOfferType.limit.id
                                    ? "number"
                                    : "percent",
                          }
                        )}
                      </SecondaryLabel>

                      {enrichedMarket?.marketType === MarketType.vault.value &&
                      userType === MarketUserType.ip.id &&
                      offerType === MarketOfferType.limit.id ? (
                        <TertiaryLabel>
                          {formatNumber(incentive.tokenAmountUsd, {
                            type: "currency",
                          })}
                        </TertiaryLabel>
                      ) : (
                        <TertiaryLabel>
                          {formatNumber(incentive.perInputToken)}{" "}
                          {incentive.symbol} /{" 1.00 "}
                          {enrichedMarket?.inputToken.symbol}
                        </TertiaryLabel>
                      )}
                    </div>
                  </SlideUpWrapper>
                );
              })}

            {/**
             * Indicator for empty incentives
             */}
            {propsAction.data.incentiveTokens.length === 0 && (
              <AlertIndicator className="border-b border-divider">
                No incentives available
              </AlertIndicator>
            )}

            <SlideUpWrapper delay={0.6}>
              {/**
               * Incentives Schedule
               */}
              {enrichedMarket?.rewardStyle && (
                <SecondaryLabel
                  className={cn(BASE_MARGIN_TOP.XL, "w-full text-black")}
                >
                  <div className="flex w-full items-center justify-between text-sm">
                    <span>Incentives Schedule</span>
                    <span className="rounded-full border px-2 py-px text-tertiary">
                      {enrichedMarket?.marketType === MarketType.vault.value
                        ? "Streaming"
                        : RewardStyleMap[enrichedMarket?.rewardStyle].label}
                    </span>
                  </div>
                </SecondaryLabel>
              )}

              {/**
               * Native Yield Indicator
               */}
              {/* {userType === MarketUserType.ap.id &&
                offerType === MarketOfferType.market.id &&
                currentMarketData.yield_breakdown.filter(
                  (yield_breakdown) => yield_breakdown.category !== "base"
                ).length > 0 && (
                  <div className="mt-3 flex w-full flex-row items-center justify-between">
                    <SecondaryLabel className="text-black">
                      <div className="mr-2">Native Yield</div>
                      {currentMarketData.frontend_fee !== undefined &&
                        currentMarketData.frontend_fee !== null &&
                        userType === MarketUserType.ip.id && (
                          <InfoTip size="sm" className="max-w-fit">
                            <div>
                              {`Net fees: ` +
                                formatNumber(Number(frontendFee), {
                                  type: "percent",
                                }) +
                                ` of incentives.`}
                            </div>
                            <div className="italic">
                              This is the APY offered by the underlying ERC4626
                              vault.
                            </div>
                          </InfoTip>
                        )}
                    </SecondaryLabel>

                    <div className="flex w-fit flex-col items-end text-right">
                      <SecondaryLabel className="text-black">
                        {currentMarketData.yield_breakdown.filter(
                          (yield_breakdown) =>
                            yield_breakdown.category !== "base"
                        ).length > 0
                          ? "+"
                          : null}
                        {formatNumber(
                          currentMarketData.yield_breakdown
                            .filter(
                              (yield_breakdown) =>
                                yield_breakdown.category !== "base"
                            )
                            .reduce(
                              (acc, yield_breakdown) =>
                                acc + yield_breakdown.annual_change_ratio,
                              0
                            ),
                          {
                            type: "percent",
                          }
                        )}
                      </SecondaryLabel>
                    </div>
                  </div>
                )} */}

              {/**
               * Net/Total Indicator
               */}
              {propsAction.data.incentiveTokens && (
                <div className="mb-3 mt-2 flex w-full flex-row items-center justify-between">
                  <SecondaryLabel className="text-success">
                    <div className="mr-2">
                      {`${
                        enrichedMarket?.marketType === MarketType.vault.value &&
                        offerType === MarketOfferType.limit.id &&
                        userType === MarketUserType.ip.id
                          ? "Net Incentives"
                          : "Net APR"
                      }`}
                    </div>
                    {userType === MarketUserType.ip.id &&
                      propsAction.data.totalFeeRatio > 0 && (
                        <InfoTip size="sm" className="max-w-fit">
                          <div>
                            {`Net fees: ` +
                              formatNumber(propsAction.data.totalFeeRatio, {
                                type: "percent",
                              }) +
                              ` of incentives.`}
                          </div>
                          <div className="italic">
                            Fees are only taken when the order is filled.
                          </div>
                        </InfoTip>
                      )}
                  </SecondaryLabel>

                  <div className="flex w-fit flex-col items-end text-right">
                    <SecondaryLabel className="text-black">
                      +
                      {enrichedMarket?.marketType === MarketType.vault.value &&
                      userType === MarketUserType.ip.id &&
                      offerType === MarketOfferType.limit.id
                        ? formatNumber(
                            propsAction.data.incentiveTokens.reduce(
                              (acc, incentive) =>
                                acc + incentive.tokenAmountUsd,
                              0
                            ),
                            {
                              type: "currency",
                            }
                          )
                        : formatNumber(propsAction.data.yieldRate, {
                            type: "percent",
                          })}
                    </SecondaryLabel>
                    <TertiaryLabel>Estimated (May Change)</TertiaryLabel>
                  </div>
                </div>
              )}
            </SlideUpWrapper>
          </div>
        </div>

        <div
          className={cn(
            BASE_MARGIN_TOP.XL,
            "rounded-2xl border px-3 pb-3 pt-5"
          )}
        >
          <SlideUpWrapper delay={0.4}>
            <SecondaryLabel className={cn(BASE_LABEL_BORDER)}>
              Transactions
            </SecondaryLabel>
          </SlideUpWrapper>

          <div className={cn(BASE_MARGIN_TOP.SM, "flex flex-col gap-2")}>
            {propsAction.data.rawTxOptions &&
              propsAction.data.rawTxOptions.map((txOptions, txIndex) => {
                const enrichedTxOptions = enrichTxOptions({
                  txOptions: [txOptions],
                });

                if (enrichedTxOptions.length > 0) {
                  const BASE_KEY = `transaction-row:${txIndex}`;

                  return (
                    <SlideUpWrapper
                      key={`preview-step:transaction-row:${BASE_KEY}`}
                      delay={0.5 + txIndex * 0.05}
                    >
                      <TransactionRow
                        transactionIndex={txIndex + 1}
                        transaction={enrichedTxOptions[0]}
                        txStatus={"idle"}
                      />
                    </SlideUpWrapper>
                  );
                }
              })}
          </div>
        </div>

        {propsAction.data.fillStatus === "partial" && (
          <SlideUpWrapper delay={0.6}>
            <div
              className={cn(
                BASE_MARGIN_TOP.XL,
                "w-full rounded-xl border border-divider bg-error p-2 text-left font-gt text-sm font-light text-white"
              )}
            >
              <div className="flex w-full flex-row place-content-center items-center gap-1">
                <TriangleAlertIcon className="h-4 w-4" />

                <div className="flex h-4">
                  <span className="leading-5">WARNING</span>
                </div>
              </div>
              <div className="mt-2">
                The offer cannot be filled completely, but partial fill is
                available.
              </div>
            </div>
          </SlideUpWrapper>
        )}
      </div>
    );
  }
});
