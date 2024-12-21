import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { useTokenQuotes } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { TransactionOptionsType } from "royco/types";
import { useAccount } from "wagmi";
import { useActiveMarket } from "../../hooks";
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
import { useMarketFormDetails } from "../use-market-form-details";
import { SimulationViewer } from "./simulation-viewer";
import { SlideUpWrapper } from "@/components/animations";
import { BigNumber } from "ethers";
import { formatUnits } from "viem";

export const PreviewStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const [currentTransactions, setCurrentTransactions] = useState<
    Array<TransactionOptionsType>
  >([]);

  const { address, isConnected } = useAccount();
  const { currentMarketData, marketMetadata, propsEnrichedMarket } =
    useActiveMarket();

  const { userType, offerType, marketStep } = useMarketManager();

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketActionForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
  });

  const {
    isLoading,
    isValid,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    // simulationData,
    incentiveData,
  } = useMarketFormDetails(marketActionForm);

  const frontendFee = useMemo(() => {
    if (
      currentMarketData &&
      currentMarketData.frontend_fee !== undefined &&
      currentMarketData.frontend_fee !== null
    ) {
      return formatUnits(BigInt(currentMarketData.frontend_fee), 18);
    }
    return "0";
  }, [currentMarketData?.frontend_fee]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (canBePerformedPartially === false) {
    return (
      <div className="flex w-full grow flex-col place-content-center items-center">
        <AlertIndicator>
          {offerType === MarketOfferType.market.id &&
          userType === MarketUserType.ap.id
            ? "Offer cannot be filled because there are no incentives available"
            : "Offer cannot be filled"}
        </AlertIndicator>
      </div>
    );
  } else if (!!propsEnrichedMarket.data) {
    return (
      <div className={cn("grow overflow-y-scroll", className)} {...props}>
        <div className="rounded-2xl border px-3 pb-3 pt-5">
          <SimulationViewer marketActionForm={marketActionForm} />
        </div>

        <div
          className={cn(
            BASE_MARGIN_TOP.XL,
            "rounded-2xl border px-3 pb-3 pt-5"
          )}
        >
          <SlideUpWrapper
            layout="position"
            layoutId="motion:market:preview-step:incentives-title"
            delay={0.3}
          >
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
            {!!incentiveData &&
              incentiveData.map((incentive, index) => {
                const key = `incentive-data:${incentive.id}:${index}`;

                return (
                  <SlideUpWrapper
                    key={key}
                    layout="position"
                    layoutId={`motion:market:preview-step:incentives-table:token-displayer:${key}`}
                    delay={0.4 + index * 0.05}
                    className={cn(
                      "flex h-fit w-full flex-row place-content-center items-center justify-between border-b border-divider py-3"
                    )}
                  >
                    <TokenDisplayer symbols={true} tokens={[incentive]} />

                    <div className="flex w-fit flex-col items-end text-right">
                      <SecondaryLabel className="font-light text-black">
                        +
                        {Intl.NumberFormat("en-US", {
                          // style:
                          //   marketMetadata.market_type === MarketType.vault.id &&
                          //   userType === MarketUserType.ip.id &&
                          //   marketForm.watch("offer_type") ===
                          //     MarketOfferType.limit.id
                          //     ? "decimal"
                          //     : "percent",
                          style:
                            // recipe market
                            marketMetadata.market_type === MarketType.recipe.id
                              ? "percent"
                              : // vault market
                                userType === MarketUserType.ap.id &&
                                  offerType === MarketOfferType.limit.id
                                ? "percent"
                                : userType === MarketUserType.ip.id &&
                                    MarketOfferType.limit.id
                                  ? "decimal"
                                  : "percent",

                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          // recipe market
                          marketMetadata.market_type === MarketType.recipe.id
                            ? incentive.annual_change_ratio
                            : // vault market
                              userType === MarketUserType.ap.id &&
                                offerType === MarketOfferType.limit.id
                              ? incentive.annual_change_ratio
                              : userType === MarketUserType.ip.id &&
                                  MarketOfferType.limit.id
                                ? incentive.token_amount
                                : incentive.annual_change_ratio

                          // marketMetadata.market_type === MarketType.vault.id &&
                          //   userType === MarketUserType.ip.id &&
                          //   marketForm.watch("offer_type") ===
                          //     MarketOfferType.limit.id
                          //   ? incentive.token_amount
                          //   : incentive.annual_change_ratio
                        )}
                      </SecondaryLabel>

                      {marketMetadata.market_type === MarketType.vault.id &&
                      userType === MarketUserType.ip.id &&
                      offerType === MarketOfferType.limit.id ? (
                        <TertiaryLabel>
                          (
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "standard",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }).format(incentive.token_amount_usd)}
                          )
                        </TertiaryLabel>
                      ) : (
                        <TertiaryLabel>
                          (
                          {Intl.NumberFormat("en-US", {
                            style: "decimal",
                            notation: "standard",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }).format(incentive.per_input_token)}{" "}
                          {incentive.symbol.toUpperCase()} /{" 1.00 "}
                          {currentMarketData?.input_token_data.symbol.toUpperCase()}
                          )
                        </TertiaryLabel>
                      )}
                    </div>
                  </SlideUpWrapper>
                );
              })}

            {/**
             * Indicator for empty incentives
             */}
            {incentiveData.length === 0 && (
              <AlertIndicator className="border-b border-divider">
                No incentives available
              </AlertIndicator>
            )}

            <SlideUpWrapper
              layout="position"
              layoutId="motion:market:preview-step:net-total-indicator"
              delay={0.6}
            >
              {/**
               * Incentives Schedule
               */}
              {currentMarketData?.reward_style !== undefined && (
                <SecondaryLabel
                  className={cn(BASE_MARGIN_TOP.XL, "w-full text-black")}
                >
                  <div className="flex w-full items-center justify-between text-sm">
                    <span>Incentives Schedule</span>
                    <span className="rounded-full border px-2 py-px text-tertiary">
                      {marketMetadata.market_type === MarketType.vault.id
                        ? "Streaming"
                        : RewardStyleMap[currentMarketData.reward_style ?? 0]
                            .label}
                    </span>
                  </div>
                </SecondaryLabel>
              )}

              {/**
               * Native Yield Indicator
               */}
              {userType === MarketUserType.ap.id &&
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
                                Intl.NumberFormat("en-US", {
                                  style: "percent",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(Number(frontendFee)) +
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
                        {Intl.NumberFormat("en-US", {
                          style: "percent",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          currentMarketData.yield_breakdown
                            .filter(
                              (yield_breakdown) =>
                                yield_breakdown.category !== "base"
                            )
                            .reduce(
                              (acc, yield_breakdown) =>
                                acc + yield_breakdown.annual_change_ratio,
                              0
                            )
                        )}
                      </SecondaryLabel>
                    </div>
                  </div>
                )}

              {/**
               * Net/Total Indicator
               */}
              {!!incentiveData && (
                <div className="mb-3 mt-2 flex w-full flex-row items-center justify-between">
                  <SecondaryLabel className="text-success">
                    <div className="mr-2">
                      {`${
                        marketMetadata.market_type === MarketType.vault.id &&
                        offerType === MarketOfferType.limit.id &&
                        userType === MarketUserType.ip.id
                          ? "Net Incentives"
                          : "Net APR"
                      }`}
                    </div>
                    {currentMarketData.frontend_fee !== undefined &&
                      currentMarketData.frontend_fee !== null &&
                      userType === MarketUserType.ip.id && (
                        <InfoTip size="sm" className="max-w-fit">
                          <div>
                            {`Net fees: ` +
                              Intl.NumberFormat("en-US", {
                                style: "percent",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(frontendFee)) +
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
                      {marketMetadata.market_type === MarketType.vault.id &&
                      userType === MarketUserType.ip.id &&
                      offerType === MarketOfferType.limit.id
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }).format(
                            incentiveData.reduce(
                              (acc, incentive) =>
                                acc + incentive.token_amount_usd,
                              0
                            )
                          )
                        : incentiveData.reduce(
                              (acc, incentive) =>
                                acc + incentive.annual_change_ratio,
                              0
                            ) >= Math.pow(10, 18)
                          ? "N/D"
                          : Intl.NumberFormat("en-US", {
                              style: "percent",
                              notation: "compact",
                              useGrouping: true,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(
                              incentiveData.reduce(
                                (acc, incentive) =>
                                  acc + incentive.annual_change_ratio,

                                userType === MarketUserType.ap.id &&
                                  offerType === MarketOfferType.market.id
                                  ? currentMarketData.yield_breakdown
                                      .filter(
                                        (yield_breakdown) =>
                                          yield_breakdown.category !== "base"
                                      )
                                      .reduce(
                                        (acc, yield_breakdown) =>
                                          acc +
                                          yield_breakdown.annual_change_ratio,
                                        0
                                      )
                                  : 0
                              )
                            )}
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
          <SlideUpWrapper
            layout="position"
            layoutId="motion:market:preview-step:transactions-title"
            delay={0.4}
          >
            <SecondaryLabel className={cn(BASE_LABEL_BORDER)}>
              Transactions
            </SecondaryLabel>
          </SlideUpWrapper>

          <div className={cn(BASE_MARGIN_TOP.SM, "flex flex-col gap-2")}>
            {!!writeContractOptions &&
              writeContractOptions.map((txOptions, txIndex) => {
                if (!!txOptions) {
                  const BASE_KEY = `transaction-row:${txIndex}`;

                  return (
                    <SlideUpWrapper
                      key={`preview-step:transaction-row:${BASE_KEY}`}
                      layout="position"
                      layoutId={`motion:market:preview-step:transaction-row:${txIndex}`}
                      delay={0.5 + txIndex * 0.05}
                    >
                      <TransactionRow
                        transactionIndex={txIndex + 1}
                        transaction={txOptions}
                        txStatus={"idle"}
                      />
                    </SlideUpWrapper>
                  );
                }
              })}
          </div>
        </div>

        {canBePerformedCompletely === false &&
          canBePerformedPartially === true && (
            <SlideUpWrapper
              layout="position"
              layoutId="motion:market:preview-step:warning:offer-cannot-be-filled-completely"
              delay={0.6}
            >
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
