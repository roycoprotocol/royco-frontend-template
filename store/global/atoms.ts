import { atom } from "jotai";
import { type CustomTokenDataElement as BaseCustomTokenDataElement } from "royco/api";

// export const accountAddressAtom = atom<string | undefined>(undefined);
export const accountAddressAtom = atom<string | undefined>(
  "0x77777Cc68b333a2256B436D675E8D257699Aa667"
);

export type CustomTokenDataElement = BaseCustomTokenDataElement & {
  allocation?: number;
};

export const customTokenDataAtom = atom<CustomTokenDataElement[]>([]);

export const lastRefreshTimestampAtom = atom<number>(Date.now());
