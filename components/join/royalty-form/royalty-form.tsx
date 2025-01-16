"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJoin } from "@/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoyaltyFormPopUp } from "./royalty-form-pop-up";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";

import Image from "next/image";
import { useUsername, useUserPosition } from "royco/hooks";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { produce } from "immer";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { useUserInfo } from "@/components/user/hooks";
import { useGlobalStates } from "@/store";
import { SignInButton } from "../sign-in-button/sign-in-button";
import { UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royality-form-schema";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import { OtpForm } from "../otp-form";

export const RoyaltyForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { openRoyaltyForm, setOpenRoyaltyForm, step } = useJoin();

  const { connectModalOpen } = useConnectModal();

  const { address: account_address, isConnected } = useAccount();

  const [proof, setProof] = useLocalStorage("proof", null);

  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo({
    account_address: account_address?.toLowerCase(),
    proof: proof,
  });

  const propsUseUsername = useUsername({
    account_address: account_address?.toLowerCase(),
  });

  const { isUserInfoPaused } = useGlobalStates();

  const { connectWalletModal } = useConnectWallet();

  return (
    <Dialog
      open={openRoyaltyForm}
      onOpenChange={() => {
        if (connectModalOpen === true) {
          // do nothing
        } else {
          setOpenRoyaltyForm(!openRoyaltyForm);
        }
      }}
    >
      {!isUserInfoLoading && !isConnected && !isUserInfoPaused && (
        <Button
          onClick={() => {
            connectWalletModal();
          }}
          className="h-12 w-full max-w-xs rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Connect Wallet
        </Button>
      )}

      {(isUserInfoLoading ||
        (isConnected &&
          !userInfo &&
          propsUseUsername.isLoading &&
          !isUserInfoPaused)) && (
        <Button
          onClick={() => {
            // do nothing
          }}
          className="h-12 w-full max-w-xs rounded-lg border border-divider bg-z2 font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          <LoadingSpinner className="h-5 w-5" />
        </Button>
      )}

      {!isUserInfoLoading &&
        isConnected &&
        !propsUseUsername.isLoading &&
        propsUseUsername.data &&
        !userInfo &&
        !isUserInfoPaused && <SignInButton />}

      <DialogTrigger asChild>
        {!isUserInfoLoading &&
          (isUserInfoPaused ||
            (isConnected &&
              !propsUseUsername.isLoading &&
              !propsUseUsername.data &&
              !userInfo)) && (
            <Button
              onClick={() => {
                setOpenRoyaltyForm(true);
              }}
              className="h-12 w-full max-w-xs rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
            >
              Create Account
            </Button>
          )}
      </DialogTrigger>

      {!connectModalOpen && (
        <DialogContent className="max-h-[100vh] shrink-0 !rounded-none !border-0 bg-transparent !p-3 shadow-none sm:max-w-[480px]">
          <div className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-sm">
            {step === "info" ? (
              <RoyaltyFormPopUp royaltyForm={royaltyForm} />
            ) : (
              <OtpForm royaltyForm={royaltyForm} />
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
});
