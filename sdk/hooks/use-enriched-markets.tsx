import { useQuery } from "@tanstack/react-query";
import {
  EnrichedMarketDataType,
  getEnrichedMarketsQueryOptions,
  MarketFilter,
} from "../queries";
import { RoycoClient, useRoycoClient } from "../client";
import { BaseSortingFilter } from "../types";

export const useEnrichedMarkets = ({
  chain_id,
  market_type,
  market_id,
  page_index = 0,
  filters = [],
  sorting = [],
  search_key,
  enabled = true,
}: {
  chain_id?: number;
  market_type?: number;
  market_id?: string;
  creator?: string;
  page_index?: number;
  filters?: Array<MarketFilter>;
  sorting?: Array<BaseSortingFilter>;
  search_key?: string;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  const props = useQuery({
    ...getEnrichedMarketsQueryOptions(
      client,
      chain_id,
      market_type,
      market_id,
      page_index,
      filters,
      sorting,
      search_key
    ),
    enabled,
  });

  const data = !!props.data
    ? // @ts-ignore
      (props.data.data as Array<EnrichedMarketDataType>)
    : null;
  const count = !!props.data ? props.data.count ?? 0 : 0;

  return {
    ...props,
    data,
    count,
  };
};
