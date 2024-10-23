import { cn } from "@/lib/utils";
import React, { Fragment, useState } from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "../market-form-schema";
import { useMarketAction, useTokenQuotes } from "@/sdk/hooks";
import { LoadingSpinner } from "@/components/composables";
import { TransactionOptionsType } from "@/sdk/types";
import { useAccount } from "wagmi";
import { useActiveMarket } from "../../hooks";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import {
  MarketOfferType,
  MarketSteps,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { TransactionRow } from "@/components/composables/transaction-modal/transaction-row";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ethers } from "ethers";
import { SupportedToken } from "@/sdk/constants";
import { TriangleAlertIcon } from "lucide-react";

export const PreviewStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const [currentTransactions, setCurrentTransactions] = useState<
    Array<TransactionOptionsType>
  >([]);

  const { address, isConnected } = useAccount();
  const { currentMarketData, marketMetadata, propsEnrichedMarket } =
    useActiveMarket();

  const { userType, marketStep } = useMarketManager();

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
  });

  const {
    isLoading,
    isValid,
    isValidMessage,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    simulationData,
    incentivesData,
    // incentivesInfo: incentivesInfoCreateOfferRecipe,
  } = useMarketAction({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    market_type: marketMetadata.market_type,
    funding_vault: marketForm.watch("funding_vault").address,
    quantity: marketForm.watch("offer_raw_amount"),
    expiry:
      marketForm.watch("no_expiry") === true
        ? "0"
        : !marketForm.watch("expiry")
          ? undefined
          : Math.floor(
              (marketForm.watch("expiry") ?? new Date()).getTime() / 1000
            ).toString(),

    // Incentive Token IDs
    incentive_token_ids: marketForm
      .watch("incentive_tokens")
      .map((token) => token.id),

    // Incentive Token Amounts
    incentive_token_amounts: marketForm
      .watch("incentive_tokens")
      .map((token) => token.raw_amount ?? "0"),

    // Incentive Rates
    incentive_rates:
      marketMetadata.market_type === MarketType.vault.id &&
      userType === MarketUserType.ap.id
        ? marketForm.watch("incentive_tokens").map((token) => {
            try {
              const aipPercentage = parseFloat(token.aip ?? "0");
              const aip = aipPercentage / 100;
              const fdv = parseFloat(token.fdv ?? "0");
              const distribution = parseFloat(token.distribution ?? "0");
              const offerAmount = parseFloat(
                marketForm.watch("offer_amount") ?? "0"
              );

              const inputTokenPrice =
                propsTokenQuotes.data?.find(
                  (quote: any) => quote.id === currentMarketData?.input_token_id
                )?.price ?? 0;

              const incentiveTokenPrice = fdv / distribution;

              // rate is amount of input tokens per incentive token per second
              const rate =
                (aip * offerAmount * inputTokenPrice) /
                (incentiveTokenPrice * (365 * 24 * 60 * 60));

              if (isNaN(rate)) {
                return "0";
              }

              const rateInWei = ethers.utils.parseUnits(
                rate.toFixed(token.decimals),
                token.decimals
              );

              console.log("rateInWei", rateInWei.toString());

              return rateInWei.toString();
            } catch (error) {
              return "0";
            }
          })
        : marketForm
            .watch("incentive_tokens")
            .map((token) => token.raw_amount ?? "0"),
    // custom incentive data for ap limit offers in vault markets
    custom_incentive_data:
      marketMetadata.market_type === MarketType.vault.id &&
      userType === MarketUserType.ap.id
        ? marketForm.watch("incentive_tokens").map(
            (
              token: SupportedToken & {
                aip?: string;
                fdv?: string;
                distribution?: string;
              }
            ) => {
              try {
                const aipPercentage = parseFloat(token.aip ?? "0");
                const aip = aipPercentage / 100;
                const fdv = parseFloat(token.fdv ?? "0");
                const distribution = parseFloat(token.distribution ?? "0");
                const offerAmount = parseFloat(
                  marketForm.watch("offer_amount") ?? "0"
                );

                const inputTokenPrice =
                  propsTokenQuotes.data?.find(
                    (quote: any) =>
                      quote.id === currentMarketData?.input_token_id
                  )?.price ?? 0;

                const incentiveTokenPrice = fdv / distribution;

                let rate =
                  (aip * offerAmount * inputTokenPrice) /
                  (incentiveTokenPrice * (365 * 24 * 60 * 60));

                if (isNaN(rate)) {
                  return "0";
                }

                const rateInWei = ethers.utils.parseUnits(
                  rate.toFixed(token.decimals),
                  token.decimals
                );

                return {
                  ...token,
                  aip,
                  fdv,
                  distribution,
                  offerAmount,
                  inputTokenPrice,
                  incentiveTokenPrice,
                  rate,
                  rateInWei: rateInWei.toString(),
                };
              } catch (error) {
                return "0";
              }
            }
          ) ?? []
        : marketForm
            .watch("incentive_tokens")
            .map((token) => token.raw_amount ?? "0"),

    // Incentive Start timestamps
    incentive_start_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.start_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    // Incentive End timestamps
    incentive_end_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.end_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    user_type: userType,
    offer_type: marketForm.watch("offer_type"),
    account: address,
    frontendFeeRecipient: process.env.NEXT_PUBLIC_FRONTEND_FEE_RECIPIENT || "",
    enabled: marketStep !== MarketSteps.params.id,
    simulation_url: process.env.NEXT_PUBLIC_SIMULATION_URL || "",
  });

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
      <div
        className={cn("max-h-[40rem] grow overflow-y-scroll", className)}
        {...props}
      >
        {/* <SecondaryLabel className={cn(BASE_LABEL_BORDER)}>
          Simulation
        </SecondaryLabel>
        <div
          className={cn(
            BASE_MARGIN_TOP.SM,
            "flex h-28 w-full flex-col place-content-center items-center bg-z2"
          )}
        ></div> */}

        <SecondaryLabel className={cn(BASE_LABEL_BORDER, "font-normal")}>
          Tenderly Simulation
        </SecondaryLabel>

        <ScrollArea
          className={cn(BASE_MARGIN_TOP.SM, "flex h-fit w-full flex-row gap-2")}
        >
          <div className="flex h-fit w-full flex-row gap-2">
            {!!simulationData &&
              simulationData.map((tokenData, txIndex) => {
                const key = `simulation-data:${tokenData.id}:${txIndex}`;

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex h-fit w-[49%] shrink-0 flex-col rounded-xl bg-z2 p-3"
                    )}
                  >
                    <TokenDisplayer symbols={false} tokens={[tokenData]} />
                    <SecondaryLabel className="mt-2 font-normal text-black">
                      {`${tokenData.type === "in" ? "+" : "-"}${Intl.NumberFormat(
                        "en-US",
                        {
                          style: "decimal",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      ).format(
                        tokenData.token_amount
                      )} ${tokenData.symbol.toUpperCase()}`}
                    </SecondaryLabel>

                    <TertiaryLabel className="text-xs">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(tokenData.token_amount_usd)}
                    </TertiaryLabel>
                  </div>
                );
              })}

            {!!simulationData && simulationData.length === 0 && (
              <AlertIndicator className="">
                No asset changes detected
              </AlertIndicator>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <SecondaryLabel className={cn(BASE_MARGIN_TOP.XL, BASE_LABEL_BORDER)}>
          Incentives{" "}
          {userType === MarketUserType.ap.id
            ? marketForm.watch("offer_type") === MarketOfferType.market.id
              ? "Received"
              : "Asked"
            : marketForm.watch("offer_type") === MarketOfferType.market.id
              ? "Given"
              : "Offered"}
        </SecondaryLabel>

        {/**
         * Incentive Table
         */}
        <div className="flex h-fit shrink-0 flex-col">
          {!!incentivesData &&
            incentivesData.map((incentive, index) => {
              const key = `incentive-data:${incentive.id}:${index}`;

              return (
                <div
                  key={key}
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
                                marketForm.watch("offer_type") ===
                                  MarketOfferType.limit.id
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
                              marketForm.watch("offer_type") ===
                                MarketOfferType.limit.id
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
                    marketForm.watch("offer_type") ===
                      MarketOfferType.limit.id ? (
                      <TertiaryLabel>
                        (
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(incentive.per_input_token)}
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
                </div>
              );
            })}

          {/**
           * Indicator for empty incentives
           */}
          {incentivesData.length === 0 && (
            <AlertIndicator className="border-b border-divider">
              No incentives available
            </AlertIndicator>
          )}

          {/**
           * Net/Total Indicator
           */}
          {!!incentivesData && (
            <div className="flex w-full flex-row items-center justify-between py-3">
              <SecondaryLabel className="text-success">
                {`${userType === MarketUserType.ap.id ? "Net AIP" : "Net Incentives"}`}
              </SecondaryLabel>

              <div className="flex w-fit flex-col items-end text-right">
                <SecondaryLabel className="text-black">
                  +
                  {marketMetadata.market_type === MarketType.vault.id &&
                  userType === MarketUserType.ip.id &&
                  marketForm.watch("offer_type") === MarketOfferType.limit.id
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        incentivesData.reduce(
                          (acc, incentive) => acc + incentive.token_amount_usd,
                          0
                        )
                      )
                    : Intl.NumberFormat("en-US", {
                        style: "percent",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        incentivesData.reduce(
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
        </div>

        <SecondaryLabel className={cn(BASE_MARGIN_TOP.MD, BASE_LABEL_BORDER)}>
          Transactions
        </SecondaryLabel>
        <div className={cn(BASE_MARGIN_TOP.SM, "flex flex-col gap-2")}>
          {!!writeContractOptions &&
            writeContractOptions.map((txOptions, txIndex) => {
              if (!!txOptions) {
                return (
                  <TransactionRow
                    transactionIndex={txIndex + 1}
                    transaction={txOptions}
                    txStatus={"idle"}
                  />
                );
              }
            })}
        </div>

        {canBePerformedCompletely === false &&
          canBePerformedPartially === true && (
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
              <div className="mt-1">
                Complete offer cannot be filled completely, but partial fill is
                available.
              </div>
            </div>
          )}
      </div>
    );
  }
});
