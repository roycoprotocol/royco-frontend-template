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
    txStatus?: "loading" | "error" | "success";
  }
>(({ className, transaction, transactionIndex, txStatus, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-divider bg-white p-2",
        className
      )}
      {...props}
    >
      {/**
       * Index
       */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-divider">
        <div className="font-gt text-sm font-light text-primary">
          {transactionIndex}
        </div>
      </div>

      {/**
       * Details
       */}
      <div className="grow text-left">
        <div className="font-gt text-sm font-light text-primary">
          {transaction.label}
        </div>
      </div>

      {txStatus === "success" && (
        <CheckCircleIcon
          strokeWidth={2}
          className="h-6 w-6 p-[0.2rem] text-success"
        />
      )}
    </div>
  );
});
