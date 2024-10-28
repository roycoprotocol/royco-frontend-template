import { type TypedRoycoClient } from "@/sdk/client";
import { getSupportedToken, SupportedToken } from "../constants";
import { BigNumber } from "ethers";
import { CustomTokenData } from "../types";
import {
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from "../utils";

export const getEnrichedAccountBalancesRecipeInMarketQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_id: string,
  account_address: string,
  custom_token_data?: CustomTokenData
) => ({
  queryKey: [
    "enriched-account-balance-recipe",
    chain_id,
    market_id,
    account_address,
    ...(custom_token_data || []).map(
      (token) =>
        `${token.token_id}-${token.price}-${token.fdv}-${token.total_supply}`
    ),
  ],
  queryFn: async () => {
    const result = await client.rpc(
      "get_enriched_account_balances_recipe_in_market",
      {
        in_chain_id: chain_id,
        in_market_id: market_id,
        in_account_address: account_address,
        custom_token_data,
      }
    );

    if (result.data && result.data.length > 0) {
      const rows = result.data;
      const row = rows[0];

      const incentives_ap_data = row.incentives_ids_ap.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = parseRawAmount(
            row.incentives_amount_ap[incentiveIndex]
          );

          const token_amount: number = parseRawAmountToTokenAmount(
            row.incentives_amount_ap[incentiveIndex],
            token_info.decimals
          );

          const token_amount_usd = parseTokenAmountToTokenAmountUsd(
            token_amount,
            row.incentives_price_values_ap[incentiveIndex]
          );

          return {
            ...token_info,
            raw_amount,
            token_amount,
            token_amount_usd,
          };
        }
      );

      const incentives_ip_data = row.incentives_ids_ip.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = parseRawAmount(
            row.incentives_amount_ip[incentiveIndex]
          );

          const token_amount: number = parseRawAmountToTokenAmount(
            row.incentives_amount_ip[incentiveIndex],
            token_info.decimals
          );

          const token_amount_usd = parseTokenAmountToTokenAmountUsd(
            token_amount,
            row.incentives_price_values_ip[incentiveIndex]
          );

          return {
            ...token_info,
            raw_amount,
            token_amount,
            token_amount_usd,
          };
        }
      );

      const input_token_info: SupportedToken = getSupportedToken(
        row.input_token_id
      );

      const input_token_data_ap = {
        ...input_token_info,
        raw_amount: row.quantity_ap,
        token_amount: parseRawAmountToTokenAmount(
          row.quantity_ap,
          input_token_info.decimals
        ),
        token_amount_usd: parseTokenAmountToTokenAmountUsd(
          parseRawAmountToTokenAmount(
            row.quantity_ap,
            input_token_info.decimals
          ),
          row.input_token_price
        ),
      };

      const input_token_data_ip = {
        ...input_token_info,
        raw_amount: row.quantity_ip,
        token_amount: parseRawAmountToTokenAmount(
          row.quantity_ip,
          input_token_info.decimals
        ),
        token_amount_usd: parseTokenAmountToTokenAmountUsd(
          parseRawAmountToTokenAmount(
            row.quantity_ip,
            input_token_info.decimals
          ),
          row.input_token_price
        ),
      };

      const balance_usd_ap = incentives_ap_data.reduce(
        (acc, cur) => acc + cur.token_amount_usd,
        0
      );

      const balance_usd_ip = input_token_data_ip.token_amount_usd;

      return {
        ...row,
        input_token_data_ap,
        input_token_data_ip,
        incentives_ap_data,
        incentives_ip_data,
        balance_usd_ap,
        balance_usd_ip,
      };
    }

    return null;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});