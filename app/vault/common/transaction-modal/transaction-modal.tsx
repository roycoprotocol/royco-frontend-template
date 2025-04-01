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
import { ChevronsUpDown } from "lucide-react";

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
    setTransaction(null);

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 100);
  };

  const dialogTitle = useMemo(() => {
    if (transaction?.type === "deposit") {
      return "Deposit";
    } else if (transaction?.type === "withdraw") {
      return "Withdraw";
    }
  }, [transaction]);

  const isTxLoading = useMemo(() => {
    return transaction?.txStatus === "loading";
  }, [transaction]);

  const isTxSuccess = useMemo(() => {
    return transaction?.txStatus === "success";
  }, [transaction]);

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
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          {!!transaction?.description && (
            <div className="mt-4">
              {!!transaction?.description.title && (
                <SecondaryLabel className="text-xs font-medium">
                  {transaction?.description.title}
                </SecondaryLabel>
              )}

              <PrimaryLabel className="mt-2 text-sm font-normal">
                {transaction?.description.description}
              </PrimaryLabel>
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

          <BoringVaultActionButton
            onSuccess={() => {
              triggerConfetti();
            }}
            className="mt-3"
          />

          {!isTxSuccess ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="justify-center"
              disabled={isTxLoading}
            >
              <div className="text-error">Cancel</div>
            </Button>
          ) : (
            <Button onClick={handleClose} size="sm">
              Close
            </Button>
          )}

          <SecondaryLabel className="justify-center text-xs font-normal">
            Keep window open until complete.
          </SecondaryLabel>
        </DialogContent>
      )}
    </Dialog>
  );
});
