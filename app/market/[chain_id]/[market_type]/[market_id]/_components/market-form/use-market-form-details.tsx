import {
  getTokenQuote,
  useMarketAction,
  usePrepareMarketAction,
  useTokenQuotes,
} from "@/sdk/hooks";
import { useActiveMarket } from "../hooks";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "./market-form-schema";
import {
  MarketSteps,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { getSupportedToken, SupportedToken } from "@/sdk/constants";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { RoycoMarketOfferType } from "@/sdk/market";
import { parseTokenAmountToRawAmount } from "@/sdk/utils";

export const useMarketFormDetails = (
  marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>
) => {
  const { currentMarketData, marketMetadata } = useActiveMarket();
  const {
    marketStep,
    setMarketStep,
    transactions,
    setTransactions,
    actionType,
    setActionType,
    userType,
    setUserType,
    viewType,
  } = useMarketManager();

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
    custom_token_data:
      marketMetadata.market_type === MarketType.vault.id &&
      marketForm.watch("offer_type") === RoycoMarketOfferType.limit.id
        ? marketForm
            .watch("incentive_tokens")
            .map((incentive) => {
              const total_supply = parseFloat(incentive.distribution ?? "0");
              const fdv = parseFloat(incentive.fdv ?? "0");
              const price = fdv / total_supply;

              return {
                token_id: incentive.id,
                ...(isFinite(price) && { price: price.toString() }),
                ...(isFinite(total_supply) && {
                  total_supply: total_supply.toString(),
                }),
                ...(isFinite(fdv) && { fdv: fdv.toString() }),
              };
            })
            .filter(
              (
                data
              ): data is {
                token_id: string;
                price?: string;
                total_supply?: string;
                fdv?: string;
              } => Object.keys(data).length > 1
            )
        : undefined,
  });

  const { address, isConnected } = useAccount();

  const {
    isValid,
    isLoading,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  } = usePrepareMarketAction({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    market_type: marketMetadata.market_type,
    user_type: userType,
    offer_type: marketForm.watch("offer_type"),
    account: address,
    quantity: marketForm.watch("offer_raw_amount"),
    funding_vault: marketForm.watch("funding_vault").address,

    token_ids: marketForm.watch("incentive_tokens").map((token) => token.id),
    token_amounts: marketForm.watch("incentive_tokens").map((token) => {
      return parseTokenAmountToRawAmount(token.amount, token.decimals);
    }),
    expiry: marketForm.watch("no_expiry")
      ? "0"
      : Math.floor(
          (marketForm.watch("expiry") || new Date(0)).getTime() / 1000
        ).toString(),

    token_rates: marketForm.watch("incentive_tokens").map((incentiveData) => {
      try {
        const aipPercentage = parseFloat(incentiveData.aip ?? "0");
        const aip = aipPercentage / 100;
        const fdv = parseFloat(incentiveData.fdv ?? "0");
        const distribution = parseFloat(incentiveData.distribution ?? "0");

        const offerAmount = parseFloat(
          marketForm.watch("offer_raw_amount") || "0"
        );

        const inputTokenData = getTokenQuote({
          token_id: currentMarketData?.input_token_id ?? "",
          token_quotes: propsTokenQuotes,
        });

        const inputTokenPrice = inputTokenData.price;
        const incentiveTokenPrice = fdv / distribution;

        const rate =
          (aip * offerAmount * inputTokenPrice) /
          (incentiveTokenPrice * (365 * 24 * 60 * 60));

        if (isNaN(rate)) {
          return "0";
        }

        const refinedRate = parseInt(rate.toFixed(incentiveData.decimals));

        if (refinedRate === 0) {
          return "0";
        }

        return refinedRate.toString() || "0";
      } catch (error) {
        return "0";
      }
    }),

    custom_token_data:
      marketMetadata.market_type === MarketType.vault.id &&
      marketForm.watch("offer_type") === RoycoMarketOfferType.limit.id
        ? marketForm
            .watch("incentive_tokens")
            .map((incentive) => {
              const total_supply = parseFloat(incentive.distribution ?? "0");
              const fdv = parseFloat(incentive.fdv ?? "0");
              const price = fdv / total_supply;

              return {
                token_id: incentive.id,
                ...(isFinite(price) && { price: price.toString() }),
                ...(isFinite(total_supply) && {
                  total_supply: total_supply.toString(),
                }),
                ...(isFinite(fdv) && { fdv: fdv.toString() }),
              };
            })
            .filter(
              (
                data
              ): data is {
                token_id: string;
                price?: string;
                total_supply?: string;
                fdv?: string;
              } => Object.keys(data).length > 1
            )
        : undefined,
    start_timestamps: marketForm
      .watch("incentive_tokens")
      .map((incentive) =>
        Math.floor(
          new Date(incentive.start_timestamp ?? 0).getTime() / 1000
        ).toString()
      ),
    end_timestamps: marketForm
      .watch("incentive_tokens")
      .map((incentive) =>
        Math.floor(
          new Date(incentive.end_timestamp ?? 0).getTime() / 1000
        ).toString()
      ),
  });

  return {
    isValid,
    isLoading,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  };

  // const {
  //   isLoading,
  //   isValid,
  //   isValidMessage,
  //   isReady,
  //   writeContractOptions,
  //   canBePerformedCompletely,
  //   canBePerformedPartially,
  //   simulationData,
  //   incentivesData,
  //   // incentivesInfo: incentivesInfoCreateOfferRecipe,
  // } = useMarketAction({
  //   chain_id: marketMetadata.chain_id,
  //   market_id: marketMetadata.market_id,
  //   market_type: marketMetadata.market_type,
  //   funding_vault: marketForm.watch("funding_vault").address,
  //   quantity: marketForm.watch("offer_raw_amount"),
  //   expiry:
  //     marketForm.watch("no_expiry") === true
  //       ? "0"
  //       : !marketForm.watch("expiry")
  //         ? undefined
  //         : Math.floor(
  //             (marketForm.watch("expiry") ?? new Date()).getTime() / 1000
  //           ).toString(),

  //   // Incentive Token IDs
  //   incentive_token_ids: marketForm
  //     .watch("incentive_tokens")
  //     .map((token) => token.id),

  //   // Incentive Token Amounts
  //   incentive_token_amounts: marketForm
  //     .watch("incentive_tokens")
  //     .map((token) => token.raw_amount ?? "0"),

  //   // Incentive Rates
  //   incentive_rates:
  //     marketMetadata.market_type === MarketType.vault.id &&
  //     userType === MarketUserType.ap.id
  //       ? marketForm.watch("incentive_tokens").map((token) => {
  //           try {
  //             const aipPercentage = parseFloat(token.aip ?? "0");
  //             const aip = aipPercentage / 100;
  //             const fdv = parseFloat(token.fdv ?? "0");
  //             const distribution = parseFloat(token.distribution ?? "0");
  //             const offerAmount = parseFloat(
  //               marketForm.watch("offer_amount") ?? "0"
  //             );

  //             const inputTokenPrice =
  //               propsTokenQuotes.data?.find(
  //                 (quote: any) => quote.id === currentMarketData?.input_token_id
  //               )?.price ?? 0;

  //             const incentiveTokenPrice = fdv / distribution;

  //             // rate is amount of input tokens per incentive token per second
  //             const rate =
  //               (aip * offerAmount * inputTokenPrice) /
  //               (incentiveTokenPrice * (365 * 24 * 60 * 60));

  //             if (isNaN(rate)) {
  //               return "0";
  //             }

  //             const rateInWei = ethers.utils.parseUnits(
  //               rate.toFixed(token.decimals),
  //               token.decimals
  //             );

  //             return rateInWei.toString();
  //           } catch (error) {
  //             return "0";
  //           }
  //         })
  //       : marketForm
  //           .watch("incentive_tokens")
  //           .map((token) => token.raw_amount ?? "0"),
  //   // custom incentive data for ap limit offers in vault markets
  //   custom_incentive_data:
  //     marketMetadata.market_type === MarketType.vault.id &&
  //     userType === MarketUserType.ap.id
  //       ? marketForm.watch("incentive_tokens").map(
  //           (
  //             token: SupportedToken & {
  //               aip?: string;
  //               fdv?: string;
  //               distribution?: string;
  //             }
  //           ) => {
  //             try {
  //               const aipPercentage = parseFloat(token.aip ?? "0");
  //               const aip = aipPercentage / 100;
  //               const fdv = parseFloat(token.fdv ?? "0");
  //               const distribution = parseFloat(token.distribution ?? "0");
  //               const offerAmount = parseFloat(
  //                 marketForm.watch("offer_amount") ?? "0"
  //               );

  //               const inputTokenPrice =
  //                 propsTokenQuotes.data?.find(
  //                   (quote: any) =>
  //                     quote.id === currentMarketData?.input_token_id
  //                 )?.price ?? 0;

  //               const incentiveTokenPrice = fdv / distribution;

  //               let rate =
  //                 (aip * offerAmount * inputTokenPrice) /
  //                 (incentiveTokenPrice * (365 * 24 * 60 * 60));

  //               if (isNaN(rate)) {
  //                 return "0";
  //               }

  //               const rateInWei = ethers.utils.parseUnits(
  //                 rate.toFixed(token.decimals),
  //                 token.decimals
  //               );

  //               return {
  //                 ...token,
  //                 aip,
  //                 fdv,
  //                 distribution,
  //                 offerAmount,
  //                 inputTokenPrice,
  //                 incentiveTokenPrice,
  //                 rate,
  //                 rateInWei: rateInWei.toString(),
  //               };
  //             } catch (error) {
  //               return "0";
  //             }
  //           }
  //         ) ?? []
  //       : marketForm
  //           .watch("incentive_tokens")
  //           .map((token) => token.raw_amount ?? "0"),

  //   // Incentive Start timestamps
  //   incentive_start_timestamps: marketForm
  //     .watch("incentive_tokens")
  //     .map((token) =>
  //       Math.floor(
  //         (token.start_timestamp ?? new Date()).getTime() / 1000
  //       ).toString()
  //     ),

  //   // Incentive End timestamps
  //   incentive_end_timestamps: marketForm
  //     .watch("incentive_tokens")
  //     .map((token) =>
  //       Math.floor(
  //         (token.end_timestamp ?? new Date()).getTime() / 1000
  //       ).toString()
  //     ),

  //   user_type: userType,
  //   offer_type: marketForm.watch("offer_type"),
  //   account: address,
  //   frontendFeeRecipient: process.env.NEXT_PUBLIC_FRONTEND_FEE_RECIPIENT || "",
  //   enabled: marketStep !== MarketSteps.params.id,
  //   simulation_url: process.env.NEXT_PUBLIC_SIMULATION_URL || "",
  // });

  // return {
  //   isLoading,
  //   isValid,
  //   isValidMessage,
  //   isReady,
  //   writeContractOptions,
  //   canBePerformedCompletely,
  //   canBePerformedPartially,
  //   simulationData,
  //   incentivesData,
  // };
};
