import { create } from "zustand";

interface ProtectorState {
  protectorKey: string;
  setProtectorKey: (protectorKey: string) => void;

  verified: boolean;
  setVerified: (verified: boolean) => void;
}

export const useProtector = create<ProtectorState>((set) => ({
  protectorKey: "" as string,
  setProtectorKey: (protectorKey: string) => set({ protectorKey }),

  verified: false as boolean,
  setVerified: (verified: boolean) => set({ verified }),
}));
