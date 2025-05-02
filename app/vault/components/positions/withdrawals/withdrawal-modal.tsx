"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { Calendar, CircleCheckBig, CircleX, Clock } from "lucide-react";
import { formatDate } from "date-fns";
import { capitalize } from "lodash";
import {
  useVaultManager,
  VaultTransactionType,
} from "@/store/vault/use-vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";

export const WithdrawalModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenModal: (open: boolean) => void;
    withdrawal: {
      token: any;
      amountInBaseAsset: number;
      createdAt: number;
      status: string;
      metadata: any;
    };
  }
>(({ className, isOpen, onOpenModal, withdrawal, ...props }, ref) => {
  const { setTransactions } = useVaultManager();

  const { getCancelWithdrawalTransaction, getRecoverWithdrawalTransaction } =
    useBoringVaultActions();

  const handleCancelWithdrawal = async () => {
    if (!withdrawal.token || !withdrawal.metadata) {
      return;
    }

    const cancelWithdrawalTransactions = await getCancelWithdrawalTransaction(
      withdrawal.metadata
    );

    if (
      cancelWithdrawalTransactions &&
      cancelWithdrawalTransactions.steps.length > 0
    ) {
      const transactions = {
        type: VaultTransactionType.CancelWithdraw,
        title: "Cancel Withdrawal",
        successTitle: "Withdrawal Cancelled",
        description: cancelWithdrawalTransactions.description,
        steps: cancelWithdrawalTransactions.steps || [],
        metadata: cancelWithdrawalTransactions.metadata,
        token: {
          data: withdrawal.token,
          amount: withdrawal.amountInBaseAsset,
        },
      };

      setTransactions(transactions);
      onOpenModal(false);
    }
  };

  const handleRecoverWithdrawal = async () => {
    if (!withdrawal.token || !withdrawal.metadata) {
      return;
    }

    const recoverWithdrawalTransactions = await getRecoverWithdrawalTransaction(
      withdrawal.metadata
    );

    if (
      recoverWithdrawalTransactions &&
      recoverWithdrawalTransactions.steps.length > 0
    ) {
      const transactions = {
        type: VaultTransactionType.RecoverWithdraw,
        title: "Recover Withdrawal",
        successTitle: "Withdrawal Recovered",
        description: recoverWithdrawalTransactions.description,
        steps: recoverWithdrawalTransactions.steps || [],
        metadata: recoverWithdrawalTransactions.metadata,
        token: {
          data: withdrawal.token,
          amount: withdrawal.amountInBaseAsset,
        },
      };

      setTransactions(transactions);
      onOpenModal(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      {isOpen && (
        <DialogContent
          className={cn("sm:max-w-[425px]", className)}
          ref={ref}
          {...props}
        >
          {/**
           * Transaction Header
           */}
          <DialogHeader>
            <DialogTitle className="text-left text-2xl font-medium">
              Withdrawal
            </DialogTitle>
          </DialogHeader>

          {/**
           * Token Amount
           */}
          <div className="flex items-center gap-1">
            <TokenDisplayer
              size={6}
              tokens={[withdrawal.token]}
              symbols={false}
            />

            <span className="text-2xl font-medium text-_primary_">
              {formatNumber(withdrawal.amountInBaseAsset, {
                type: "number",
              })}
            </span>

            <span className="text-2xl font-medium text-_primary_">
              {withdrawal.token.symbol}
            </span>
          </div>

          {/**
           * Status
           */}
          <div className="flex items-center gap-2">
            {withdrawal.status === "initiated" && <Clock className="h-4 w-4" />}
            {(withdrawal.status === "canceled" ||
              withdrawal.status === "expired") && (
              <CircleX className="h-4 w-4 text-error" />
            )}
            {withdrawal.status === "completed" && (
              <CircleCheckBig className="h-4 w-4" />
            )}

            <span className="text-base font-normal">
              {capitalize(withdrawal.status)}
            </span>
          </div>

          {/**
           * Creation Date
           */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />

            <span className="text-base font-normal">
              {formatDate(withdrawal.createdAt, "MMM d")}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {withdrawal.status === "initiated" && (
              <Button
                size="sm"
                className="mt-2 h-10 rounded-sm bg-error"
                onClick={handleCancelWithdrawal}
              >
                Cancel
              </Button>
            )}

            {withdrawal.status === "expired" && (
              <Button
                size="sm"
                className="mt-2 h-10 rounded-sm bg-error"
                onClick={handleRecoverWithdrawal}
              >
                Recover
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full place-content-center rounded-sm"
              onClick={() => onOpenModal(false)}
            >
              Close
            </Button>
          </div>

          {withdrawal.status === "initiated" && (
            <SecondaryLabel className="justify-center text-xs font-normal">
              You can cancel until the withdrawal is processed.
            </SecondaryLabel>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
});
