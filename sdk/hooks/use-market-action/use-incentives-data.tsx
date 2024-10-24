import {
  RoycoMarketOfferType,
  RoycoMarketType,
  RoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
  TypedRoycoMarketUserType,
} from "../../market";
import { getSupportedToken, SupportedToken } from "../../constants";
import { BigNumber, ethers } from "ethers";
import { useTokenQuotes } from ".././use-token-quotes";
import { EnrichedMarketDataType } from "@/sdk/queries";

export const useIncentivesData = ({
  enabled,
  market_type,
  offer_type,
  user_type,
  market,
  action_incentive_token_ids,
  action_incentive_token_amounts,
  propsTokenQuotes,
  quantity,
  custom_incentive_data,
}: {
  enabled: boolean;
  market_type: TypedRoycoMarketType;
  offer_type: TypedRoycoMarketOfferType;
  user_type: TypedRoycoMarketUserType;
  market: EnrichedMarketDataType | null;
  action_incentive_token_ids: string[];
  action_incentive_token_amounts: string[];
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  quantity?: string;
  custom_incentive_data?: Array<
    SupportedToken & {
      aip: number;
      fdv: number;
      distribution: number;
      offerAmount: number;
      inputTokenPrice: number;
      incentiveTokenPrice: number;
      rate: number;
      rateInWei: string;
    }
  >;
}) => {
  let incentivesDataCalculated = false;

  let incentivesData: Array<
    SupportedToken & {
      raw_amount: string;
      token_amount: number;
      per_input_token: number;
      annual_change_ratio: number;
      token_amount_usd: number;
      total_supply: number;
      fdv: number;
    }
  > = [];

  // Combine all incentives data
  if (enabled && !!market) {
    incentivesData = action_incentive_token_ids.map((id, index) => {
      // Get input token quote
      const input_token_quote = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.id === market.input_token_id
      );

      // Get incentive token quote
      const incentive_token_quote = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.id === id
      );

      // Get input token price
      const input_token_price = input_token_quote?.price || 0;

      // Get input token data
      const input_token_data = getSupportedToken(
        market.input_token_id as string
      );

      // Get input token raw amount
      // const input_token_raw_amount = (quantity ?? "0") as string;
      let input_token_raw_amount = "0";

      if (market_type === RoycoMarketType.recipe.id) {
        input_token_raw_amount = (quantity ?? "0") as string;
      } else if (!!market && !!market.end_timestamps) {
        // @note: in vault markets
        if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ap.id
        ) {
          input_token_raw_amount = BigNumber.from(quantity ?? "0")
            .div(365 * 24 * 60 * 60)
            .toString();
        } else {
          input_token_raw_amount = (quantity ?? "0") as string;
        }
      }

      // Get input token token amount
      const input_token_token_amount = parseFloat(
        ethers.utils.formatUnits(
          input_token_raw_amount,
          input_token_data.decimals
        )
      );

      // Get input token token amount in USD
      const input_token_token_amount_usd =
        input_token_token_amount * input_token_price;

      // Get incentive token price
      let incentive_token_price = 0;

      if (market_type === RoycoMarketType.recipe.id) {
        incentive_token_price = incentive_token_quote?.price || 0;
      } else if (market_type === RoycoMarketType.vault.id) {
        if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ap.id
        ) {
          incentive_token_price =
            custom_incentive_data?.[index]?.incentiveTokenPrice ?? 0;
        } else {
          incentive_token_price = incentive_token_quote?.price || 0;
        }
      }

      // Get incentive token data
      const incentive_token_data = getSupportedToken(id);

      // Get incentive token raw amount
      let incentive_token_raw_amount = "0";

      if (market_type === RoycoMarketType.recipe.id) {
        incentive_token_raw_amount = action_incentive_token_amounts[index];
      } else if (!!market && !!market.end_timestamps) {
        // handle vault market
        // @note: in vault markets, the incentive token amount is the rate in wei per second
        if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ap.id
        ) {
          incentive_token_raw_amount =
            custom_incentive_data?.[index]?.rateInWei ?? "0";
        } else if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ip.id
        ) {
          incentive_token_raw_amount = action_incentive_token_amounts[index];
        } else {
          const end_time = market.end_timestamps[index] ?? "0";
          const current_time = Math.floor(Date.now() / 1000);
          const time_left: BigNumber =
            BigNumber.from(end_time).sub(current_time);

          incentive_token_raw_amount = BigNumber.from(
            action_incentive_token_amounts[index] // this is rate in wei per second (scaled up by 10^18)
          )
            .mul(time_left)
            .toString();
        }
      }

      // Get incentive token token amount
      const incentive_token_token_amount = parseFloat(
        ethers.utils.formatUnits(
          incentive_token_raw_amount,
          incentive_token_data.decimals
        )
      );

      // Get incentive token token amount in USD
      const incentive_token_token_amount_usd =
        incentive_token_token_amount * incentive_token_price;

      // Get per input token
      const per_input_token =
        incentive_token_token_amount / input_token_token_amount;

      // Get annual change ratio
      let annual_change_ratio = 0;

      // handle recipe market
      if (market_type === RoycoMarketType.recipe.id) {
        if (!market.lockup_time || market.lockup_time === "0") {
          annual_change_ratio = Math.pow(10, 18);
        } else {
          annual_change_ratio =
            (incentive_token_token_amount_usd / input_token_token_amount_usd) *
            ((365 * 24 * 60 * 60) / parseInt(market.lockup_time));
        }
      }
      // handle vault market
      else if (!!market && !!market.end_timestamps) {
        if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ap.id
        ) {
          annual_change_ratio = custom_incentive_data?.[index]?.aip ?? 0;
        } else if (
          offer_type === RoycoMarketOfferType.limit.id &&
          user_type === RoycoMarketUserType.ip.id
        ) {
          annual_change_ratio = 0;
        } else {
          const end_time = market.end_timestamps[index] ?? "0";
          const current_time = Math.floor(Date.now() / 1000);
          let time_left: BigNumber = BigNumber.from(end_time).sub(current_time);

          annual_change_ratio =
            (incentive_token_token_amount_usd / input_token_token_amount_usd) *
            ((365 * 24 * 60 * 60) / time_left.toNumber());
        }
      }

      return {
        ...incentive_token_quote,
        ...incentive_token_data,
        raw_amount: incentive_token_raw_amount,
        token_amount: incentive_token_token_amount,
        token_amount_usd: incentive_token_token_amount_usd,
        per_input_token,
        annual_change_ratio,
        total_supply: incentive_token_quote?.total_supply ?? 0,
        fdv: incentive_token_quote?.fdv ?? 0,
      };
    });

    incentivesDataCalculated = true;
  }

  return {
    incentivesData,
    incentivesDataCalculated,
  };
};
