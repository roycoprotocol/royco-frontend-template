import { atom } from "jotai";

export const frontendAtom = atom(() => {
  return process.env.NEXT_PUBLIC_FRONTEND_TAG;
});

export const protectorAtom = atom((get) => {
  const tag = get(frontendAtom);

  if (tag === "internal" || tag === "testnet" || tag === "plume") {
    return true;
  }

  return false;
});
