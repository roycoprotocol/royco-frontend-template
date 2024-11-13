import { cn } from "@/lib/utils";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import React, { Fragment } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { TransactionOptionsType } from "@/sdk/types";
import { BigNumber } from "ethers";
import { BadgeLink, ContentBadge, TokenDisplayer } from "@/components/common";
import { getExplorerUrl } from "@/sdk/utils";

export const TransactionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    transactionIndex: number;
    txStatus: string;
    transaction: TransactionOptionsType;
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
            className={cn("flex h-4", "font-gt text-sm font-light text-black")}
          >
            <span className="leading-5">{transactionIndex}</span>
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
            <div className="h-4 w-full items-start text-left font-gt text-sm font-light text-black">
              <span className="leading-5">{transaction.label}</span>
            </div>
          </div>

          {(!!transaction.tokensOut || !!transaction.tokensIn) && (
            <div className="mt-2 flex w-full flex-row flex-wrap gap-2">
              {transaction.tokensOut &&
                transaction.tokensOut.map((token, tokenIndex) => {
                  const key = `token-out:${token.id}:${tokenIndex}`;
                  return (
                    <ContentBadge key={key}>
                      <div className="h-4 font-gt text-xs font-300 text-secondary">
                        <span className="leading-5">
                          -
                          {`${new Intl.NumberFormat("en-US", {
                            notation: "standard",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }).format(
                            token.token_amount
                          )} ${token.symbol.toUpperCase()}`}
                        </span>
                      </div>
                    </ContentBadge>
                  );
                })}

              {transaction.tokensIn &&
                transaction.tokensIn.map((token, tokenIndex) => {
                  const key = `token-in:${token.id}:${tokenIndex}`;
                  return (
                    <ContentBadge key={key}>
                      <div className="h-4 font-gt text-xs font-300 text-secondary">
                        <span className="leading-5">
                          +
                          {`${new Intl.NumberFormat("en-US", {
                            notation: "standard",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }).format(
                            token.token_amount
                          )} ${token.symbol.toUpperCase()}`}
                        </span>
                      </div>
                    </ContentBadge>
                  );
                })}
            </div>
          )}

          {/* <div className="flex hidden w-full flex-col font-gt text-sm font-300 text-error">
          {!!transaction.tokensOut &&
            transaction.tokensOut.map((token, tokenIndex) => {
              return (
                <div className="flex flex-row items-center space-x-2">
                  <div className="h-4">
                    -
                    {Intl.NumberFormat("en-US", {
                      useGrouping: true, // Ensures grouping with commas
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(parseFloat(token.token_amount))}
                  </div>
                  <TokenDisplayer
                    symbolClassName="text-error"
                    size={4}
                    tokens={[token]}
                    symbols={true}
                  />
                </div>
              );
            })}
        </div> */}
        </div>

        <div className="flex h-6 w-6 flex-col place-content-center items-center">
          {transaction.txStatus === "success" && (
            <CheckCircleIcon
              strokeWidth={2}
              className="h-6 w-6 p-[0.2rem] text-success"
            />
          )}

          {(txStatus === "success" || txStatus === "pending") &&
            transaction.txStatus === "pending" && (
              <LoadingSpinner className="h-5 w-5" />
            )}

          {transaction.txStatus === "error" && (
            <AlertCircleIcon className="h-6 w-6 p-[0.2rem] text-error" />
          )}
        </div>
      </div>

      {transaction.txHash && (
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
      )}
    </div>
  );
});
