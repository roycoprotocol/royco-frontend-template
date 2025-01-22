"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables/loading-spinner";
import { OwnershipProofMessage } from "@/components/constants";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "usehooks-ts";
import { useAccount, useSignMessage } from "wagmi";

export const SignInButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address: account_address, isConnected } = useAccount();
  const [signInToken, setSignInToken] = useLocalStorage("sign_in_token", null);

  const {
    signMessage,
    data: dataSignMessage,
    isPending: isPendingSignMessage,
    isSuccess: isSuccessSignMessage,
    isError: isErrorSignMessage,
  } = useSignMessage();

  const updateLocalStorageSignInToken = async () => {
    try {
      if (
        !!dataSignMessage &&
        isSuccessSignMessage === true &&
        !!account_address
      ) {
        const req = await fetch("/api/users/validate", {
          method: "POST",
          body: JSON.stringify({
            signed_message: dataSignMessage,
            account_address: account_address.toLowerCase(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const res = await req.json();

        if (res.sign_in_token) {
          setSignInToken(res.sign_in_token);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    updateLocalStorageSignInToken();
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
