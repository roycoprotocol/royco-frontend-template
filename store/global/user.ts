import { atom, useSetAtom } from "jotai";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { EditUserBody, UserInfo } from "royco/api";
import { api } from "@/app/api/royco";
import { sessionAtom } from "./auth";
import { defaultQueryOptions } from "@/utils/query";
import { AxiosError } from "axios";

export const userInfoAtom = atom<UserInfo | null>(null);

export const loadableUserInfoAtom = atomWithQuery<UserInfo>((get) => ({
  queryKey: ["userInfo"],
  queryFn: async () => {
    const session = get(sessionAtom);
    if (!session) throw new Error("No session found");

    const response = await api.userControllerGetUserInfo();

    return response.data;
  },
  ...defaultQueryOptions,
}));
