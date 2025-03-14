import React from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { ErrorAlert } from "@/components/composables";
import { DepositActionForm } from "./deposit-action-form/deposit-action-form";

export const SupplyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <DepositActionForm />

      <>
        <div className="mt-5">
          {(() => {
            if (!address) {
              return (
                <Button
                  onClick={() => {
                    try {
                      connectWalletModal();
                    } catch (error) {
                      toast.custom(
                        <ErrorAlert message="Error connecting wallet" />
                      );
                    }
                  }}
                  size="sm"
                  className="w-full"
                >
                  Connect Wallet
                </Button>
              );
            }

            return (
              <Button
                onClick={() => {
                  try {
                    console.log("Supplying...");
                  } catch (error) {
                    toast.custom(
                      <ErrorAlert message="Error submitting offer" />
                    );
                  }
                }}
                size="sm"
                className="w-full"
              >
                <span>Supply Now</span>
              </Button>
            );
          })()}
        </div>
      </>
    </div>
  );
});
