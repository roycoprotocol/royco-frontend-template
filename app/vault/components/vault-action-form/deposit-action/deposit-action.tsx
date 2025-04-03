import React, { useMemo } from "react";
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
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { ErrorAlert } from "@/components/composables";
import { DepositActionForm } from "./deposit-action-form/deposit-action-form";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";

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

  const { setTransaction } = useVaultManager();

  const depositForm = useForm<z.infer<typeof depositFormSchema>>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleDeposit = async () => {
    const amount = parseFloat(depositForm.getValues("amount") || "0");

    if (!amount) {
      toast.custom(<ErrorAlert message="Amount is required" />);
      return;
    }

    if (!token) {
      return;
    }

    const transaction = {
      type: "deposit" as const,
      steps: [
        {
          type: "approve",
          label: `Approve ${token.symbol}`,
        },
        {
          type: "deposit",
          label: `Deposit ${token.symbol}`,
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
                  handleDeposit();
                } catch (error) {
                  toast.custom(<ErrorAlert message="Error submitting offer" />);
                }
              }}
              size="sm"
              className="w-full"
            >
              Deposit
            </Button>
          );
        })()}
      </div>
    </div>
  );
});
