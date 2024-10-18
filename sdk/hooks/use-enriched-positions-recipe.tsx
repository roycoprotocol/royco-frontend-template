import { useQuery } from "@tanstack/react-query";
import {
  getTokenQuotesQueryOptions,
  getHighestOffersRecipeQueryOptions,
  getEnrichedOffersQueryOptions,
} from "../queries";
import { RoycoClient, useRoycoClient } from "../client";
import { getSupportedToken, SupportedToken } from "../constants";
import { getEnrichedPositionsRecipeQueryOptions } from "../queries/get-enriched-positions-recipe";
import { BaseQueryFilter } from "../types";

export const useEnrichedPositionsRecipe = ({
  chain_id,
  market_id,
  account_address,
  page_index = 0,
  filters = [],
  enabled = true,
}: {
  chain_id: number;
  market_id: string;
  account_address: string;
  page_index?: number;
  enabled?: boolean;
  filters?: Array<BaseQueryFilter>;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedPositionsRecipeQueryOptions(
      client,
      chain_id,
      market_id,
      account_address,
      page_index,
      filters
    ),
    enabled,
  });
};
