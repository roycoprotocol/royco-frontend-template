import { type TypedRoycoClient } from "@/sdk/client";

export const getMarketOffersQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_type: number,
  market_id: string,
  offer_side: number,
  quantity: string,
  incentive_ids?: string[]
) => ({
  queryKey: [
    "get-market-offers",
    chain_id,
    market_type,
    market_id,
    offer_side,
    quantity,
    incentive_ids?.join(","),
  ],
  queryFn: async () => {
    const result = await client.rpc("get_market_offers", {
      in_chain_id: chain_id,
      in_market_type: market_type,
      in_market_id: market_id,
      in_offer_side: offer_side,
      in_quantity: quantity,
      in_incentive_ids: incentive_ids,
    });

    return result.data;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
