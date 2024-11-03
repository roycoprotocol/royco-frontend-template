import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { useTokenQuotes } from "@/sdk/hooks";
import { LoadingSpinner } from "@/components/composables";
import { TransactionOptionsType } from "@/sdk/types";
import { useAccount } from "wagmi";
import { useActiveMarket } from "../../hooks";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import {
  MarketOfferType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { TransactionRow } from "@/components/composables/transaction-modal/transaction-row";
import { TriangleAlertIcon } from "lucide-react";
import { useMarketFormDetails } from "../use-market-form-details";
import { SimulationViewer } from "./simulation-viewer";
import { SlideUpWrapper } from "@/components/animations";

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (canBePerformedPartially === false) {
    return (
      <div className="flex h-12 w-full grow flex-col place-content-center items-center">
        <AlertIndicator>Offer cannot be fulfilled</AlertIndicator>
      </div>
    );
  } else if (!!propsEnrichedMarket.data) {
    return (
      <div className={cn("grow overflow-y-scroll", className)} {...props}>
        <SimulationViewer marketActionForm={marketActionForm} />

        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:preview-step:incentives-title"
          delay={0.3}
        >
          <SecondaryLabel className={cn(BASE_MARGIN_TOP.XL, BASE_LABEL_BORDER)}>
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
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(incentive.token_amount_usd)}
                        )
                      </TertiaryLabel>
                    ) : (
                      <TertiaryLabel>
                        (
                        {Intl.NumberFormat("en-US", {
                          style: "decimal",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
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

          {/**
           * Net/Total Indicator
           */}
          <SlideUpWrapper
            layout="position"
            layoutId="motion:market:preview-step:net-total-indicator"
            delay={0.5}
          >
            {!!incentiveData && (
              <div className="flex w-full flex-row items-center justify-between py-3">
                <SecondaryLabel className="text-success">
                  {`${userType === MarketUserType.ap.id ? "Net APR" : "Net Incentives"}`}
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
                          maximumFractionDigits: 2,
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
                              0
                            )
                          )}
                  </SecondaryLabel>
                  <TertiaryLabel>Estimated (May Change)</TertiaryLabel>
                </div>
              </div>
            )}
          </SlideUpWrapper>
        </div>

        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:preview-step:transactions-title"
          delay={0.4}
        >
          <SecondaryLabel className={cn(BASE_MARGIN_TOP.MD, BASE_LABEL_BORDER)}>
            Transactions
          </SecondaryLabel>
        </SlideUpWrapper>

        <div className={cn(BASE_MARGIN_TOP.SM, "flex flex-col gap-2")}>
          {!!writeContractOptions &&
            writeContractOptions.map((txOptions, txIndex) => {
              if (!!txOptions) {
                const key = `transaction-row:${txIndex}`;

                return (
                  <SlideUpWrapper
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
                  Complete offer cannot be filled completely, but partial fill
                  is available.
                </div>
              </div>
            </SlideUpWrapper>
          )}
      </div>
    );
  }
});
