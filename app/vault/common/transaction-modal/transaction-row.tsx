import { ErrorAlert } from "@/components/composables/alerts/base-alerts";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { LoadingSpinner } from "@/components/composables/loading-spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";

export const TransactionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isSelected: boolean;
    transactionIndex: number;
    transaction: any & {
      type: string;
      label: string;
      txStatus?: "loading" | "error" | "success";
      txHash?: string;
    };
    onSuccess?: () => void;
    onError?: () => void;
  }
>(
  (
    {
      className,
      isSelected,
      transaction,
      transactionIndex,
      onSuccess,
      onError,
      ...props
    },
    ref
  ) => {
    const { address, chainId } = useAccount();
    const { connectWalletModal } = useConnectWallet();

    const { data } = useAtomValue(vaultMetadataAtom);
    const { transactions, setTransactions } = useVaultManager();

    const handleAction = async () => {
      if (!address) {
        toast.custom(<ErrorAlert message="Wallet not found" />);
        return;
      }

      if (!transaction) {
        toast.custom(<ErrorAlert message="Transaction data not available" />);
        return;
      }

      try {
        setTransactions({
          ...transactions,
          steps: transactions.steps.map((step: any) => {
            if (step.type === transaction.type) {
              return {
                ...step,
                txStatus: "loading",
              };
            }
            return step;
          }),
        });

        // @ts-ignore
        const txHash = await writeContract(config, transaction.data);

        // @ts-ignore
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        setTransactions({
          ...transactions,
          steps: transactions.steps.map((step: any) => {
            if (step.type === transaction.type) {
              return {
                ...step,
                txStatus: "success",
                txHash: receipt.transactionHash,
              };
            }
            return step;
          }),
        });

        onSuccess?.();
      } catch (error: any) {
        setTransactions({
          ...transactions,
          steps: transactions.steps.map((step: any) => {
            if (step.type === transaction.type) {
              return {
                ...step,
                txStatus: "error",
              };
            }
            return step;
          }),
        });
        toast.custom(<ErrorAlert message={"Transaction failed"} />);

        onError?.();
      }
    };

    return (
      <div
        ref={ref}
        className={cn("rounded-sm border border-_divider_ p-2", className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/**
             * Index
             */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-_surface_tertiary">
              <div className="text-sm font-normal text-_primary_">
                {transactionIndex}
              </div>
            </div>

            {/**
             * Details
             */}
            <div className="grow text-left text-base font-normal text-_primary_">
              {transaction.label}
            </div>
          </div>

          {transaction.txStatus === "success" && (
            <div className="flex h-5 w-5 items-center justify-center rounded bg-_primary_">
              <Check className="h-3 w-3 text-white" strokeWidth={5} />
            </div>
          )}
        </div>

        {(() => {
          if (!isSelected) {
            return;
          }

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
                className={cn("mt-3 h-10 w-full rounded-sm")}
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
                className={cn("mt-3 h-10 w-full rounded-sm")}
              >
                Switch Chain
              </Button>
            );
          }

          if (transaction.txStatus !== "success") {
            return (
              <Button
                onClick={handleAction}
                size="sm"
                className={cn("mt-3 h-10 w-full rounded-sm")}
                disabled={transaction.txStatus === "loading"}
              >
                {transaction.txStatus === "loading" ? (
                  <LoadingSpinner className="h-5 w-5" />
                ) : (
                  "Confirm Transaction"
                )}
              </Button>
            );
          }
        })()}
      </div>
    );
  }
);
