import { cn } from "@/lib/utils";
import { ModalTxOption } from "@/types";
import { Check, ExternalLink } from "lucide-react";
import React from "react";
import { getExplorerUrl } from "royco/utils";

export const TransactionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    transactionIndex: number;
    transaction: ModalTxOption;
  }
>(({ className, transaction, transactionIndex, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-sm border border-_divider_ p-2",
        className
      )}
      {...props}
    >
      {/**
       * Index
       */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-_surface_tertiary">
        <div className="text-sm font-normal text-_primary_">
          {transactionIndex}
        </div>
      </div>

      {/**
       * Details
       */}
      <div className="grow text-left">
        <div className="text-base font-normal text-_primary_">
          {transaction.label}
        </div>
      </div>

      {transaction.txHash && (
        <a
          href={getExplorerUrl({
            chainId: transaction.chainId,
            value: transaction.txHash || "",
            type: "tx",
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-5 w-5 items-center justify-center rounded"
        >
          <ExternalLink className="h-5 w-5 text-_primary_" strokeWidth={2.5} />
        </a>
      )}

      {transaction.txStatus === "success" && (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-_primary_">
          <Check className="h-3 w-3 text-white" strokeWidth={5} />
        </div>
      )}
    </div>
  );
});
