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
  getVaultInputTokenWithdrawalByAssetTransactionOptions,
  getVaultInputTokenWithdrawalTransactionOptions,
} from "royco/hooks";
import {
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTextToFormattedValue,
  parseTokenAmountToRawAmount,
} from "royco/utils";
import { SupportedToken } from "royco/constants";
import { InputAmountSelector } from "../params-step/composables";
import { SecondaryLabel, TertiaryLabel } from "../../composables";
import { SpringNumber } from "@/components/composables";
import { WarningAlert } from "../params-step/composables/warning-alert";
import { SlideUpWrapper } from "@/components/animations";

interface VaultWithdrawModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  position: {
    token_data: SupportedToken & {
      raw_amount: string;
      token_amount: number;
      token_amount_usd: number;
      shares: string;
    };
  };
  marketId: string;
  chainId: number;
}

export const VaultWithdrawModal = React.forwardRef<
  HTMLDivElement,
  VaultWithdrawModalProps
>(({ isOpen, onOpenChange, position, marketId, chainId }, ref) => {
  const { address } = useAccount();
  const { setTransactions } = useMarketManager();

  const [amount, setAmount] = useState("");
  const maxAmount = parseRawAmount(position.token_data.raw_amount ?? "0");

  const isAmountExceedingPosition =
    parseFloat(amount) >
    parseRawAmountToTokenAmount(maxAmount, position.token_data.decimals ?? 0);

  const handleWithdraw = () => {
    if (!address || !amount) return;

    try {
      const rawAmount = parseTokenAmountToRawAmount(
        amount,
        position.token_data.decimals
      );

      const contractOptions =
        getVaultInputTokenWithdrawalByAssetTransactionOptions({
          chain_id: chainId,
          market_id: marketId,
          account: address.toLowerCase(),
          position: {
            token_data: {
              ...position.token_data,
              raw_amount: rawAmount,
              token_amount: parseRawAmountToTokenAmount(
                rawAmount,
                position.token_data.decimals
              ),
              token_amount_usd:
                position.token_data.price *
                parseRawAmountToTokenAmount(
                  rawAmount,
                  position.token_data.decimals
                ),
            },
          },
        });

      setTransactions([contractOptions]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
  };

  const handleWithdrawAll = () => {
    if (!address) return;

    try {
      const contractOptions = getVaultInputTokenWithdrawalTransactionOptions({
        chain_id: chainId,
        market_id: marketId,
        account: address.toLowerCase(),
        position,
      });

      setTransactions([contractOptions]);
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
                  position.token_data.decimals ?? 0
                )}
                currentValue={parseRawAmountToTokenAmount(
                  maxAmount,
                  position.token_data.decimals ?? 0
                )}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "standard",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                  useGrouping: true,
                }}
              />
              <span className="ml-1">
                {position.token_data.symbol?.toUpperCase()}
              </span>
            </TertiaryLabel>
          </div>

          <InputAmountSelector
            containerClassName="mt-2"
            currentValue={amount}
            setCurrentValue={setAmount}
            Suffix={() => (
              <TokenDisplayer
                size={4}
                tokens={[position.token_data]}
                symbols={true}
              />
            )}
          />

          {isAmountExceedingPosition && (
            <SlideUpWrapper
              layout="position"
              layoutId="motion:market:warning-alert:withdraw"
              className="mt-3"
              delay={0.4}
            >
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
                  {`Withdraw ${parseTextToFormattedValue(amount) || "0"} ${position.token_data.symbol?.toUpperCase()}`}
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
