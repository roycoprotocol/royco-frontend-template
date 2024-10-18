import { type TypedRoycoClient } from "@/sdk/client";

import {
  getSupportedToken,
  isVerifiedMarket,
  SupportedChain,
  SupportedToken,
} from "../constants";
import { BigNumber, ethers } from "ethers";

import { BaseSortingFilter, Database } from "../types";
import { constructBaseSortingFilterClauses, getSupportedChain } from "../utils";
import { getChain } from "@/sdk/utils";

export type MarketFilter = {
  id: string;
  value: string | number | boolean;
  matches?: Array<string>;
  condition?: string;
};

const constructMarketFilterClauses = (
  filters: MarketFilter[] | undefined
): string | undefined => {
  if (!filters) return undefined;

  let assetFilter = "";
  let incentiveFilter = "";
  let chainIdFilter = "";
  let idFilter = "";
  let notFilter = "";

  filters.forEach((filter) => {
    switch (filter.id) {
      case "input_token_id":
        if (assetFilter) assetFilter += " OR ";
        if (filter.condition === "NOT") {
          notFilter += filter.matches
            ?.map((match) => `NOT input_token_id = '${match}'::text`)
            .join(" AND ");
        } else {
          assetFilter += filter.matches
            ?.map((match) => `input_token_id = '${match}'::text`)
            .join(" OR ");
        }

        break;
      case "incentive_ids":
        if (incentiveFilter) incentiveFilter += " OR ";
        if (filter.condition === "NOT") {
          notFilter += filter.matches
            ?.map((match) => `NOT incentive_ids @> ARRAY['${match}']::text[]`)
            .join(" AND ");
        } else {
          incentiveFilter += filter.matches
            ?.map((match) => `incentive_ids @> ARRAY['${match}']::text[]`)
            .join(" OR ");
        }

        break;
      case "chain_id":
        if (chainIdFilter) chainIdFilter += " OR ";
        if (filter.condition === "NOT") {
          notFilter += `chain_id <> ${filter.value}`;
        } else {
          chainIdFilter += `chain_id = ${filter.value}`;
        }
        break;
      case "id":
        if (idFilter) idFilter += " OR ";

        idFilter += `id = '${filter.value}'`;
        break;
    }
  });

  let filterClauses = "";

  if (assetFilter) filterClauses += `(${assetFilter}) AND `;
  if (incentiveFilter) filterClauses += `(${incentiveFilter}) AND `;
  if (chainIdFilter) filterClauses += `(${chainIdFilter}) AND `;
  if (idFilter) filterClauses += `(${idFilter}) AND `;
  if (notFilter) filterClauses += `(${notFilter}) AND `;

  if (filterClauses) {
    filterClauses = filterClauses.slice(0, -5); // Remove the trailing " AND "
  }

  return filterClauses;
};

export type EnrichedMarketDataType =
  Database["public"]["CompositeTypes"]["enriched_market_data_type"] & {
    incentive_tokens_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
        price: number;
        fdv: number;
        total_supply: number;
        annual_change_ratio: number;
        per_input_token: number;
      }
    >;
    input_token_data: SupportedToken & {
      raw_amount: string;
      token_amount: number;
      token_amount_usd: number;
      locked_token_amount: number;
      locked_token_amount_usd: number;
      price: number;
      fdv: number;
      total_supply: number;
    };
    chain_data: SupportedChain;
    is_verified: boolean;
  };

