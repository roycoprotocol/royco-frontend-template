import { atomWithQuery } from "jotai-tanstack-query";
import { api } from "@/app/api/royco";
import { atom } from "jotai";
import {
  EnrichedMarket,
  EnrichedMarketV2,
  V2PositionResponse,
} from "royco/api";
import { accountAddressAtom } from "../global";
import { atomWithLocation } from "jotai-location";
import { defaultQueryOptions } from "@/utils/query";

// Market ID
const locationAtom = atomWithLocation();
export const marketIdAtom = atom((get) => {
  const location = get(locationAtom);
  const segments = (location.pathname || "").split("/").filter(Boolean);

  // market url: /market/[chain_id]/[market_type]/[market_id]
  if (segments.length >= 4 && segments[0] === "market") {
    const chainId = segments[1];
    const marketType = segments[2];
    const marketId = segments[3];

    return `${chainId}_${marketType}_${marketId}`;
  }

  return null;
});

// Market Metadata
export const loadableMarketMetadataAtom = atomWithQuery<
  EnrichedMarket | EnrichedMarketV2
>((get) => ({
  queryKey: ["market-metadata", { marketId: get(marketIdAtom) }],
  queryFn: async ({ queryKey: [, params] }) => {
    const _params = params as any;

    const response = await api.marketControllerGetMarket(_params.marketId);
    return response.data;
  },
  enabled: !!get(marketIdAtom),
  ...defaultQueryOptions,
}));

export const marketMetadataAtom = atom<{
  data: EnrichedMarket | EnrichedMarketV2;
}>(
  // @ts-ignore
  (get) => {
    const { data } = get(loadableMarketMetadataAtom);
    return { data };
  }
);

// Market Positions
export const loadableCampaignMarketPositionAtom =
  atomWithQuery<V2PositionResponse>((get) => ({
    queryKey: [
      "market-position",
      { address: get(accountAddressAtom), marketId: get(marketIdAtom) },
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
    enabled: !!get(accountAddressAtom) && !!get(marketIdAtom),
    ...defaultQueryOptions,
  }));
