"use client";

import { create } from "zustand";

interface JoinState {
  openRoyaltyForm: boolean;
  setOpenRoyaltyForm: (openRoyaltyForm: boolean) => void;
  proofPending: boolean;
  setProofPending: (proofPending: boolean) => void;
  isLoadingProof: boolean;
  setIsLoadingProof: (isLoadingProof: boolean) => void;
}

export const useJoin = create<JoinState>((set) => ({
  openRoyaltyForm: false,
  setOpenRoyaltyForm: (openRoyaltyForm: boolean) => set({ openRoyaltyForm }),
  proofPending: false,
  setProofPending: (proofPending: boolean) => set({ proofPending }),
  isLoadingProof: false,
  setIsLoadingProof: (isLoadingProof: boolean) => set({ isLoadingProof }),
}));
