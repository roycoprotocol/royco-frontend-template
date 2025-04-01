import React from "react";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { WithdrawActionForm } from "./withdraw-action-form/withdraw-action-form";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorAlert } from "@/components/composables/alerts";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";
import { useVaultManager } from "@/store/vault/use-vault-manager";

export const withdrawFormSchema = z.object({
  amount: z.string(),
});

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vaultManager = useAtomValue(vaultManagerAtom);
  const { setTransaction } = useVaultManager();

  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const withdrawForm = useForm<z.infer<typeof withdrawFormSchema>>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawForm.getValues("amount") || "0");

    if (!amount) {
      toast.custom(<ErrorAlert message="Amount is required" />);
      return;
    }

    const transaction = {
      type: "withdraw",
      description: {
        title: "What to Expect",
        description:
          "Your withdrawal request will be reviewed by the vault by Sat, Jan 18. If denied or canceled, the funds will return to your wallet.",
      },
      steps: [
        {
          type: "approve",
          label: "Approve USDC",
        },
        {
          type: "withdraw",
          label: "Create Withdraw Request",
        },
      ],
      form: {
        amount: amount,
      },
    };

    setTransaction(transaction);
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <WithdrawActionForm withdrawForm={withdrawForm} />

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

            if (chainId !== vaultManager?.chain_id) {
              return (
                <Button
                  onClick={async () => {
                    try {
                      // @ts-ignore
                      await switchChain(config, {
                        chainId: vaultManager?.chain_id,
                      });
                    } catch (error) {
                      toast.custom(
                        <ErrorAlert message="Error switching chain" />
                      );
                      console.log("Failed:", error);
                    }
                  }}
                  size="sm"
                  className="w-full"
                >
                  Switch Chain
                </Button>
              );
            }

            return (
              <Button
                onClick={() => {
                  try {
                    handleWithdraw();
                  } catch (error) {
                    toast.custom(
                      <ErrorAlert message="Error submitting offer" />
                    );
                  }
                }}
                size="sm"
                className="w-full"
              >
                Withdraw
              </Button>
            );
          })()}
        </div>
      </>
    </div>
  );
});
