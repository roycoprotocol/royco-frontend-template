import { atom } from "jotai";

export const tagAtom = atom(() => {
  return process.env.NEXT_PUBLIC_FRONTEND_TAG;
});

export const isTestnetAtom = atom((get) => {
  const tag = get(tagAtom);

  return tag === "testnet" || tag === "dev" || tag === "internal";
});

export const protectorAtom = atom((get) => {
  const tag = get(tagAtom);

  if (tag === "internal" || tag === "testnet" || tag === "plume") {
    return true;
  }

  return false;
});
