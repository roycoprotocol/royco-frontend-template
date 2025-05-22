import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import {
  accountAddressAtom,
  customTokenDataAtom,
  lastRefreshTimestampAtom,
} from "../global";
import {
  SpecificBoycoPositionResponse,
  BoycoPositionResponse,
} from "royco/api";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";
import { atom } from "jotai";

export const loadableSpecificBoycoPositionAtom =
  atomWithQuery<SpecificBoycoPositionResponse>((get) => ({
    queryKey: [
      "specific-boyco-position",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedMarketId = get(enrichedMarketIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedMarketId) throw new Error("Enriched market ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      return api
        .positionControllerGetSpecificBoycoPosition(
          enrichedMarketId,
          accountAddress,
          {
            customTokenData,
          }
        )
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(get(enrichedMarketIdAtom)?.split("_")[1] === "0"),
  }));

export const boycoPositionsPageIndexAtom = atom(1);
export const loadableBoycoPositionsAtom = atomWithQuery<BoycoPositionResponse>(
  (get) => ({
    queryKey: [
      "boyco-positions",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(boycoPositionsPageIndexAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedMarketId = get(enrichedMarketIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedMarketId) throw new Error("Enriched market ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      return api
        .positionControllerGetBoycoPositions({
          filters: [
            {
              id: "rawMarketRefId",
              value: enrichedMarketId,
            },
            {
              id: "accountAddress",
              value: accountAddress,
            },
          ],
          page: {
            index: get(boycoPositionsPageIndexAtom),
            size: 20,
          },
          customTokenData,
          sorting: [
            {
              id: "blockTimestamp",
              desc: false,
            },
          ],
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(get(enrichedMarketIdAtom)?.split("_")[1] === "0"),
  })
);
