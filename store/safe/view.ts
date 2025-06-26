import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { EnrichedUserSafeInfo } from "royco/api";
import { accountAddressAtom } from "../global";
import { defaultQueryOptions } from "@/utils/query";

export const loadableEnrichedSafeUserInfoAtom = atomWithQuery<
  EnrichedUserSafeInfo | undefined
>((get) => ({
  queryKey: [
    "enriched-safe-user-info",
    {
      accountAddress: get(accountAddressAtom),
    },
  ],
  queryFn: async () => {
    const accountAddress = get(accountAddressAtom);

    if (!accountAddress) return undefined;

    return api
      .safeControllerGetEnrichedUserSafeInfo(accountAddress)
      .then((res) => res.data);
  },
  ...defaultQueryOptions,
}));
