import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { connectedWalletsAtom } from "../global";
import { defaultQueryOptions } from "@/utils/query";

export const royaltyUsernameAtom = atom<string>("");
export const royaltyEmailAtom = atom<string>("");

export const lodableExpectedRankAtom = atomWithQuery((get) => ({
  queryKey: [
    "expected-rank",
    {
      balanceUsd: get(connectedWalletsAtom).reduce((acc, curr) => {
        return acc + curr.balanceUsd;
      }, 0),
    },
  ],
  queryFn: async () => {
    const connectedWallets = get(connectedWalletsAtom);

    const balanceUsd = connectedWallets.reduce((acc, curr) => {
      return acc + curr.balanceUsd;
    }, 0);

    return api
      .userControllerGetExpectedRank({
        balanceUsd,
      })
      .then((res) => res.data);
  },
}));
