import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Session } from "royco/api";

export const parentSessionAtom = atom<Session | null>(null);

export const sessionAtom = atomWithStorage<Session | null>(
  "session",
  null,
  undefined,
  {
    getOnInit: true,
  }
);

export const authenticationStatusAtom = atom<
  "unauthenticated" | "loading" | "authenticated"
>("unauthenticated");

export const isAuthEnabledAtom = atom(true);
