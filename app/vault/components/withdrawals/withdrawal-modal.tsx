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
import { useVaultManager } from "@/store/vault/use-vault-manager";

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
    };
  }
>(({ className, isOpen, onOpenModal, withdrawal, ...props }, ref) => {
  const { setTransaction } = useVaultManager();

  const handleCancelWithdrawal = () => {
    if (!withdrawal.token) {
      return;
    }

    const transaction = {
      type: "cancelWithdraw" as const,
      description: [
        {
          title: "What to Expect",
          description: `The funds will return to vault.`,
        },
      ],
      steps: [
        {
          type: "cancel",
          label: `Cancelation Request`,
        },
      ],
      form: {
        token: withdrawal.token,
        amount: withdrawal.amountInBaseAsset,
      },
    };

    setTransaction(transaction);
    onOpenModal(false);
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
            <DialogTitle className="text-left">Withdrawal</DialogTitle>
          </DialogHeader>

          {/**
           * Token Amount
           */}
          <div className="mt-3 flex items-center gap-1">
            <TokenDisplayer
              size={4}
              tokens={[withdrawal.token]}
              symbols={false}
            />

            <span className="text-base font-normal">
              {formatNumber(withdrawal.amountInBaseAsset, {
                type: "number",
              })}
            </span>

            <span className="text-base font-normal">
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
                className="mt-2 bg-error"
                onClick={handleCancelWithdrawal}
              >
                Cancel
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
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
