import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { EnrichedMarketV2, MarketControllerGetMarketData } from "royco/api";

export const loadableMarketMetadataAtom =
  atomWithQuery<MarketControllerGetMarketData>((get) => ({
    queryKey: ["market-metadata", get(enrichedMarketIdAtom)],
    queryFn: async ({ queryKey: [, params] }) => {
      const marketId = get(enrichedMarketIdAtom);

      const response = await api.marketControllerGetMarket(marketId as string);
      return response.data;
    },
    enabled: !!get(enrichedMarketIdAtom),
  }));

export const marketMetadataAtom = atom<{ data: EnrichedMarketV2 }>(
  // @ts-ignore
  (get) => {
    const { data } = get(loadableMarketMetadataAtom);
    return { data };
  }
);
