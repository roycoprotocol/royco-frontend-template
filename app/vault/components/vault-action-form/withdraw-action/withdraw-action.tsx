import React, { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { WithdrawActionForm } from "./withdraw-action-form/withdraw-action-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorAlert } from "@/components/composables/alerts";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";
import {
  useVaultManager,
  VaultTransactionType,
} from "@/store/vault/use-vault-manager";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";

export const withdrawFormSchema = z.object({
  amount: z.string(),
});

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const { data } = useAtomValue(vaultMetadataAtom);
  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const { setTransactions, reload } = useVaultManager();

  const { getWithdrawalTransaction } = useBoringVaultActions();

  const withdrawForm = useForm<z.infer<typeof withdrawFormSchema>>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    if (reload) {
      withdrawForm.reset();
    }
  }, [reload]);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawForm.getValues("amount") || "0");

    if (!amount) {
      toast.custom(<ErrorAlert message="Amount is required" />);
      return;
    }

    if (!token) {
      return;
    }

    const withdrawTransactions = await getWithdrawalTransaction(amount);

    if (withdrawTransactions && withdrawTransactions.steps.length > 0) {
      const transactions = {
        type: VaultTransactionType.Withdraw,
        title: "Request Withdrawal",
        successTitle: "Withdrawal Requested",
        description: withdrawTransactions.description,
        steps: withdrawTransactions.steps,
        metadata: withdrawTransactions.metadata,
        warnings: withdrawTransactions.warnings,
        token: {
          data: token,
          amount: amount,
        },
      };

      setTransactions(transactions);
    }
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
                className="h-10 w-full rounded-sm bg-_highlight_"
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
                className="h-10 w-full rounded-sm bg-_highlight_"
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
              className="h-10 w-full rounded-sm bg-_highlight_"
            >
              Withdraw
            </Button>
          );
        })()}
      </div>
    </div>
  );
});
