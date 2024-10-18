import { RoycoMarketType, TypedRoycoMarketType } from "../../market";
import { getSupportedToken, SupportedToken } from "../../constants";
import { ethers } from "ethers";
import { useTokenQuotes } from ".././use-token-quotes";
import { EnrichedMarketDataType } from "@/sdk/queries";

export const useIncentivesData = ({
  enabled,
  market_type,
  market,
  action_incentive_token_ids,
  action_incentive_token_amounts,
  propsTokenQuotes,
  quantity,
}: {
  enabled: boolean;
  market_type: TypedRoycoMarketType;
  market: EnrichedMarketDataType | null;
  action_incentive_token_ids: string[];
  action_incentive_token_amounts: string[];
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  quantity?: string;
}) => {
  let incentivesDataCalculated = false;

  let incentivesData: Array<
    SupportedToken & {
      raw_amount: string;
      token_amount: number;
      per_input_token: number;
      annual_change_ratio: number;
    }
  > = [];

  // Combine all incentives data
  if (enabled && !!market) {
    incentivesData = action_incentive_token_ids.map((id, index) => {
      const input_token_quote = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.id === market.input_token_id
      );
      const incentive_token_quote = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.id === id
      );

      const input_token_price = input_token_quote?.price || 0;
      const incentive_token_price = incentive_token_quote?.price || 0;

      const input_token_data = getSupportedToken(
        market.input_token_id as string
      );
      const input_token_raw_amount = quantity as string;
      const input_token_token_amount = parseFloat(
        ethers.utils.formatUnits(
          input_token_raw_amount,
          input_token_data.decimals
        )
      );
      const input_token_token_amount_usd =
        input_token_token_amount * input_token_price;

      const incentive_token_data = getSupportedToken(id);
      const incentive_token_raw_amount_without_fees =
        action_incentive_token_amounts[index];
      const incentive_token_raw_amount =
        incentive_token_raw_amount_without_fees;

      const incentive_token_token_amount = parseFloat(
        ethers.utils.formatUnits(
          incentive_token_raw_amount,
          incentive_token_data.decimals
        )
      );
      const incentive_token_token_amount_usd =
        incentive_token_token_amount * incentive_token_price;

      const per_input_token =
        incentive_token_token_amount / input_token_token_amount;

      let annual_change_ratio = 0;

      if (market_type === RoycoMarketType.recipe.id) {
        // handle annual change ratio for recipe market
        if (!market.lockup_time || market.lockup_time === "0") {
          annual_change_ratio = Math.pow(10, 18);
        } else {
          annual_change_ratio =
            (incentive_token_token_amount_usd / input_token_token_amount_usd) *
            ((365 * 24 * 60 * 60) / parseInt(market.lockup_time));
        }
      } else {
        // handle annual change ratio for vault market
        // this needs to be handled via smart contract call
      }

      return {
        ...incentive_token_data,
        raw_amount: incentive_token_raw_amount,
        token_amount: incentive_token_token_amount,
        per_input_token,
        annual_change_ratio,
      };
    });

    incentivesDataCalculated = true;
  }

  return {
    incentivesData,
    incentivesDataCalculated,
  };
};
