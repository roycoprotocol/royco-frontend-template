import { atom } from "jotai";

export const safeOwnersAtom = atom<string[]>([""]);
export const safeThresholdAtom = atom<number>(1);
