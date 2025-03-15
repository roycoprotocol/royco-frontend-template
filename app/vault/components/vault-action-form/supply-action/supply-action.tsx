import React from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { useBoringVaultV1 } from "boring-vault-ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { ErrorAlert } from "@/components/composables";
import { DepositActionForm } from "./deposit-action-form/deposit-action-form";

import { useEthersSigner } from "@/app/vault/hook/useEthersSigner";
import { VAULT_DEPOSIT_TOKENS } from "@/app/vault/providers/boring-vault-provider";

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

  const depositForm = useForm<z.infer<typeof depositFormSchema>>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      token: VAULT_DEPOSIT_TOKENS[0],
      amount: "",
    },
  });

  const { deposit } = useBoringVaultV1();
  const signer = useEthersSigner();

  const handleDeposit = async () => {
    if (!signer) {
      toast.custom(<ErrorAlert message="Error connecting wallet" />);
      return;
    }

    const amount = parseFloat(depositForm.getValues("amount") || "0");
    const token = depositForm.getValues("token");

    // @ts-ignore
    const tx = await deposit(signer, amount, token);
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