export const getEnrichedMarketsQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number | undefined,
  market_type: number | undefined,
  market_id: string | undefined,
  page_index: number | undefined,
  filters: Array<MarketFilter> | undefined,
  sorting: Array<BaseSortingFilter> | undefined,
  search_key: string | undefined
) => ({
  queryKey: [
    "enriched-markets",
    `${chain_id}-${market_type}-${market_id}-${page_index}`,
    ...(filters || []).map((filter) => {
      return `${filter.id}-${filter.value}-${filter.condition}`;
    }),
    ...(sorting || []).map(
      (sort) => `${sort.id}-${sort.desc ? "desc" : "asc"}`
    ),
    search_key,
  ],
  queryFn: async () => {
    const filterClauses = constructMarketFilterClauses(filters);
    const sortingClauses = constructBaseSortingFilterClauses(sorting);

    const result = await client.rpc("get_enriched_markets", {
      in_chain_id: chain_id,
      in_market_type: market_type,
      in_market_id: market_id,
      in_token_data: undefined, // to be updated
      page_index: page_index,
      filters: filterClauses,
      sorting: sortingClauses,
      search_key: search_key,
    });

    if (!!result.data && !!result.data.data && result.data.data.length > 0) {
      const rows = result.data.data;

      const new_rows = rows.map((row) => {
        if (
          !!row.input_token_id &&
          !!row.incentive_ids &&
          !!row.incentive_token_price_values &&
          !!row.incentive_token_fdv_values &&
          !!row.incentive_token_total_supply_values &&
          !!row.chain_id &&
          !!row.annual_change_ratios
        ) {
          const chain_data = getSupportedChain(row.chain_id);

          const input_token_info: SupportedToken = getSupportedToken(
            row.input_token_id
          );
          const input_token_price: number = row.input_token_price ?? 0;
          const input_token_fdv: number = row.input_token_fdv ?? 0;
          const input_token_total_supply: number =
            row.input_token_total_supply ?? 0;
          const input_token_raw_amount: string = BigNumber.from(
            (row.quantity ?? 0).toLocaleString("fullwide", {
              useGrouping: false,
            })
          ).toString();
          const locked_input_token_raw_amount: string = BigNumber.from(
            (row.locked_quantity ?? 0).toLocaleString("fullwide", {
              useGrouping: false,
            })
          ).toString();

          const input_token_token_amount: number = parseFloat(
            ethers.utils.formatUnits(
              BigNumber.from(input_token_raw_amount),
              input_token_info.decimals
            )
          );
          const locked_input_token_token_amount: number = parseFloat(
            ethers.utils.formatUnits(
              BigNumber.from(locked_input_token_raw_amount),
              input_token_info.decimals
            )
          );

          const input_token_token_amount_usd =
            input_token_token_amount * input_token_price;
          const locked_input_token_token_amount_usd =
            input_token_token_amount * input_token_price;

          const input_token_data = {
            ...input_token_info,
            raw_amount: input_token_raw_amount,
            token_amount: input_token_token_amount,
            token_amount_usd: input_token_token_amount_usd,
            locked_token_amount: locked_input_token_token_amount,
            locked_token_amount_usd: locked_input_token_token_amount_usd,
            price: input_token_price,
            fdv: input_token_fdv,
            total_supply: input_token_total_supply,
          };

          const incentive_tokens_data = row.incentive_ids.map(
            (tokenId, tokenIndex) => {
              const token_price: number = row.incentive_token_price_values
                ? row.incentive_token_price_values[tokenIndex]
                : 0;
              const token_fdv: number = row.incentive_token_fdv_values
                ? row.incentive_token_fdv_values[tokenIndex]
                : 0;
              const token_total_supply: number =
                row.incentive_token_total_supply_values
                  ? row.incentive_token_total_supply_values[tokenIndex]
                  : 0;

              const token_info: SupportedToken = getSupportedToken(tokenId);

              const raw_amount: string = BigNumber.from(
                (row.incentive_amounts && row.incentive_amounts[tokenIndex]) ||
                  "0"
              ).toString();

              const token_amount: number = parseFloat(
                ethers.utils.formatUnits(
                  BigNumber.from(raw_amount),
                  token_info.decimals
                )
              );

              const token_amount_usd: number = token_amount * token_price;

              const annual_change_ratio: number =
                row.annual_change_ratios?.[tokenIndex] ?? 0;

              const per_input_token =
                token_amount / input_token_data.token_amount;

              return {
                ...token_info,
                raw_amount,
                token_amount,
                token_amount_usd,
                price: token_price,
                fdv: token_fdv,
                total_supply: token_total_supply,
                annual_change_ratio: annual_change_ratio,
                per_input_token: per_input_token,
              };
            }
          );

          const is_verified = isVerifiedMarket(row.id);

          return {
            ...row,
            incentive_tokens_data: incentive_tokens_data,
            input_token_data,
            chain_data,
            is_verified,
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
  staleTime: 1000 * 60 * 1, // 1 min
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
