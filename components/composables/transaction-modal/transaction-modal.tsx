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
import React, { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { LoadingSpinner } from "../loading-spinner";
import { ErrorAlert } from "../alerts";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import { TransactionRow } from "./transaction-row";
import { TransactionOptionsType } from "@/sdk/types";
import { SlideUpWrapper } from "@/components/animations";

export const TransactionModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...otherProps } = props;
  const { transactions, setTransactions, marketStep, setMarketStep } =
    useMarketManager();
  const allTransactionsExecuted = transactions.every((tx) => {
    if (tx.txStatus === "success") {
      return true;
    } else {
      return false;
    }
  });

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

  // console.log("transactions", transactions);

  // console.log("txError", txError);

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    status: confirmationStatus,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

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

  // console.log("currentTransaction   ", currentTransaction);

  const handleNextStep = () => {
    if (allTransactionsExecuted === true) {
      setMarketStep(MarketSteps.params.id);
      setTransactions([]);
    } else {
      try {
        if (!!currentTransaction) {
          resetTx();
          // @ts-ignore
          writeContract(currentTransaction);
        }
      } catch (error) {
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

  // console.log("txStatus", txStatus);
  // console.log("txHash", txHash);
  // console.log("isTxPending", isTxPending);
  // console.log("isTxError", isTxError);
  // console.log("txError", txError);

  // console.log("transactions", transactions);

  // console.log("currentTransaction", currentTransaction);

  useEffect(() => {
    findNextTransaction();
  }, [transactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      setCurrentTransaction(null);
    }
  }, [transactions]);

  return (
    <Dialog
      open={transactions.length > 0}
      onOpenChange={() => {
        setTransactions([]);
      }}
    >
      <DialogTrigger asChild className="hidden">
        <Button variant="outline">Transaction Menu</Button>
      </DialogTrigger>

      {transactions.length > 0 && (
        <DialogContent
          className={cn("z-[999] sm:max-w-[425px]", className)}
          ref={ref}
          {...otherProps}
        >
          <DialogHeader>
            <DialogTitle>Transaction Progress</DialogTitle>
            <DialogDescription>
              Do not close this window when the transaction is in progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            {allTransactionsExecuted && (
              <AlertIndicator
                className="w-full"
                contentClassName="w-full"
                type="success"
              >
                <div>All transactions successful</div>
                <div className="mt-5 px-5 font-gt text-sm font-light text-secondary">
                  Changes will be reflected on your market dashboard in a few
                  mins.
                </div>
              </AlertIndicator>
            )}
            {!allTransactionsExecuted && (
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
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              className="h-9 text-sm"
              disabled={isTxPending || isTxConfirming ? true : false}
              onClick={() => {
                handleNextStep();
              }}
              type="submit"
            >
              {isTxPending || isTxConfirming ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                <div className="h-5">{getNextLabel()}</div>
              )}
            </Button>

            {!allTransactionsExecuted && (
              <DialogClose asChild>
                <Button
                  className="h-9 bg-error text-sm"
                  onClick={() => setTransactions([])}
                  type="button"
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
