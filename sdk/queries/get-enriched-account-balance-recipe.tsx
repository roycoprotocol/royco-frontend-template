import { type TypedRoycoClient } from "@/sdk/client";
import { getSupportedToken, SupportedToken } from "../constants";
import { BigNumber } from "ethers";

export const getEnrichedAccountBalanceRecipeQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_id: string,
  account_address: string
) => ({
  queryKey: [
    "enriched-account-balance-recipe",
    chain_id,
    market_id,
    account_address,
  ],
  queryFn: async () => {
    const result = await client.rpc("get_enriched_account_balance_recipe", {
      in_chain_id: chain_id,
      in_market_id: market_id,
      in_account_address: account_address,
    });

    if (result.data && result.data.length > 0) {
      const rows = result.data;
      const row = rows[0];

      const incentives_given_data = row.incentives_given_ids.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = BigNumber.from(
            row.incentives_given_amount[incentiveIndex]
          ).toString();

          const token_amount: string = BigNumber.from(raw_amount)
            .div(BigNumber.from(10).pow(token_info.decimals))
            .toString();

          const token_amount_usd =
            row.incentives_given_amount_usd[incentiveIndex];

          return {
            ...token_info,
            raw_amount,
            token_amount,
            token_amount_usd,
          };
        }
      );

      const protocol_fee_data = row.incentives_given_ids.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = BigNumber.from(
            row.protocol_fee_amounts[incentiveIndex]
          ).toString();

          const token_amount: string = BigNumber.from(raw_amount)
            .div(BigNumber.from(10).pow(token_info.decimals))

            .toString();

          const token_amount_usd = row.protocol_fee_amounts[incentiveIndex];

          return {
            ...token_info,
            raw_amount,
            token_amount,
            token_amount_usd,
          };
        }
      );

      const frontend_fee_data = row.incentives_given_ids.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = BigNumber.from(
            row.frontend_fee_amounts[incentiveIndex]
          ).toString();

          const token_amount: string = BigNumber.from(raw_amount)
            .div(BigNumber.from(10).pow(token_info.decimals))
            .toString();

          const token_amount_usd = row.frontend_fee_amounts[incentiveIndex];

          return {
            ...token_info,
            raw_amount,
            token_amount,
            token_amount_usd,
          };
        }
      );

      const incentives_received_data = row.incentives_received_ids.map(
        (incentiveId, incentiveIndex) => {
          const token_info: SupportedToken = getSupportedToken(incentiveId);
          const raw_amount: string = BigNumber.from(
            row.incentives_received_amount[incentiveIndex]
          ).toString();

          const token_amount: string = BigNumber.from(raw_amount)
            .div(BigNumber.from(10).pow(token_info.decimals))
            .toString();

          const token_amount_usd =
            row.incentives_received_amount_usd[incentiveIndex];

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

      const input_token_data = {
        ...input_token_info,
        quantity_given_amount_raw: BigNumber.from(
          row.quantity_given_amount
        ).toString(),
        quantity_received_amount_raw: BigNumber.from(
          row.quantity_received_amount
        ).toString(),

        quantity_given_amount_token: BigNumber.from(row.quantity_given_amount)
          .div(BigNumber.from(10).pow(input_token_info.decimals))
          .toString(),
        quantity_received_amount_token: BigNumber.from(
          row.quantity_received_amount
        )
          .div(BigNumber.from(10).pow(input_token_info.decimals))

          .toString(),

        quantity_given_amount_token_usd: row.quantity_given_amount_usd,
        quantity_received_amount_token_usd: row.quantity_received_amount_usd,
      };

      const ap_balance_usd = row.incentives_received_amount_usd.reduce(
        (acc, cur) => acc + cur,
        0
      );
      const ip_balance_usd =
        row.incentives_given_amount_usd.reduce((acc, cur) => acc + cur, 0) +
        row.protocol_fee_amounts_usd.reduce((acc, cur) => acc + cur, 0) +
        row.frontend_fee_amounts_usd.reduce((acc, cur) => acc + cur, 0);

      return {
        ...row,
        input_token_data,
        incentives_given_data,
        incentives_received_data,
        protocol_fee_data,
        frontend_fee_data,
        ap_balance_usd,
        ip_balance_usd,
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
