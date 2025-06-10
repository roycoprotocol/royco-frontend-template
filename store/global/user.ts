import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { UserInfo, WalletInfo } from "royco/api";
import { api } from "@/app/api/royco";
import { defaultQueryOptions } from "@/utils/query";
import { isAuthenticatedAtom } from "./auth";

export const userInfoAtom = atom<UserInfo | null>(null);

export const loadableUserInfoAtom = atomWithQuery<UserInfo>((get) => ({
  queryKey: ["userInfo"],
  queryFn: async () => {
    return api.userControllerGetUserInfo().then((res) => res.data);
  },
  ...defaultQueryOptions,
  enabled: Boolean(get(isAuthenticatedAtom)),
}));

export const isEmailEditorOpenAtom = atom<boolean>(false);
export const isWalletEditorOpenAtom = atom<boolean>(false);

export const linkWalletAtom = atom<boolean | undefined>(undefined);
export const selectedWalletAtom = atom<WalletInfo | undefined>(undefined);
