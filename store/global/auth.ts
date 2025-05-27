import { atom } from "jotai";
import { accountAddressAtom } from "./atoms";
import { atomWithStorage } from "jotai/utils";

export const sessionTokenAtom = atomWithStorage<string | null>(
  "sessionToken",
  null
);

export const authenticationStatusAtom = atom<
  "unauthenticated" | "authenticated" | "loading"
>((get) => {
  const sessionToken = get(sessionTokenAtom);
  const accountAddress = get(accountAddressAtom);

  if (!sessionToken || !accountAddress) {
    // if (!accountAddress) {
    return "unauthenticated";
  }

  return "authenticated";
});
