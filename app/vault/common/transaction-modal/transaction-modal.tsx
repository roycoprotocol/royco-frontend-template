"use client";

import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";

import { useVaultManager } from "@/store/vault/use-vault-manager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BoringVaultActionButton } from "./action/boring-vault-action";
import { TransactionRow } from "./transaction-row";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CheckCircleIcon, ChevronsUpDown } from "lucide-react";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";

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

export const TransactionModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTransactionBreakdown, setShowTransactionBreakdown] =
    useState(true);

  const { transaction, setTransaction } = useVaultManager();

  useEffect(() => {
    setIsOpen(transaction !== null && transaction !== undefined);

    if (transaction === null || transaction === undefined) {
      setIsOpen(false);
    }
  }, [transaction]);

  const triggerConfetti = () => {
    const defaults = {
      startVelocity: 14,
      spread: 360,
      ticks: 300,
      zIndex: 9999,
      particleCount: 30,
      scalar: 0.8,
      gravity: 0.5,
      drift: 0,
      decay: 0.96,
    };

    let animationFrame: number;
    const shower = () => {
      const particleCount = 8;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: -0.1 },
      });

      animationFrame = requestAnimationFrame(shower);

      setTimeout(() => {
        cancelAnimationFrame(animationFrame);
      }, 500);
    };

    shower();
  };

  const handleClose = () => {
    setIsOpen(false);
    // @ts-ignore
    setTransaction(null);

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  };

  const isTxLoading = useMemo(() => {
    return transaction?.txStatus === "loading";
  }, [transaction]);

  const isTxSuccess = useMemo(() => {
    return transaction?.txStatus === "success";
  }, [transaction]);

  const dialogTitle = useMemo(() => {
    if (transaction?.type === "deposit") {
      if (isTxSuccess) {
        return "Deposit Completed";
      } else {
        return "Deposit";
      }
    } else if (transaction?.type === "withdraw") {
      if (isTxSuccess) {
        return "Withdraw Submitted";
      } else {
        return "Withdraw";
      }
    }
  }, [transaction, isTxSuccess]);

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
                <DialogTitle>{dialogTitle}</DialogTitle>
              </SlideUpWrapper>

              <SlideUpWrapper
                layoutId={`transaction-modal-token-displayer-${isTxSuccess}`}
              >
                <div className="flex items-center gap-1">
                  <TokenDisplayer
                    size={4}
                    tokens={[transaction?.form.token]}
                    symbols={false}
                  />

                  <span className="text-base font-normal">
                    {formatNumber(transaction?.form.amount, {
                      type: "number",
                    })}
                  </span>

                  <span className="text-base font-normal">
                    {transaction?.form.token.symbol}
                  </span>
                </div>
              </SlideUpWrapper>
            </div>
          </DialogHeader>

          {/**
           * Transaction Description
           */}
          {transaction?.description && transaction?.description.length > 0 && (
            <div className="mt-4 flex flex-col gap-6">
              {transaction?.description?.map((item: any) => (
                <div>
                  {!!item.title && (
                    <SecondaryLabel className="text-xs font-medium">
                      {item.title}
                    </SecondaryLabel>
                  )}

                  <PrimaryLabel className="mt-2 text-sm font-normal">
                    {item.description}
                  </PrimaryLabel>
                </div>
              ))}
            </div>
          )}

          {/**
           * Transaction Breakdown
           */}
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
                  <span>Show {transaction?.steps.length} Steps</span>

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
                      {!!transaction &&
                        !!transaction.steps &&
                        transaction.steps.map(
                          (txOptions: any, txIndex: any) => {
                            if (!!txOptions) {
                              const key = `transaction:${txOptions.id}`;

                              return (
                                <TransactionRow
                                  key={key}
                                  transactionIndex={txIndex + 1}
                                  transaction={txOptions}
                                  txStatus={transaction?.txStatus}
                                />
                              );
                            }
                          }
                        )}
                    </div>
                  </div>
                </DropdownAnimationWrapper>
              )}
            </AnimatePresence>
          </div>

          {/**
           * Transaction Action Button
           */}
          {!isTxSuccess && (
            <div className="mt-3">
              <BoringVaultActionButton
                onSuccess={() => {
                  triggerConfetti();
                }}
              />

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
