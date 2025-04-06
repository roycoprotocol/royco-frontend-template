import React, { useMemo } from "react";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { WithdrawActionForm } from "./withdraw-action-form/withdraw-action-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorAlert } from "@/components/composables/alerts";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";

export const withdrawFormSchema = z.object({
  amount: z.string(),
});

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const vault = useAtomValue(vaultManagerAtom);

  const { data } = useAtomValue(vaultMetadataAtom);
  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const { setTransaction } = useVaultManager();

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

    if (!vault || !token) {
      return;
    }

    if (!vault.baseAsset.allowWithdraws) {
      toast.custom(<ErrorAlert message="Withdraws are not allowed" />);
      return;
    }

    const expireDays = Math.ceil(
      1 + vault.baseAsset.minimumSecondsToDeadline / 86400
    );
    const minDiscount = vault.baseAsset.minDiscount / 100;
    const maxDiscount = vault.baseAsset.maxDiscount / 100;

    const transaction = {
      type: "withdraw" as const,
      description: [
        {
          title: "What to Expect",
          description: `Your withdrawal request will be reviewed by the vault manager within ${expireDays} days. If denied or canceled, the funds will return to vault.`,
        },
        {
          title: "Slippage",
          description: `${minDiscount}% - ${maxDiscount}%`,
        },
      ],
      steps: [
        {
          type: "approve",
          label: `Approve ${token.symbol}`,
        },
        {
          type: "withdraw",
          label: `Create Withdraw ${token.symbol} Request`,
        },
      ],
      form: {
        token: token,
        amount: amount,
      },
    };

    setTransaction(transaction);
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <WithdrawActionForm withdrawForm={withdrawForm} />

      <div className="mt-6">
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

          if (chainId !== data.chainId) {
            return (
              <Button
                onClick={async () => {
                  try {
                    // @ts-ignore
                    await switchChain(config, {
                      chainId: data.chainId,
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
                  toast.custom(<ErrorAlert message="Error submitting offer" />);
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
    </div>
  );
});
