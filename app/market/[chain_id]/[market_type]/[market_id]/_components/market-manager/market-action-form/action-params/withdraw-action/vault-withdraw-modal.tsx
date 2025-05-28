"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenDisplayer } from "@/components/common";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useMarketManager } from "@/store";
import {
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTextToFormattedValue,
  parseTokenAmountToRawAmount,
} from "royco/utils";
import { SpringNumber } from "@/components/composables";
import { SlideUpWrapper } from "@/components/animations";
import { SecondaryLabel, TertiaryLabel } from "../../../../composables";
import { WarningAlert } from "../composables/warning-alert";
import { InputAmountSelector } from "../composables";
import { LockedInputTokenSpecificVaultPosition } from "royco/api";
import {
  withdrawVaultInputTokenByAssetsTxOptions,
  withdrawVaultInputTokenBySharesTxOptions,
} from "royco/transaction";

interface VaultWithdrawModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  position: {
    chainId: number;
    vaultAddress: string;
    tokenData: LockedInputTokenSpecificVaultPosition;
  };
}

export const VaultWithdrawModal = React.forwardRef<
  HTMLDivElement,
  VaultWithdrawModalProps
>(({ isOpen, onOpenChange, position }, ref) => {
  const { address } = useAccount();
  const { setTransactions } = useMarketManager();

  const [amount, setAmount] = useState("");
  const maxAmount = parseRawAmount(position.tokenData.rawAmount);

  const isAmountExceedingPosition =
    parseFloat(amount) >
    parseRawAmountToTokenAmount(maxAmount, position.tokenData.decimals);

  const handleWithdraw = () => {
    if (!address || !amount) return;

    try {
      const rawAmount = parseTokenAmountToRawAmount(
        amount,
        position.tokenData.decimals
      );

      const contractOptions = withdrawVaultInputTokenByAssetsTxOptions({
        chainId: position.chainId,
        vaultAddress: position.vaultAddress,
        accountAddress: address?.toLowerCase(),
        rawAmount: rawAmount,
      });

      setTransactions(contractOptions);
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
  };

  const handleWithdrawAll = () => {
    if (!address) return;

    try {
      const contractOptions = withdrawVaultInputTokenBySharesTxOptions({
        chainId: position.chainId,
        vaultAddress: position.vaultAddress,
        accountAddress: address?.toLowerCase(),
        shares: position.tokenData.shares,
      });

      setTransactions(contractOptions);
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" ref={ref}>
        <DialogHeader>
          <DialogTitle>Withdraw Position</DialogTitle>
          <DialogDescription>
            Enter amount to withdraw from your position.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col py-4">
          <div className="flex justify-between text-sm">
            <SecondaryLabel>Amount</SecondaryLabel>
            <TertiaryLabel>
              Available:{" "}
              <SpringNumber
                className="ml-1"
                defaultColor="text-tertiary"
                previousValue={parseRawAmountToTokenAmount(
                  maxAmount,
                  position.tokenData.decimals
                )}
                currentValue={parseRawAmountToTokenAmount(
                  maxAmount,
                  position.tokenData.decimals
                )}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "standard",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                  useGrouping: true,
                }}
              />
              <span className="ml-1">{position.tokenData.symbol}</span>
            </TertiaryLabel>
          </div>

          <InputAmountSelector
            containerClassName="mt-2"
            currentValue={amount}
            setCurrentValue={setAmount}
            Suffix={() => (
              <TokenDisplayer
                size={4}
                tokens={[position.tokenData]}
                symbols={true}
              />
            )}
          />

          {isAmountExceedingPosition && (
            <SlideUpWrapper className="mt-3" delay={0.4}>
              <WarningAlert>
                WARNING: You don't have sufficient balance.
              </WarningAlert>
            </SlideUpWrapper>
          )}

          <div className="mt-5 flex flex-col gap-2">
            <DialogClose asChild>
              <Button
                onClick={handleWithdraw}
                disabled={
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  isAmountExceedingPosition
                }
                className="h-9 text-sm"
              >
                <div className="h-5">
                  {`Withdraw ${parseTextToFormattedValue(amount) || "0"} ${position.tokenData.symbol}`}
                </div>
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                onClick={handleWithdrawAll}
                className="h-9 bg-error text-sm"
              >
                <div className="h-5">Withdraw All</div>
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

VaultWithdrawModal.displayName = "VaultWithdrawModal";
