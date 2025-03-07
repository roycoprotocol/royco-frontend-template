"use client";

import React, { useEffect } from "react";
import { useJoin } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoyaltyFormPopUp } from "./royalty-form-pop-up";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { useUsername } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { getUserInfoQueryFunction, useUserInfo } from "@/components/user/hooks";
import { useGlobalStates } from "@/store";
import { SignInButton } from "../sign-in-button/sign-in-button";
import { UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import { OtpForm } from "../otp-form";
import { SuccessScreen } from "../success-screen";
import { useQuery } from "@tanstack/react-query";

export const RoyaltyForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { user, isUserInfoPaused } = useGlobalStates();
  const { openRoyaltyForm, setOpenRoyaltyForm, step } = useJoin();
  const { connectModalOpen } = useConnectModal();
  const { address: account_address, isConnected } = useAccount();
  const [signInToken, setSignInToken] = useLocalStorage("sign_in_token", null);

  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo({
    account_address: account_address?.toLowerCase(),
    sign_in_token: signInToken,
  });

  const propsUseUsername = useUsername({
    account_address: account_address?.toLowerCase(),
  });

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
        <DialogContent className="max-h-[100vh] shrink-0 !rounded-none !border-0 bg-transparent !p-3 shadow-none !outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:max-w-[480px]">
          <DialogTitle className="hidden">Royalty Dialog</DialogTitle>

          <div className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-sm">
            {step === "info" && <RoyaltyFormPopUp royaltyForm={royaltyForm} />}
            {step === "otp" && <OtpForm royaltyForm={royaltyForm} />}
            {step === "success" && <SuccessScreen />}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
});
