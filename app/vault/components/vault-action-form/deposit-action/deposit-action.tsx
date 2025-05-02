import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAtomValue } from "jotai";
import { switchChain } from "@wagmi/core";

import { config } from "@/components/rainbow-modal/modal-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/composables";
import { DepositActionForm } from "./deposit-action-form/deposit-action-form";
import {
  useVaultManager,
  VaultTransactionType,
} from "@/store/vault/use-vault-manager";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";

export const depositFormSchema = z.object({
  amount: z.string(),
});

export const DepositAction = React.forwardRef<
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

  const { getDepositTransaction } = useBoringVaultActions();

  const depositForm = useForm<z.infer<typeof depositFormSchema>>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    if (reload) {
      depositForm.reset();
    }
  }, [reload]);

  const handleDeposit = async () => {
    const amount = parseFloat(depositForm.getValues("amount") || "0");

    if (!amount) {
      toast.custom(<ErrorAlert message="Amount is required" />);
      return;
    }

    if (!token) {
      return;
    }

    const depositTransactions = await getDepositTransaction(amount);

    if (depositTransactions && depositTransactions.steps.length > 0) {
      const transactions = {
        type: VaultTransactionType.Deposit,
        title: "Deposit",
        successTitle: "Deposit Complete",
        description: depositTransactions.description,
        steps: depositTransactions.steps || [],
        metadata: depositTransactions.metadata,
        token: {
          data: token,
          amount: amount,
        },
      };

      setTransactions(transactions);
    }
  };

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <DepositActionForm depositForm={depositForm} />

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
                  handleDeposit();
                } catch (error) {
                  toast.custom(<ErrorAlert message="Error submitting offer" />);
                }
              }}
              size="sm"
              className="h-10 w-full rounded-sm bg-_highlight_"
            >
              Deposit
            </Button>
          );
        })()}
      </div>
    </div>
  );
});
