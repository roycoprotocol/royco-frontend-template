import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import { api } from "@/app/api/royco";
import { atom } from "jotai";
import {
  EnrichedMarketV2,
  MarketControllerGetMarketData,
  V2PositionResponse,
} from "royco/api";
import { accountAddressAtom } from "../global";

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

export const loadableCampaignMarketPositionAtom =
  atomWithQuery<V2PositionResponse>((get) => ({
    queryKey: [
      "market-position",
      { address: get(accountAddressAtom), marketId: get(enrichedMarketIdAtom) },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const _params = params as any;

      const body: any = {};
      if (_params.marketId) {
        body.filters = [
          {
            id: "rawMarketRefId",
            value: _params.marketId,
          },
        ];
      }

      const response = await api.positionControllerGetV2Positions(
        _params.address as string,
        body
      );

      return response.data;
    },
    enabled: !!get(accountAddressAtom),
  }));
