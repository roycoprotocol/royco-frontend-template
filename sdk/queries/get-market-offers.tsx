import { type TypedRoycoClient } from "@/sdk/client";
import { Database } from "../types";

// export type MarketOffersDataType = Database["public"]["CompositeTypes"][""]

export const getMarketOffersQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_type: number,
  market_id: string,
  offer_side: number,
  quantity: string
) => ({
  queryKey: [
    "get-market-offers-recipe",
    chain_id,
    market_id,
    offer_side,
    quantity,
  ],
  queryFn: async () => {
    const result = await client.rpc("get_market_offers", {
      in_chain_id: chain_id,
      in_market_type: market_type,
      in_market_id: market_id,
      in_offer_side: offer_side,
      in_quantity: quantity,
    });

    return result.data;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  // refetchInterval: 1000 * 60 * 1, // 1 min
  // refetchInterval: 1000 * 10 * 1, // 10 seconds
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
