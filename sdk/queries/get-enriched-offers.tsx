import { type TypedRoycoClient } from "@/sdk/client";

import { getSupportedToken, SupportedToken } from "../constants";
import { BigNumber } from "ethers";

import { BaseQueryFilter, BaseSortingFilter, Database } from "../types";
import {
  constructBaseQueryFilterClauses,
  constructBaseSortingFilterClauses,
} from "../utils";

export type EnrichedOfferDataType =
  Database["public"]["CompositeTypes"]["enriched_offer_data_type"] & {
    tokens_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
        price: number;
        fdv: number;
        total_supply: number;
      }
    >;
    input_token_data: SupportedToken & {
      raw_amount: string;
      token_amount: number;
      token_amount_usd: number;
      price: number;
      fdv: number;
      total_supply: number;
    };
  };

export const getEnrichedOffersQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_type: number | undefined,
  market_id: string | undefined,
  creator: string | undefined,
  can_be_filled: boolean | undefined,
  page_index: number | undefined,
  filters: Array<BaseQueryFilter> | undefined,
  sorting: Array<BaseSortingFilter> | undefined
) => ({
  queryKey: [
    "enriched-offers",
    `${chain_id}-${market_type}-${market_id}-${creator}-${page_index}`,
    ...(filters || []).map((filter) => `${filter.id}-${filter.value}`),
    ...(sorting || []).map(
      (sort) => `${sort.id}-${sort.desc ? "desc" : "asc"}`
    ),
  ],
  queryFn: async () => {
    const filterClauses = constructBaseQueryFilterClauses(filters);
    const sortingClauses = constructBaseSortingFilterClauses(sorting);

    const result = await client.rpc("get_enriched_offers", {
      in_chain_id: chain_id,
      in_market_type: market_type,
      in_market_id: market_id,
      in_creator: creator,
      in_can_be_filled: can_be_filled,
      in_token_data: [],
      page_index: page_index,
      filters: filterClauses,
      sorting: sortingClauses,
    });

    if (!!result.data && !!result.data.data && result.data.data.length > 0) {
      const rows = result.data.data;

      const new_rows = rows.map((row) => {
        if (
          !!row.input_token_id &&
          !!row.token_ids &&
          !!row.token_amounts &&
          !!row.protocol_fee_amounts &&
          !!row.frontend_fee_amounts
        ) {
          const tokens_data = row.token_ids.map((tokenId, tokenIndex) => {
            const token_price: number = row.token_price_values
              ? row.token_price_values[tokenIndex]
              : 0;
            const token_fdv: number = row.token_fdv_values
              ? row.token_fdv_values[tokenIndex]
              : 0;
            const token_total_supply: number = row.token_total_supply_values
              ? row.token_total_supply_values[tokenIndex]
              : 0;

            const token_info: SupportedToken = getSupportedToken(tokenId);

            const raw_amount: string = BigNumber.from(
              (row.token_amounts &&
                row.token_amounts[tokenIndex]?.toLocaleString("fullwide", {
                  useGrouping: false,
                })) ||
                "0"
            ).toString();

            const token_amount: number = parseFloat(
              BigNumber.from(raw_amount)
                .div(BigNumber.from(10).pow(token_info.decimals))
                .toString()
            );

            const token_amount_usd = token_amount * token_price;

            return {
              ...token_info,
              raw_amount,
              token_amount,
              token_amount_usd,
              price: token_price,
              fdv: token_fdv,
              total_supply: token_total_supply,
            };
          });

          const input_token_info: SupportedToken = getSupportedToken(
            row.input_token_id
          );
          const input_token_price: number = row.input_token_price ?? 0;
          const input_token_fdv: number = row.input_token_fdv ?? 0;
          const input_token_total_supply: number =
            row.input_token_total_supply ?? 0;
          const input_token_raw_amount: string = BigNumber.from(
            (row.quantity_remaining ?? 0).toLocaleString("fullwide", {
              useGrouping: false,
            })
          ).toString();

          const input_token_token_amount: number = parseFloat(
            BigNumber.from(input_token_raw_amount)
              .div(BigNumber.from(10).pow(input_token_info.decimals))
              .toString()
          );

          const input_token_token_amount_usd =
            input_token_token_amount * input_token_price;

          const input_token_data = {
            ...input_token_info,
            raw_amount: input_token_raw_amount,
            token_amount: input_token_token_amount,
            token_amount_usd: input_token_token_amount_usd,
            price: input_token_price,
            fdv: input_token_fdv,
            total_supply: input_token_total_supply,
          };

          return {
            ...row,
            tokens_data,
            input_token_data,
          };
        }
      });

      return {
        count: result.data.count,
        data: new_rows,
      };
    }

    return result;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
