"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TransactionRow } from "./transaction-row";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";
import { SuccessIcon } from "@/assets/icons/success";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionManager } from "@/store/global/use-transaction-manager";
import { useSetAtom } from "jotai";
import { lastRefreshTimestampAtom } from "@/store/global";

interface TransactionModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: () => void;
  onError?: () => void;
}

export const TransactionModal = React.forwardRef<
  HTMLDivElement,
  TransactionModalProps
>(({ className, onSuccess, onError, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { transactions, setTransactions } = useTransactionManager();

  const setLastRefreshTimestamp = useSetAtom(lastRefreshTimestampAtom);

  useEffect(() => {
    if (transactions !== null && transactions !== undefined) {
      setIsOpen(true);
    }
    if (transactions === null || transactions === undefined) {
      setIsOpen(false);
    }
  }, [transactions]);

  const transaction = useMemo(() => {
    if (transactions === null || transactions === undefined) {
      return null;
    }
    if (transactions.steps && transactions.steps.length === 0) {
      return null;
    }
    return transactions.steps.find((step: any) => step.txStatus !== "success");
  }, [transactions]);

  const handleClose = () => {
    setIsOpen(false);
    // @ts-ignore
    setTransactions(null);

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  };

  const isTxLoading = useMemo(() => {
    return transactions?.steps.some((step: any) => step.txStatus === "loading");
  }, [transactions]);

  const isTxSuccess = useMemo(() => {
    return transactions?.steps.every(
      (step: any) => step.txStatus === "success"
    );
  }, [transactions]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isTxLoading) {
          handleClose();
        }
      }}
    >
      {isOpen && (
        <DialogContent
          className={cn("p-2 sm:max-w-[500px]", className)}
          ref={ref}
          {...props}
          onInteractOutside={(e) => {
            if (isTxLoading) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isTxLoading) {
              e.preventDefault();
            }
          }}
        >
          <ScrollArea className="max-h-[90vh] p-4">
            <DialogHeader>
              <div className={cn("flex flex-col items-start gap-2")}>
                {isTxSuccess && (
                  <SlideUpWrapper
                    layoutId={`transaction-modal-success-icon-${isTxSuccess}`}
                  >
                    <SuccessIcon className="mb-4 h-10 w-10" />
                  </SlideUpWrapper>
                )}

                <SlideUpWrapper
                  layoutId={`transaction-modal-title-${isTxSuccess}`}
                >
                  <DialogTitle className="text-2xl font-medium">
                    {!isTxSuccess && (transactions?.title || "Transaction")}
                    {isTxSuccess &&
                      (transactions?.successTitle || "Transaction Success")}
                  </DialogTitle>
                </SlideUpWrapper>

                {transactions?.token && (
                  <SlideUpWrapper
                    layoutId={`transaction-modal-token-displayer-${isTxSuccess}`}
                  >
                    <div className="flex items-center gap-1">
                      <TokenDisplayer
                        size={6}
                        tokens={[transactions?.token.data]}
                        symbols={false}
                      />

                      <span className="text-2xl font-medium text-_primary_">
                        {formatNumber(transactions?.token.amount, {
                          type: "number",
                        })}
                      </span>

                      <span className="text-2xl font-medium text-_primary_">
                        {transactions?.token.data.symbol}
                      </span>
                    </div>
                  </SlideUpWrapper>
                )}
              </div>
            </DialogHeader>

            {transactions?.description && (
              <SecondaryLabel className="mt-3 break-normal text-base font-normal text-_secondary_">
                {transactions?.description}
              </SecondaryLabel>
            )}

            {!isTxSuccess &&
              transactions?.info &&
              transactions?.info.length > 0 && (
                <div className="mt-6">
                  <SecondaryLabel className="text-xs font-medium tracking-wide">
                    DETAILS
                  </SecondaryLabel>

                  <div className="mt-3 flex flex-col gap-3">
                    {transactions.info.map((item, index) => (
                      <div key={index} className="flex justify-between gap-1">
                        <SecondaryLabel className="text-base font-normal text-_secondary_">
                          {item.label}
                        </SecondaryLabel>

                        <PrimaryLabel className="text-base font-normal text-_primary_">
                          {item.value}
                        </PrimaryLabel>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {!isTxSuccess && transactions?.warning && (
              <div className="mt-3 rounded-sm border border-_divider_ p-4">
                <SecondaryLabel className="break-normal text-base">
                  {transactions.warning}
                </SecondaryLabel>
              </div>
            )}

            {transactions?.steps && transactions?.steps.length > 0 && (
              <div className="mt-6">
                <SecondaryLabel className="text-xs font-medium tracking-wide">
                  TRANSACTION STEPS
                </SecondaryLabel>

                <div className="mt-3 flex max-h-[50vh] flex-col gap-2 overflow-y-scroll">
                  <div className={cn("flex flex-col gap-2")}>
                    {transactions.steps.map((txOptions: any, txIndex: any) => {
                      const key = `transaction:${txOptions.id}`;
                      return (
                        <TransactionRow
                          key={key}
                          transactionIndex={txIndex + 1}
                          isSelected={transaction?.type === txOptions.type}
                          transaction={txOptions}
                          onSuccess={() => {
                            setLastRefreshTimestamp(Date.now());
                            onSuccess?.();
                          }}
                          onError={() => {
                            setLastRefreshTimestamp(Date.now());
                            onError?.();
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isTxSuccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="mt-3 h-10 w-full justify-center rounded-sm"
              >
                Close
              </Button>
            )}

            {!isTxSuccess && (
              <SecondaryLabel className="mt-6 justify-center text-xs font-normal">
                Keep window open until complete.
              </SecondaryLabel>
            )}
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
});
