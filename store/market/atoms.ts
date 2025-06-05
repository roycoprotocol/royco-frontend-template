import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { type EnrichedMarket } from "royco/api";
import { atomWithLocation } from "jotai-location";
import { customTokenDataAtom, lastRefreshTimestampAtom } from "../global/atoms";
import { api } from "@/app/api/royco";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";

export const locationAtom = atomWithLocation();

export const enrichedMarketIdAtom = atom(
  (get) => {
    const location = get(locationAtom);
    const pathSegments = (location.pathname ?? "").split("/").filter(Boolean);

    // The URL pattern is /market/[chain_id]/[market_type]/[market_id]
    if (pathSegments.length >= 4 && pathSegments[0] === "market") {
      const chainId = pathSegments[1];
      const marketType = pathSegments[2];
      const marketId = pathSegments[3];
      return `${chainId}_${marketType}_${marketId}`;
    }

    return null;
  },
  (get, set, newValue: string | null) => {
    // No need to update URL since we're using path parameters
    // This is a read-only atom for the enrichedMarketId
  }
);

export const loadableEnrichedMarketAtom = atomWithQuery<EnrichedMarket>(
  (get) => ({
    queryKey: [
      "enriched-market",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        customTokenData: get(customTokenDataAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedMarketId = get(enrichedMarketIdAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedMarketId) throw new Error("Enriched market ID is not set");

      return api
        .marketControllerGetMarket(enrichedMarketId, {
          customTokenData,
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(get(enrichedMarketIdAtom)),
  })
);

export const userTypeAtom = atom<0 | 1>(0);

export const isTemptestFeeApplicable = (id: string | undefined) => {
  const markets = [
    "98866_0_0x40bb8b77686fdea111f3e5b369dacd049abb8224550b453b6308b1038638e355",
    "98866_0_0xb52a7b315f1f0a83c6cdec526a72198c9c09c9e25d7a145a3a4086f114fbb91c",
  ];
  if (id && markets.includes(id)) {
    return true;
  }
  return false;
};
