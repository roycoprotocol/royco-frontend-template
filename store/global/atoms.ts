import { atom } from "jotai";
import { type CustomTokenDataElement as BaseCustomTokenDataElement } from "royco/api";

// export const accountAddressAtom = atom<string | undefined>(undefined);
export const accountAddressAtom = atom<string | undefined>();

export type CustomTokenDataElement = BaseCustomTokenDataElement & {
  allocation?: number;
};

export const customTokenDataAtom = atom<CustomTokenDataElement[]>([]);

export const lastRefreshTimestampAtom = atom<number>(Date.now());
