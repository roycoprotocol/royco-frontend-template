import React, { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { switchChain } from "@wagmi/core";

import { ErrorAlert } from "@/components/composables/alerts/base-alerts";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables/loading-spinner";

interface BoringVaultActionButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void;
  onError?: () => void;
}

export const BoringVaultActionButton = React.forwardRef<
  HTMLButtonElement,
  BoringVaultActionButtonProps
>(({ className, ...props }, ref) => {
  const { address, chainId } = useAccount();

  const { connectWalletModal } = useConnectWallet();

  const vault = useAtomValue(vaultManagerAtom);
  const { transaction, setTransaction } = useVaultManager();
  const { deposit, withdraw } = useBoringVaultActions();

  const txType = useMemo(() => {
    if (transaction?.type === "deposit") {
      return "deposit";
    } else if (transaction?.type === "withdraw") {
      return "withdraw";
    }
  }, [transaction]);

  useEffect(() => {
    let tx;
    if (txType === "deposit") {
      tx = vault?.transactions.deposit;
    }
    if (txType === "withdraw") {
      tx = vault?.transactions.withdraw;
    }
  }, [txType]);

  const handleAction = async () => {
    try {
      const amount = transaction?.form.amount;

      if (txType === "deposit") {
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
        });
        return;
      }

      if (txType === "withdraw") {
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
        });
        return;
      }

      toast.custom(<ErrorAlert message="Unknown transaction." />);
    } catch (error) {
      toast.custom(<ErrorAlert message={`Error: error`} />);
      console.log("Failed:", error);
    }
  };

  const isTxLoading = useMemo(() => {
    return transaction?.txStatus === "loading";
  }, [transaction]);

  if (!address) {
    return (
      <Button
        onClick={() => {
          try {
            // @ts-ignore
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

  if (chainId !== vault?.chain_id) {
    return (
      <Button
        onClick={async () => {
          try {
            // @ts-ignore
            await switchChain(config, {
              chainId: vault?.chain_id,
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

  if (transaction?.txStatus !== "success") {
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
