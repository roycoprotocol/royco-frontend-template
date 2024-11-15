import { useQuery } from "@tanstack/react-query";
import { RoycoClient, useRoycoClient } from "../client";
import { useEnrichedPositionsRecipe } from "./use-enriched-positions-recipe";
import { useEnrichedPositionsVault } from "./use-enriched-positions-vault";
import { BaseQueryFilter, BaseSortingFilter, CustomTokenData } from "../types";
import { useEnrichedMarkets } from "./use-enriched-markets";
import {
  getEnrichedAccountBalancesVaultInMarketQueryOptions,
  MarketFilter,
} from "../queries";

export const useEnrichedPositions = ({
  account_address,
  page_index = 0,
  filters = [],
  sorting,
  enabled = true,
  options = {
    market: { page_index: 0, filters: [], sorting: [], enabled: true },
  },
}: {
  account_address: string;
  page_index?: number;
  filters?: Array<BaseQueryFilter>;
  sorting?: Array<BaseSortingFilter>;
  enabled?: boolean;
  options?: {
    market: {
      chain_id?: number;
      market_type?: number;
      market_id?: string;
      creator?: string;
      page_index?: number;
      filters?: Array<MarketFilter>;
      sorting?: Array<BaseSortingFilter>;
      search_key?: string;
      is_verified?: boolean;
      custom_token_data?: CustomTokenData;
      enabled?: boolean;
    };
  };
}) => {
  const client: RoycoClient = useRoycoClient();

  const propsEnrichedMarkets = useEnrichedMarkets(options.market);
  const markets = propsEnrichedMarkets.data || [];

  // No markets found
  if (markets.length === 0) {
    return {
      data: [],
      isLoading: false,
      isRefetching: false,
      isError: false,
      isSuccess: true,
    };
  }

  const data: any[] = [];
  const isLoading = false;
  const isRefetching = false;
  const isError = false;
  const isSuccess = true;

  const recipeMarkets = markets.filter((market) => market.market_type === 0);
  const vaultMarkets = markets.filter((market) => market.market_type === 1);

  console.log({ recipeMarkets, vaultMarkets });

  //   const recipeQueries = recipeMarkets.map((market) =>
  //     useEnrichedPositionsRecipe({
  //       account_address,
  //       chain_id: market.chain_id,
  //       market_id: market.market_id,
  //       page_index,
  //       filters,
  //       sorting,
  //       enabled: enabled && !propsEnrichedMarkets.isLoading,
  //     })
  //   );

  // Vault position queries
  const vaultQueries = vaultMarkets.map((market) =>
    getEnrichedAccountBalancesVaultInMarketQueryOptions(
      useRoycoClient(),
      market.chain_id as number,
      market.market_id as string,
      account_address,
      options.market.custom_token_data
    )
  );

  //   // Combine data from all queries
  //   if (!propsEnrichedMarkets.isLoading) {
  //     // Add recipe positions
  //     recipeQueries.forEach((query) => {
  //       if (query.data) {
  //         data.push(...query.data);
  //       }
  //     });

  //     // Add vault positions
  //     vaultQueries.forEach((query) => {
  //       if (query.data) {
  //         data.push(...query.data);
  //       }
  //     });
  //   }

  //   // Create an array of queries for each market
  //   const recipeQueries = markets.map((market) =>
  //     useEnrichedPositionsRecipe({
  //       account_address,
  //       chain_id: market.chain_id,
  //       market_id: market.market_id,
  //       page_index,
  //       filters,
  //       sorting,
  //       enabled: enabled && !propsEnrichedMarkets.isLoading,
  //     })
  //   );

  //   const vaultQueries = markets.map((market) =>
  //     useEnrichedPositionsVault({
  //       account_address,
  //       chain_id: market.chain_id,
  //       market_id: market.market_id,
  //       enabled: enabled && !propsEnrichedMarkets.isLoading,
  //     })
  //   );

  //   const data: any[] = [];

  //   const isLoading =
  //     propsEnrichedMarkets.isLoading ||
  //     recipeQueries.some((q) => q.isLoading) ||
  //     vaultQueries.some((q) => q.isLoading);

  //   const isRefetching =
  //     propsEnrichedMarkets.isRefetching ||
  //     recipeQueries.some((q) => q.isRefetching) ||
  //     vaultQueries.some((q) => q.isRefetching);

  //   const isError =
  //     propsEnrichedMarkets.isError ||
  //     recipeQueries.some((q) => q.isError) ||
  //     vaultQueries.some((q) => q.isError);

  //   const isSuccess =
  //     propsEnrichedMarkets.isSuccess &&
  //     recipeQueries.every((q) => q.isSuccess) &&
  //     vaultQueries.every((q) => q.isSuccess);

  //   if (!isLoading) {
  //     // Combine all recipe positions
  //     recipeQueries.forEach((query) => {
  //       if (query.data) {
  //         data.push(...query.data);
  //       }
  //     });

  //     // Combine all vault positions
  //     vaultQueries.forEach((query) => {
  //       if (query.data) {
  //         data.push(...query.data);
  //       }
  //     });
  //   }

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    isSuccess,
  };
};
