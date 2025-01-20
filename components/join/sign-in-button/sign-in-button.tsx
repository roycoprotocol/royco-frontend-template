"use client";

import { LoadingSpinner } from "@/components/composables/loading-spinner";
import { OwnershipProofMessage } from "@/components/constants";
import { Button } from "@/components/ui/button";
import { isWalletValid } from "@/components/user";
import { useUserInfo } from "@/components/user/hooks";
import { cn } from "@/lib/utils";
import { useGlobalStates, useJoin } from "@/store";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useAccount, useSignMessage } from "wagmi";

export const SignInButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address: account_address, isConnected } = useAccount();

  const { signedMessage, setSignedMessage } = useJoin();

  const {
    signMessage,
    data: dataSignMessage,
    isPending: isPendingSignMessage,
    isSuccess: isSuccessSignMessage,
    isError: isErrorSignMessage,
  } = useSignMessage();

  const updateLocalStorageWallet = async () => {
    try {
      if (
        !!dataSignMessage &&
        isSuccessSignMessage === true &&
        !!account_address
      ) {
        // @ts-ignore
        setSignedMessage(dataSignMessage);
      }
    } catch (err) {}
  };

  useEffect(() => {
    updateLocalStorageWallet();
  }, [dataSignMessage, isSuccessSignMessage, isPendingSignMessage]);

  return (
    <Button
      type="button"
      onClick={() => {
        signMessage({
          message: OwnershipProofMessage,
        });
      }}
      className={cn(
        "h-12 w-full max-w-xs rounded-lg font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
        isPendingSignMessage ? "border border-divider bg-z2" : "bg-mint"
      )}
    >
      {isPendingSignMessage ? (
        <LoadingSpinner className="h-5 w-5" />
      ) : (
        "Sign In"
      )}
    </Button>
  );
});
