"use client";

import { AlertIndicator } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MarketSteps, useMarketManager } from "@/store";
import React, { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { LoadingSpinner } from "../loading-spinner";
import { ErrorAlert } from "../alerts";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import { TransactionRow } from "./transaction-row";
import { TransactionOptionsType } from "@/sdk/types";
import { SlideUpWrapper } from "@/components/animations";
import { useQueryClient } from "@tanstack/react-query";

export const TransactionModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...otherProps } = props;
  const { transactions, setTransactions, marketStep, setMarketStep } =
    useMarketManager();

  const queryClient = useQueryClient();

  const [isTransactionTimeout, setIsTransactionTimeout] = useState(false);

  const [currentTransaction, setCurrentTransaction] =
    React.useState<TransactionOptionsType | null>(null);

  const {
    status: txStatus,
    data: txHash,
    isIdle: isTxIdle,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
    reset: resetTx,
  } = useWriteContract();

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const allTransactionsExecuted = useMemo(() => {
    return transactions.every((tx) => {
      if (tx.txStatus === "success") {
        return true;
      } else {
        return false;
      }
    });
  }, [transactions]);

  const findNextTransaction = () => {
    for (let i = 0; i < transactions.length; i++) {
      if (
        transactions[i] !== null &&
        transactions[i].txStatus !== "success" &&
        !isEqual(transactions[i], currentTransaction)
      ) {
        setCurrentTransaction(transactions[i]);
        break;
      }
    }
  };

  const getNextLabel = () => {
    if (!allTransactionsExecuted && !!currentTransaction) {
      return "Confirm Transaction";
    } else {
      return "Close";
    }
  };

  const handleNextStep = () => {
    if (allTransactionsExecuted === true) {
      setMarketStep(MarketSteps.params.id);
      setTransactions([]);
      setIsTransactionTimeout(false);
    } else {
      try {
        if (!!currentTransaction) {
          setIsTransactionTimeout(true);
          resetTx();
          // @ts-ignore
          writeContract({
            ...currentTransaction,
            // __mode: "prepared",
          });
        }
      } catch (error) {
        setIsTransactionTimeout(false);
        toast.custom(<ErrorAlert message="Error submitting transaction" />);
      }
    }
  };

  const updateTransactions = () => {
    if (!!currentTransaction) {
      let newTransactions = [...transactions];

      const currentTransactionIndex = transactions.findIndex(
        (tx) => tx.id === currentTransaction.id
      );

      if (currentTransactionIndex !== -1) {
        newTransactions[currentTransactionIndex] = {
          ...currentTransaction,
          txStatus: confirmationStatus,
          txHash: txHash,
        };
      }

      if (!isEqual(newTransactions, transactions)) {
        setTransactions(newTransactions);
      }

      if (txError || isTxConfirmError) {
        setIsTransactionTimeout(false);
      }
    }
  };

  useEffect(() => {
    updateTransactions();
  }, [txStatus, txHash, isTxConfirming, isTxConfirmed]);

  useEffect(() => {
    if (isTxError) {
      const errorMessage =
        // @ts-ignore
        txError?.shortMessage ?? "Error executing transaction";

      toast.custom(<ErrorAlert message={errorMessage} />);
    }
  }, [isTxError]);

  useEffect(() => {
    if (allTransactionsExecuted) {
      setTimeout(() => {
        setIsTransactionTimeout(false);
        queryClient.invalidateQueries();
      }, 5 * 1000); // 5 seconds
    }
  }, [allTransactionsExecuted]);

  useEffect(() => {
    findNextTransaction();
  }, [transactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      setCurrentTransaction(null);
    }
  }, [transactions]);

  // Add state to control dialog visibility
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    // Update isOpen when transactions change
    setIsOpen(transactions.length > 0);
    // If transactions are cleared, ensure dialog is closed
    if (transactions.length === 0) {
      setIsOpen(false);
    }
  }, [transactions]);

  const handleClose = () => {
    setIsOpen(false);
    setTransactions([]);
    resetTx();
    setCurrentTransaction(null);
    // Force a small delay before cleanup
    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isTxPending && !isTxConfirming && !isTransactionTimeout) {
          handleClose();
        }
      }}
    >
      <DialogTrigger asChild className="hidden">
        <Button variant="outline">Transaction Menu</Button>
      </DialogTrigger>

      {isOpen && (
        <DialogContent
          className={cn("z-[999] sm:max-w-[425px]", className)}
          ref={ref}
          {...otherProps}
          onInteractOutside={(e) => {
            if (isTxPending || isTxConfirming || isTransactionTimeout) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isTxPending || isTxConfirming || isTransactionTimeout) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Transaction Progress</DialogTitle>
            <DialogDescription>
              Do not close this window when the transaction is in progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll py-3">
            <div className={cn("flex flex-col gap-2")}>
              {!!transactions &&
                transactions.map((txOptions, txIndex) => {
                  if (!!txOptions) {
                    const key = `transaction:${txOptions.id}`;

                    return (
                      <TransactionRow
                        key={key}
                        transactionIndex={txIndex + 1}
                        transaction={txOptions}
                        txStatus={txStatus}
                      />
                    );
                  }
                })}
            </div>
            {allTransactionsExecuted && !isTransactionTimeout && (
              <AlertIndicator
                className="w-full rounded-xl border"
                contentClassName="w-full"
                type="success"
              >
                <div>All transactions successful</div>
                <div className="mt-5 px-5 font-gt text-sm font-light text-secondary">
                  Changes will be reflected on your market dashboard in a few
                  minutes.
                </div>
              </AlertIndicator>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              className="h-9 text-sm"
              disabled={isTxPending || isTxConfirming || isTransactionTimeout}
              onClick={handleNextStep}
              type="submit"
            >
              {isTxPending || isTxConfirming || isTransactionTimeout ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                <div className="h-5">{getNextLabel()}</div>
              )}
            </Button>

            {(!allTransactionsExecuted || isTransactionTimeout) && (
              <DialogClose asChild>
                <Button
                  className="h-9 bg-error text-sm"
                  onClick={handleClose}
                  type="button"
                  disabled={
                    isTxPending || isTxConfirming || isTransactionTimeout
                  }
                >
                  <div className="h-5">Close</div>
                </Button>
              </DialogClose>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
});

TransactionModal.displayName = "TransactionModal";
