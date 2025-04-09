"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { CheckCircleIcon, ChevronsUpDown } from "lucide-react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { useEthersSigner } from "@/app/vault/hook/useEthersSigner";
import { config } from "@/components/rainbow-modal/modal-config";
import { useVaultManager } from "@/store/vault/use-vault-manager";
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
import { LoadingSpinner } from "@/components/composables";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";

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

export const TransactionModal = React.forwardRef<
  HTMLDivElement,
  TransactionModalProps
>(({ className, onSuccess, onError, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTransactionBreakdown, setShowTransactionBreakdown] =
    useState(true);

  const { transactions, setTransactions } = useVaultManager();
  const signer = useEthersSigner();

  useEffect(() => {
    setIsOpen(transactions !== null && transactions !== undefined);

    if (transactions === null || transactions === undefined) {
      setIsOpen(false);
    }
  }, [transactions]);

  const { address, chainId } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const { data } = useAtomValue(vaultMetadataAtom);

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

  const handleAction = async () => {
    if (!address || !signer) {
      return;
    }

    if (!transaction || !transaction.data) {
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
          className={cn("sm:max-w-[425px]", className)}
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
            <div
              className={cn(
                "flex flex-col gap-2",
                isTxSuccess ? "items-center" : "items-start"
              )}
            >
              {isTxSuccess && (
                <SlideUpWrapper
                  layoutId={`transaction-modal-success-icon-${isTxSuccess}`}
                >
                  <CheckCircleIcon
                    strokeWidth={2}
                    className="h-6 w-6 p-[0.2rem] text-success"
                  />
                </SlideUpWrapper>
              )}

              <SlideUpWrapper
                layoutId={`transaction-modal-title-${isTxSuccess}`}
              >
                <DialogTitle>{transactions?.title}</DialogTitle>
              </SlideUpWrapper>

              <SlideUpWrapper
                layoutId={`transaction-modal-token-displayer-${isTxSuccess}`}
              >
                <div className="flex items-center gap-1">
                  <TokenDisplayer
                    size={4}
                    tokens={[transactions?.token.data]}
                    symbols={false}
                  />

                  <span className="text-base font-normal">
                    {formatNumber(transactions?.token.amount, {
                      type: "number",
                    })}
                  </span>

                  <span className="text-base font-normal">
                    {transactions?.token.data.symbol}
                  </span>
                </div>
              </SlideUpWrapper>
            </div>
          </DialogHeader>

          {/**
           * Transaction Description
           */}
          {transactions?.description &&
            transactions?.description.length > 0 && (
              <div className="mt-4 flex flex-col gap-6">
                {transactions?.description?.map((item: any) => (
                  <div>
                    {item.label && (
                      <SecondaryLabel className="text-xs font-medium">
                        {item.label}
                      </SecondaryLabel>
                    )}

                    <PrimaryLabel className="mt-2 text-sm font-normal">
                      {item.value}
                    </PrimaryLabel>
                  </div>
                ))}
              </div>
            )}

          {/**
           * Transaction Breakdown
           */}
          {transactions &&
            transactions.steps &&
            transactions.steps.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <SecondaryLabel className="text-xs font-medium">
                    Transaction Steps
                  </SecondaryLabel>

                  <PrimaryLabel
                    onClick={() => {
                      setShowTransactionBreakdown(!showTransactionBreakdown);
                    }}
                    className="cursor-pointer text-xs font-medium"
                  >
                    <div className="flex items-center gap-1">
                      <span>Show {transactions?.steps.length} Steps</span>

                      <motion.div
                        animate={{ rotate: showTransactionBreakdown ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronsUpDown className="h-4 w-4 text-secondary" />
                      </motion.div>
                    </div>
                  </PrimaryLabel>
                </div>

                <AnimatePresence>
                  {showTransactionBreakdown && (
                    <DropdownAnimationWrapper>
                      <div className="mt-3 flex max-h-[50vh] flex-col gap-2 overflow-y-scroll">
                        <div className={cn("flex flex-col gap-2")}>
                          {transactions.steps.map(
                            (txOptions: any, txIndex: any) => {
                              const key = `transaction:${txOptions.id}`;
                              return (
                                <TransactionRow
                                  key={key}
                                  transactionIndex={txIndex + 1}
                                  transaction={txOptions}
                                />
                              );
                            }
                          )}
                        </div>
                      </div>
                    </DropdownAnimationWrapper>
                  )}
                </AnimatePresence>
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
                      className={cn("w-full", className)}
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
                      className={cn("w-full", className)}
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
                      className={cn("w-full", className)}
                      disabled={isTxLoading}
                    >
                      {isTxLoading ? (
                        <LoadingSpinner className="h-5 w-5" />
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
                className="mt-2 w-full justify-center"
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
              className="mt-3 w-full justify-center"
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
