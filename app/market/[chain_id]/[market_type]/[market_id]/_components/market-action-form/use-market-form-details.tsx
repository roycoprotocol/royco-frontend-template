import {
  getTokenQuote,
  usePrepareMarketAction,
  useTokenQuotes,
} from "@/sdk/hooks";
import { useActiveMarket } from "../hooks";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "./market-action-form-schema";
import {
  MarketFundingType,
  MarketSteps,
  MarketType,
  MarketUserType,
  MarketVaultIncentiveAction,
  useMarketManager,
} from "@/store";
import { useAccount } from "wagmi";
import { RoycoMarketOfferType } from "@/sdk/market";
import { parseRawAmount, parseTokenAmountToRawAmount } from "@/sdk/utils";
import { NULL_ADDRESS } from "@/sdk/constants";
import { BigNumber } from "ethers";

export const useMarketFormDetails = (
  marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>
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
    offerType,
    setUserType,
    viewType,
    vaultIncentiveActionType,
    setVaultIncentiveActionType,
    fundingType,
  } = useMarketManager();

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketActionForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
    custom_token_data:
      marketMetadata.market_type === MarketType.vault.id &&
      offerType === RoycoMarketOfferType.limit.id
        ? marketActionForm
            .watch("incentive_tokens")
            .map((incentive) => {
              const total_supply = parseFloat(incentive.total_supply ?? "0");
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
    offer_type: offerType,

    account: address,

    quantity: parseRawAmount(marketActionForm.watch("quantity")?.raw_amount),
    funding_vault:
      userType === MarketUserType.ap.id &&
      fundingType === MarketFundingType.wallet.id
        ? NULL_ADDRESS
        : marketActionForm.watch("funding_vault"),

    token_ids: marketActionForm
      .watch("incentive_tokens")
      .map((token) => token.id),
    token_amounts: marketActionForm.watch("incentive_tokens").map((token) => {
      return parseRawAmount(token.raw_amount);
    }),

    expiry: marketActionForm.watch("no_expiry")
      ? "0"
      : Math.floor(
          (marketActionForm.watch("expiry") || new Date(0)).getTime() / 1000
        ).toString(),

    token_rates: marketActionForm
      .watch("incentive_tokens")
      .map((incentiveData) => {
        try {
          const distribution = parseFloat(incentiveData.distribution ?? "0");

          const distributionInWei = BigNumber.from(
            parseTokenAmountToRawAmount(
              distribution.toString(),
              incentiveData.decimals
            )
          )
            .mul(BigNumber.from(10).pow(incentiveData.decimals))
            .div(
              BigNumber.from(10).pow(
                currentMarketData?.input_token_data.decimals ?? 0
              )
            )
            .div(365 * 24 * 60 * 60);

          const rateInWei = distributionInWei.toString();

          return rateInWei === "" ? "0" : rateInWei;
        } catch (error) {
          return "0";
        }
      }),

    custom_token_data:
      marketMetadata.market_type === MarketType.vault.id &&
      offerType === RoycoMarketOfferType.limit.id
        ? marketActionForm
            .watch("incentive_tokens")
            .map((incentive) => {
              const total_supply = parseFloat(incentive.total_supply ?? "0");
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

    start_timestamps: marketActionForm
      .watch("incentive_tokens")
      .map((incentive) =>
        Math.floor(
          new Date(incentive.start_timestamp ?? 0).getTime() / 1000
        ).toString()
      ),

    end_timestamps: marketActionForm
      .watch("incentive_tokens")
      .map((incentive) => {
        let endTimestamp = Math.floor(
          new Date(incentive.end_timestamp ?? 0).getTime() / 1000
        ).toString();

        /**
         * @note Below is the code for the increase action, which is merged with the extend action for now
         */
        // if (
        //   vaultIncentiveActionType === MarketVaultIncentiveAction.increase.id
        // ) {
        //   const existingRewardIndex =
        //     currentMarketData?.base_incentive_ids?.findIndex(
        //       (reward) => reward === incentive.id
        //     ) ?? -1;

        //   if (existingRewardIndex !== -1) {
        //     endTimestamp =
        //       currentMarketData?.base_end_timestamps?.[existingRewardIndex] ??
        //       "0";
        //   } else {
        //     endTimestamp = "0";
        //   }

        //   endTimestamp = BigNumber.from(parseRawAmount(endTimestamp))
        //     .add(1)
        //     .toString();
        // }

        return endTimestamp;
      }),

    vault_incentive_action: vaultIncentiveActionType,
    offer_validation_url: `/api/validate`,
    frontend_fee_recipient: process.env.NEXT_PUBLIC_FRONTEND_FEE_RECIPIENT,
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
};
