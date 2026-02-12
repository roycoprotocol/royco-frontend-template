"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "@/components/composables";
import formatNumber from "@/utils/numbers";
import { Button } from "@/components/ui/button";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { getSupportedToken } from "royco/constants";
import { BERA_TOKEN_ID } from "royco/boyco";
import { useMarketManager } from "@/store/use-market-manager";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import {
  loadableEnrichedMarketAtom,
  loadableSpecificBoycoPositionAtom,
} from "@/store/market";
import { withdrawBoycoReceiptTokenTxOptions } from "royco/transaction";

export const BoycoWithdrawSectionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex grow flex-col", className)}
      {...props}
    ></div>
  );
});

export const BoycoWithdrawSectionRowContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-row justify-between gap-3 rounded-2xl border border-divider bg-z2 p-3 font-light transition-all duration-200 ease-in-out hover:bg-focus",
        className
      )}
      {...props}
    />
  );
});

export const BoycoWithdrawSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const { address } = useAccount();
  const { transactions, setTransactions } = useMarketManager();

  const propsBoycoPosition = useAtomValue(loadableSpecificBoycoPositionAtom);

  const isLoading = propsBoycoPosition.isLoading;

  // if (enrichedMarket?.lockupTime !== "2592000") {
  //   return (
  //     <div
  //       ref={ref}
  //       className={cn(
  //         "flex h-fit flex-1 grow flex-col items-center gap-2",
  //         className
  //       )}
  //       {...props}
  //     >
  //       <BoycoWithdrawSectionRowContainer className="flex flex-col">
  //         <div>Withdrawal is available from boyco.berachain.com</div>
  //         <Button
  //           size="sm"
  //           className="h-fit w-full rounded-lg px-4 py-2 text-sm font-normal"
  //           onClick={() => {
  //             const redirect_link = `https://boyco.berachain.com/`;

  //             window.open(redirect_link, "_blank", "noopener,noreferrer");
  //           }}
  //         >
  //           <div className="flex flex-row items-center gap-2">
  //             Go to boyco.berachain.com
  //             <ExternalLinkIcon className="h-4 w-4" />
  //           </div>
  //         </Button>
  //       </BoycoWithdrawSectionRowContainer>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (!address) {
    return (
      <div className="h-full w-full place-content-center items-start">
        <AlertIndicator>Wallet not connected</AlertIndicator>
      </div>
    );
  }

  if (
    propsBoycoPosition.data &&
    propsBoycoPosition.data.inputToken.rawAmount === "0"
  ) {
    return (
      <div className="h-full w-full place-content-center items-start">
        <AlertIndicator>No withdrawable positions found</AlertIndicator>
      </div>
    );
  }

  // if (enrichedMarket?.lockupTime !== "2592000") {
  //   return (
  //     <div
  //       ref={ref}
  //       className={cn(
  //         "flex h-fit flex-1 grow flex-col items-center gap-2",
  //         className
  //       )}
  //       {...props}
  //     >
  //       <BoycoWithdrawSectionRowContainer className="flex flex-col">
  //         <div>Withdrawal is available from boyco.berachain.com</div>
  //         <Button
  //           size="sm"
  //           className="h-fit w-full rounded-lg px-4 py-2 text-sm font-normal"
  //           onClick={() => {
  //             const redirect_link = `https://boyco.berachain.com/`;

  //             window.open(redirect_link, "_blank", "noopener,noreferrer");
  //           }}
  //         >
  //           <div className="flex flex-row items-center gap-2">
  //             Go to boyco.berachain.com
  //             <ExternalLinkIcon className="h-4 w-4" />
  //           </div>
  //         </Button>
  //       </BoycoWithdrawSectionRowContainer>
  //     </div>
  //   );
  // }

  return (
    <div
      ref={ref}
      className={cn("flex h-fit flex-1 grow flex-col gap-2", className)}
      {...props}
    >
      <div className="text-sm font-normal text-secondary">Receipt Token</div>

      {propsBoycoPosition.data?.lockedInputToken.map((position) => {
        return (
          <BoycoWithdrawSectionRowContainer
            key={`boyco-withdraw-position-${position.weirollWallet}`}
          >
            <div className="flex grow flex-col overflow-hidden truncate text-ellipsis">
              <div className="flex flex-wrap text-wrap">
                {position.breakdown.map((token) => token.symbol).join(", ")}
              </div>

              <div className="flex flex-wrap text-wrap">
                {position.breakdown.map((token) => {
                  return (
                    <div
                      key={`boyco-withdraw-position-${position.weirollWallet}-${token.id}`}
                      className="grow overflow-hidden truncate text-ellipsis text-xs font-normal text-tertiary"
                    >
                      {formatNumber(token.tokenAmount, {
                        type: "number",
                      })}{" "}
                      {token.symbol.length > 10
                        ? `${token.symbol.slice(0, 10)}...`
                        : token.symbol}{" "}
                      {`(${formatNumber(token.tokenAmountUsd, {
                        type: "currency",
                      })})`}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-1 grow flex-col items-center justify-center">
              <Button
                size="sm"
                className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
                onClick={() => {
                  const txOptions = withdrawBoycoReceiptTokenTxOptions({
                    amountDeposited: position.amountDeposited,
                    merkleDepositNonce: position.merkleDepositNonce,
                    merkleProof: position.merkleProof,
                    weirollWallet: position.weirollWallet,
                  });

                  setTransactions(txOptions);
                }}
              >
                Withdraw
              </Button>
            </div>
          </BoycoWithdrawSectionRowContainer>
        );
      })}

      {/* <div className="flex w-full flex-row items-center justify-center gap-2 rounded-xl border border-divider bg-z2 p-3 transition-all duration-200 ease-in-out hover:bg-focus">
        <InfoIcon
          strokeWidth={1.5}
          className="h-5 w-5 shrink-0 fill-tertiary stroke-z2"
        />
        <div className="flex-1 text-sm font-light leading-tight text-secondary">
          You can redeem your receipt tokens for underlying tokens from Dapp's
          page.{" "}
          {propsBoycoPosition.data?.dappLink && (
            <>
              Click{" "}
              <a
                href={propsBoycoPosition.data?.dappLink ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-black underline decoration-secondary decoration-dotted decoration-2 underline-offset-2 duration-200 ease-in-out hover:opacity-80"
              >
                here
              </a>{" "}
              to go to Dapp's page.
            </>
          )}
        </div>
      </div> */}

      {/* <div className="my-2 h-px w-full rounded-full bg-divider" />

      <div className="text-sm font-normal text-secondary">
        Underlying Incentives
      </div>

      <BoycoWithdrawSectionRowContainer>
        <TokenDisplayer
          tokens={[getSupportedToken(BERA_TOKEN_ID)]}
          symbols={true}
        />

        <Button
          onClick={() => {
            const redirect_link = `/claim/berachain/80094/${propsBoycoPosition.data?.merkleLink}`;
            window.open(redirect_link, "_blank", "noopener,noreferrer");
          }}
          className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
          size="sm"
        >
          Claim
        </Button>
      </BoycoWithdrawSectionRowContainer> */}

      {/* <div className="my-2 h-px w-full rounded-full bg-divider" />

      <div className="text-sm font-normal text-secondary">
        Native Incentives
      </div>

      <BoycoWithdrawSectionRowContainer>
        <TokenDisplayer
          tokens={propsBoycoPosition.data?.nativeIncentives ?? []}
          symbols={true}
        />

        <Button
          onClick={() => {
            const redirect_link = propsBoycoPosition.data?.dappLink ?? "";

            window.open(redirect_link, "_blank", "noopener,noreferrer");
          }}
          className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
          size="sm"
        >
          View
        </Button>
      </BoycoWithdrawSectionRowContainer> */}
    </div>
  );
});
