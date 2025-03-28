import React from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { ErrorAlert } from "@/components/composables";
import { DepositActionForm } from "./deposit-action-form/deposit-action-form";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { vaultManagerAtom } from "@/store/vault/vault-manager";

export const depositFormSchema = z.object({
  token: z.object({
    address: z.string(),
    decimals: z.number(),
  }),
  amount: z.string(),
});

export const SupplyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const vaultManager = useAtomValue(vaultManagerAtom);

  const depositForm = useForm<z.infer<typeof depositFormSchema>>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      token: vaultManager?.base_asset,
      amount: "",
    },
  });

  const { deposit } = useBoringVaultActions();

  const handleDeposit = async () => {
    const amount = parseFloat(depositForm.getValues("amount") || "0");
    const token = depositForm.getValues("token");

    await deposit(amount, token);
  };

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <DepositActionForm depositForm={depositForm} />

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
                    handleDeposit();
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
