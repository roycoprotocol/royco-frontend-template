import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import React from "react";

export const TransactionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    transactionIndex: number;
    transaction: {
      type: string;
      label: string;
    };
    txStatus?: string;
  }
>(({ className, transaction, transactionIndex, txStatus, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl border border-divider bg-white p-2",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-row">
        {/**
         * Transaction Index
         */}
        <div className="flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-md border border-divider">
          <div
            className={cn(
              "flex h-4",
              "font-gt text-sm font-light leading-4 text-black"
            )}
          >
            {transactionIndex}
          </div>
        </div>

        {/**
         * Transaction Details
         */}
        <div className="flex grow flex-col items-center pl-3 text-left ">
          {/**
           * Transaction Title
           */}
          <div className="flex h-6 w-full shrink-0 grow flex-col place-content-center items-center">
            <div className="w-full items-start text-left font-gt text-sm font-light text-black">
              {transaction.label}
            </div>
          </div>
        </div>

        <div className="flex h-6 w-6 flex-col place-content-center items-center">
          {txStatus === "success" && (
            <CheckCircleIcon
              strokeWidth={2}
              className="h-6 w-6 p-[0.2rem] text-success"
            />
          )}
        </div>
      </div>

      {/* {transaction.txHash && (
        <div className="mt-2 flex w-full flex-row place-content-end items-center">
          <BadgeLink
            size="sm"
            target="_blank"
            href={getExplorerUrl({
              chainId: transaction.chainId,
              value: transaction.txHash,
              type: "tx",
            })}
            text="View on Explorer"
            className="text-sm"
          />
        </div>
      )} */}
    </div>
  );
});
