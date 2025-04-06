import React, { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { switchChain } from "@wagmi/core";

import { ErrorAlert } from "@/components/composables/alerts/base-alerts";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables/loading-spinner";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";

interface BoringVaultActionButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void;
  onError?: () => void;
}

export const BoringVaultActionButton = React.forwardRef<
  HTMLButtonElement,
  BoringVaultActionButtonProps
>(({ className, onSuccess, onError, ...props }, ref) => {
  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const { data } = useAtomValue(vaultMetadataAtom);

  const { transaction, setTransaction } = useVaultManager();

  const { deposit, withdraw, cancelWithdraw, claimIncentive } =
    useBoringVaultActions();

  const handleAction = async () => {
    try {
      const amount = transaction?.form.amount;

      if (transaction?.type === "deposit") {
        setTransaction({
          ...transaction,
          txStatus: "loading",
        });

        const response = await deposit(amount);

        if (response.error) {
          setTransaction({
            ...transaction,
            txStatus: "error",
          });
          return;
        }

        setTransaction({
          ...transaction,
          txStatus: "success",
          txHash: response.tx_hash,
        });

        onSuccess?.();
        return;
      }

      if (transaction?.type === "withdraw") {
        setTransaction({
          ...transaction,
          txStatus: "loading",
        });

        const response = await withdraw(amount);

        if (response.error) {
          setTransaction({
            ...transaction,
            txStatus: "error",
          });
          return;
        }

        setTransaction({
          ...transaction,
          txStatus: "success",
          txHash: response.tx_hash,
        });

        onSuccess?.();
        return;
      }

      if (transaction?.type === "cancelWithdraw") {
        setTransaction({
          ...transaction,
          txStatus: "loading",
        });

        const response = await cancelWithdraw();

        if (response.error) {
          setTransaction({
            ...transaction,
            txStatus: "error",
          });
          return;
        }

        setTransaction({
          ...transaction,
          txStatus: "success",
          txHash: response.tx_hash,
        });

        onSuccess?.();
        return;
      }

      if (transaction?.type === "claimIncentives") {
        setTransaction({
          ...transaction,
          txStatus: "loading",
        });

        const response = await claimIncentive(
          transaction?.form.token.rewardIds
        );

        if (response.error) {
          setTransaction({
            ...transaction,
            txStatus: "error",
          });
          return;
        }

        setTransaction({
          ...transaction,
          txStatus: "success",
          txHash: response.tx_hash,
        });

        onSuccess?.();
        return;
      }

      toast.custom(<ErrorAlert message="Unknown transaction." />);
    } catch (error) {
      onError?.();

      toast.custom(<ErrorAlert message={`Error: Transaction failed.`} />);
      console.log("Failed:", error);
    }
  };

  const isTxLoading = useMemo(() => {
    return transaction?.txStatus === "loading";
  }, [transaction]);

  const isTxSuccess = useMemo(() => {
    return transaction?.txStatus === "success";
  }, [transaction]);

  if (!address) {
    return (
      <Button
        onClick={() => {
          try {
            connectWalletModal();
          } catch (error) {
            toast.custom(<ErrorAlert message="Error connecting wallet" />);
          }
        }}
        size="sm"
        ref={ref}
        className={cn("w-full", className)}
        {...props}
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
            toast.custom(<ErrorAlert message="Error switching chain" />);
            console.log("Failed:", error);
          }
        }}
        size="sm"
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        Switch Chain
      </Button>
    );
  }

  if (!isTxSuccess) {
    return (
      <Button
        onClick={handleAction}
        size="sm"
        ref={ref}
        className={cn("w-full", className)}
        {...props}
        disabled={isTxLoading}
      >
        {isTxLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          "Confirming Transaction"
        )}
      </Button>
    );
  }

  return null;
});
