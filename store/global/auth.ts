import { atom } from "jotai";
import { accountAddressAtom } from "./atoms";
import { atomWithStorage } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { defaultQueryOptions } from "@/utils/query";
import { api } from "@/app/api/royco";
import { SessionResponse } from "royco/api";

export const sessionAtom = atomWithStorage<SessionResponse | null>(
  "session",
  null
);

export const authenticationStatusAtom = atom((get) => {
  const session = get(sessionAtom);
  const accountAddress = get(accountAddressAtom);

  if (!session || !accountAddress) {
    return "unauthenticated";
  }

  if (session.walletAddress !== accountAddress.toLowerCase()) {
    return "unauthenticated";
  }

  return "authenticated";
});
