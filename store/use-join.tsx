"use client";

import { create } from "zustand";

interface JoinState {
  openRoyaltyForm: boolean;
  setOpenRoyaltyForm: (openRoyaltyForm: boolean) => void;
  proofPending: boolean;
  setProofPending: (proofPending: boolean) => void;
  isLoadingProof: boolean;
  setIsLoadingProof: (isLoadingProof: boolean) => void;
  step: "info" | "otp" | "success";
  setStep: (step: "info" | "otp" | "success") => void;
  signedMessage: string | null;
  setSignedMessage: (signedMessage: string | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useJoin = create<JoinState>((set) => ({
  openRoyaltyForm: false,
  setOpenRoyaltyForm: (openRoyaltyForm: boolean) => set({ openRoyaltyForm }),
  proofPending: false,
  setProofPending: (proofPending: boolean) => set({ proofPending }),
  isLoadingProof: false,
  setIsLoadingProof: (isLoadingProof: boolean) => set({ isLoadingProof }),
  step: "info",
  setStep: (step: "info" | "otp" | "success") => set({ step }),
  signedMessage: null,
  setSignedMessage: (signedMessage: string | null) => set({ signedMessage }),
  token: null,
  setToken: (token: string | null) => set({ token }),
}));
