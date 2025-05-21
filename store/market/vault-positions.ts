import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import {
  accountAddressAtom,
  customTokenDataAtom,
  lastRefreshTimestampAtom,
} from "../global";
import {
  SpecificVaultPositionResponse,
  VaultPositionResponse,
} from "royco/api";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";
import { atom } from "jotai";

export const loadableSpecificVaultPositionAtom =
  atomWithQuery<SpecificVaultPositionResponse>((get) => ({
    queryKey: [
      "specific-vault-position",
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
        .positionControllerGetSpecificVaultPosition(
          enrichedMarketId,
          accountAddress,
          {
            customTokenData,
          }
        )
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(
      get(enrichedMarketIdAtom)?.split("_")[1] === "1" &&
        get(accountAddressAtom)
    ),
  }));

export const vaultPositionsPageIndexAtom = atom(1);
export const loadableVaultPositionsAtom = atomWithQuery<VaultPositionResponse>(
  (get) => ({
    queryKey: [
      "vault-positions",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(vaultPositionsPageIndexAtom),
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
        .positionControllerGetVaultPositions({
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
            index: get(vaultPositionsPageIndexAtom),
            size: 20,
          },
          customTokenData,
          sorting: [
            {
              id: "blockTimestamp",
              desc: true,
            },
          ],
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(
      get(enrichedMarketIdAtom)?.split("_")[1] === "1" &&
        get(accountAddressAtom)
    ),
  })
);
