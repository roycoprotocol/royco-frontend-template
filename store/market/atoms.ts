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

export const isCrossChainZapDisabled = (id: string | undefined) => {
  const markets = [
    "98866_0_0x8e86bb8fa7870b7a13f30852e935b3438ebc199653678760290936bbcdfc685b",
    "98866_0_0xa1d68accf80e16047bf8c609e9da79a7ad75576d7fec71f490d73ff1f7d1eee7",
    "98866_0_0xc942455121a6ede593f9895b113bd23ec68633c9232e7bc727871e078adf8011",
    "98866_0_0xa319c980c19e1843d5e5a03c955bf6fb40e8cd1355f75841cef2f0285029a136",
    "98866_0_0xfbb15004ce294c5976ab911dc4f35b3ce07b2809ea9cbfe60bafe5751d81fefb",
  ];
  if (id && markets.includes(id)) {
    return true;
  }
  return false;
};
