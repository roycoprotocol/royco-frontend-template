import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "./market-action-form-schema";
import {
  MarketFundingType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { RoycoMarketOfferType } from "royco/market";
import { parseRawAmount, parseTokenAmountToRawAmount } from "royco/utils";
import { NULL_ADDRESS } from "royco/constants";
import { usePrepareMarketActionApi } from "../../hooks/use-prepare-market-action-api";
import { useAtom } from "jotai";
import { customTokenDataAtom } from "@/store/global";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";

export const useMarketFormDetailsApi = (
  marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>
) => {
  const { userType, offerType, vaultIncentiveActionType, fundingType } =
    useMarketManager();

  const [customTokenData, setCustomTokenData] = useAtom(customTokenDataAtom);

  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  return usePrepareMarketActionApi({
    market_type:
      enrichedMarket?.marketType === 0
        ? MarketType.recipe.id
        : MarketType.vault.id,
    user_type: userType,
    offer_type: offerType,

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

    expiry:
      enrichedMarket?.category === "boyco"
        ? "1738540800"
        : marketActionForm.watch("no_expiry")
          ? "0"
          : Math.floor(
              (marketActionForm.watch("expiry") || new Date(0)).getTime() / 1000
            ).toString(),

    token_rates: marketActionForm
      .watch("incentive_tokens")
      .map((incentiveData) => {
        try {
          // Distribution is incentive token per year
          const distribution = parseFloat(incentiveData.distribution ?? "0");

          const distributionInWei =
            (BigInt(
              parseTokenAmountToRawAmount(
                distribution.toString(),
                incentiveData.decimals
              )
            ) *
              BigInt(10) ** BigInt(18) * // Scale up to 18 decimals
              BigInt(10) ** BigInt(incentiveData.decimals)) / // Multiply by incentive token decimals
            BigInt(10) ** BigInt(enrichedMarket?.inputToken.decimals ?? 0) / // Divide by input token decimals
            BigInt(365 * 24 * 60 * 60); // Divide by seconds in a year

          const rateInWei = distributionInWei.toString();

          return rateInWei === "" ? "0" : rateInWei;
        } catch (error) {
          return "0";
        }
      }),

    customTokenData:
      enrichedMarket?.marketType === MarketType.vault.value &&
      offerType === RoycoMarketOfferType.limit.id
        ? marketActionForm
            .watch("incentive_tokens")
            .map((incentive) => {
              const totalSupply = parseFloat(incentive.total_supply ?? "0");
              const fdv = parseFloat(incentive.fdv ?? "0");
              const price = fdv / totalSupply;

              return {
                id: incentive.id,
                ...(isFinite(price) && { price }),
                ...(isFinite(totalSupply) && { totalSupply }),
                ...(isFinite(fdv) && { fdv }),
              };
            })
            .filter(
              (
                data
              ): data is {
                id: string;
                price?: number;
                totalSupply?: number;
                fdv?: number;
              } => Object.keys(data).length > 1
            )
        : customTokenData,

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
    incentive_asset_ids: marketActionForm
      .watch("incentive_assets")
      ?.map((incentive) => incentive.id),
  });
};
