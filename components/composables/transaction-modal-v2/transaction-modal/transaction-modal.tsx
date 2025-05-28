"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { useEthersSigner } from "@/app/vault/hook/useEthersSigner";
import { config } from "@/components/rainbow-modal/modal-config";
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
import { ErrorAlert } from "@/components/composables";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { SuccessIcon } from "@/assets/icons/success";
import { portfolioTransactionsAtom } from "../../../../store/portfolio/portfolio";
import { lastRefreshTimestampAtom } from "@/store/global";
import { LoadingCircle } from "@/components/animations/loading-circle";

const DropdownAnimationWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        exit={{ y: -10 }}
        transition={{ duration: 0.3 }}
        ref={ref}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

interface TransactionModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: () => void;
  onError?: () => void;
}

export const TransactionModalV2 = React.forwardRef<
  HTMLDivElement,
  TransactionModalProps
>(({ className, onSuccess, onError, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const [transactions, setTransactions] = useAtom(portfolioTransactionsAtom);

  const signer = useEthersSigner();

  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useAtom(
    lastRefreshTimestampAtom
  );

  const transaction = useMemo(() => {
    if (transactions === null || transactions === undefined) {
      return null;
    }

    if (transactions.steps && transactions.steps.length === 0) {
      return null;
    }

    return transactions.steps.find((step) => step.txStatus !== "success");
  }, [transactions]);

  const handleClose = () => {
    setIsOpen(false);
    setTransactions(null);

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  };

  const handleAction = async () => {
    if (!address || !signer) {
      return;
    }

    if (!transaction) {
      toast.custom(<ErrorAlert message="Transaction data not available" />);
      return;
    }

    try {
      if (!transactions) {
        return;
      }

      setTransactions({
        ...transactions,
        steps: transactions.steps.map((step) => {
          if (step.id === transaction.id) {
            return {
              ...step,
              txStatus: "loading",
            };
          }
          return step;
        }),
      });

      // @ts-ignore
      const txHash = await writeContract(config, {
        ...transaction,
      });

      setTransactions({
        ...transactions,
        steps: transactions.steps.map((step) => {
          if (step.id === transaction.id) {
            return {
              ...step,
              txStatus: "loading",
              txHash: txHash,
            };
          }
          return step;
        }),
      });

      // @ts-ignore
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });

      const transactionIndex = transactions.steps.findIndex(
        (step) => step.id === transaction.id
      );

      // If the transaction is the last step, wait 5 seconds
      if (transactionIndex === transactions.steps.length - 1) {
        await new Promise((resolve) =>
          setTimeout(() => {
            setLastRefreshTimestamp(Date.now());
            resolve(true);
          }, 5 * 1000)
        );
      }

      setTransactions({
        ...transactions,
        steps: transactions.steps.map((step) => {
          if (step.id === transaction.id) {
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
      console.log("Failed:", error);

      if (!transactions) {
        return;
      }

      setTransactions({
        ...transactions,
        steps: transactions.steps.map((step) => {
          if (step.id === transaction.id) {
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

  const isTxLoading = useMemo(() => {
    return transactions?.steps.some((step) => step.txStatus === "loading");
  }, [transactions]);

  const isTxSuccess = useMemo(() => {
    return (
      !!transactions &&
      transactions.steps.every((step) => step.txStatus === "success")
    );
  }, [transactions]);

  useEffect(() => {
    setIsOpen(transactions !== null && transactions !== undefined);

    if (transactions === null || transactions === undefined) {
      setIsOpen(false);
    }
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
          className={cn("p-6 sm:max-w-[500px]", className)}
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
          {/**
           * Transaction Header
           */}
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
                  {isTxSuccess
                    ? transactions?.successTitle
                    : transactions?.title}
                </DialogTitle>
              </SlideUpWrapper>

              <SlideUpWrapper
                layoutId={`transaction-modal-token-displayer-${isTxSuccess}`}
              >
                <div className="flex items-center gap-1">
                  <TokenDisplayer
                    size={6}
                    tokens={transactions?.token ? [transactions?.token] : []}
                    symbols={false}
                  />

                  <span className="text-2xl font-medium text-_primary_">
                    {formatNumber(transactions?.token.tokenAmount, {
                      type: "number",
                    })}
                  </span>

                  <span className="text-2xl font-medium text-_primary_">
                    {transactions?.token.symbol}
                  </span>
                </div>
              </SlideUpWrapper>
            </div>
          </DialogHeader>

          {/**
           * Transaction Description
           */}
          {transactions?.description && (
            <SecondaryLabel className="break-normal text-base font-normal text-_secondary_">
              {transactions?.description}
            </SecondaryLabel>
          )}

          {/**
           * Transaction Metadata
           */}
          {!isTxSuccess &&
            transactions?.metadata &&
            transactions?.metadata.length > 0 && (
              <div className="mt-6">
                <SecondaryLabel className="text-xs font-medium">
                  DETAILS
                </SecondaryLabel>

                <div className="mt-3 flex flex-col gap-4">
                  {transactions?.metadata?.map((item) => (
                    <div className="flex justify-between gap-1">
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

          {/**
           * Transaction Breakdown
           */}
          {transactions &&
            transactions.steps &&
            transactions.steps.length > 0 && (
              <div className="mt-4">
                <SecondaryLabel className="text-xs font-medium">
                  TRANSACTION STEPS
                </SecondaryLabel>

                <DropdownAnimationWrapper>
                  <div className="mt-3 flex max-h-[50vh] flex-col gap-2 overflow-y-scroll">
                    <div className={cn("flex flex-col gap-2")}>
                      {transactions.steps.map((txOptions, txIndex) => {
                        const key = `transaction:${txOptions.id}`;
                        return (
                          <TransactionRow
                            key={key}
                            transactionIndex={txIndex + 1}
                            transaction={txOptions}
                          />
                        );
                      })}
                    </div>
                  </div>
                </DropdownAnimationWrapper>
              </div>
            )}

          {/**
           * Transaction Action Button
           */}
          {!isTxSuccess && (
            <div className="mt-3">
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
                      className={cn("h-10 w-full rounded-sm")}
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chainId !== transaction?.chainId) {
                  return (
                    <Button
                      onClick={async () => {
                        try {
                          // @ts-ignore
                          await switchChain(config, {
                            chainId: transaction?.chainId,
                          });
                        } catch (error) {
                          toast.custom(
                            <ErrorAlert message="Error switching chain" />
                          );
                          console.log("Failed:", error);
                        }
                      }}
                      size="sm"
                      className={cn("h-10 w-full rounded-sm")}
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
                      className={cn("h-10 w-full rounded-sm")}
                      disabled={isTxLoading}
                    >
                      {isTxLoading ? (
                        <LoadingCircle className="h-5 w-5" />
                      ) : (
                        "Confirm Transaction"
                      )}
                    </Button>
                  );
                }
              })()}

              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="mt-2 h-10 w-full justify-center rounded-sm"
                disabled={isTxLoading}
              >
                <div className="text-error">Cancel</div>
              </Button>
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

          {/**
           * Transaction Keep Window Open
           */}
          <SecondaryLabel className="justify-center text-xs font-normal">
            Keep window open until complete.
          </SecondaryLabel>
        </DialogContent>
      )}
    </Dialog>
  );
});
