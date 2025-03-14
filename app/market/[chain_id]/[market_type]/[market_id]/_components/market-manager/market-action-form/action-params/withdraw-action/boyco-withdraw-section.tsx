"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveMarket } from "../../../../hooks";
import { useEnrichedPositionsBoyco } from "royco/hooks";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "@/components/composables";
import { ScrollArea } from "@/components/ui/scroll-area";
import formatNumber from "@/utils/numbers";
import { Button } from "@/components/ui/button";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { getSupportedToken } from "royco/constants";
import { BERA_TOKEN_ID } from "royco/boyco";
import { getBoycoReceiptTokenWithdrawalTransactionOptions } from "royco/hooks";
import { useMarketManager } from "@/store/use-market-manager";
import { InfoIcon } from "lucide-react";

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
  const page_size = 100;
  const [page, setPage] = useState(0);
  const { currentMarketData } = useActiveMarket();
  const { address } = useAccount();

  const { transactions, setTransactions } = useMarketManager();

  const propsPositionsBoyco = useEnrichedPositionsBoyco({
    account_address: address?.toLowerCase() ?? "",
    market_id: currentMarketData?.market_id ?? undefined,
    // account_address: "0x6a0e42510bc58e5e65edb219f4f9ca7cca2ed918",
    // market_id:
    //   "0x6262ac035c2284f5b5249a690a6fd81c35f1ecef501da089f25741a4492cf5f3",
    page_index: page,
    page_size,
  });

  const isUnlocked =
    propsPositionsBoyco?.data?.data?.some(
      (position) =>
        position.unlock_timestamp &&
        Number(position.unlock_timestamp) < new Date().getTime() / 1000
    ) ?? false;

  if (propsPositionsBoyco.isLoading) {
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
      <AlertIndicator className="w-full rounded-md">
        Wallet not connected
      </AlertIndicator>
    );
  }

  if (
    !propsPositionsBoyco.data?.data ||
    propsPositionsBoyco.data?.data?.length === 0
  ) {
    return (
      <AlertIndicator className="w-full rounded-md">
        No withdrawable positions found
      </AlertIndicator>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex h-fit flex-1 grow flex-col gap-2", className)}
      {...props}
    >
      <div className="text-sm font-normal text-secondary">Receipt Token</div>

      {propsPositionsBoyco.data?.data?.map((position) => {
        const isUnlocked =
          position.unlock_timestamp &&
          Number(position.unlock_timestamp) < new Date().getTime() / 1000;

        const isWithdrawn = position.is_withdrawn;

        const isDisabled = isWithdrawn || !isUnlocked;

        return (
          <BoycoWithdrawSectionRowContainer
            key={`boyco-withdraw-position-${position.id}`}
          >
            <div className="flex grow flex-col overflow-hidden truncate text-ellipsis">
              <div className="flex flex-wrap text-wrap">
                {position.incentive_token_datas
                  .map((token) => token.symbol)
                  .join(", ")}
              </div>

              <div className="flex flex-wrap text-wrap">
                {position.incentive_token_datas.map((token) => {
                  return (
                    <div
                      key={`boyco-withdraw-position-${position.id}-${token.id}`}
                      className="grow overflow-hidden truncate text-ellipsis text-xs font-normal text-tertiary"
                    >
                      {formatNumber(token.token_amount, {
                        type: "number",
                      })}{" "}
                      {token.symbol.length > 10
                        ? `${token.symbol.slice(0, 10)}...`
                        : token.symbol}{" "}
                      {`(${formatNumber(token.token_amount_usd, {
                        type: "currency",
                      })})`}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-1 grow flex-col items-center justify-center">
              <Button
                disabled={isDisabled}
                size="sm"
                className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
                onClick={() => {
                  const contractOptions =
                    getBoycoReceiptTokenWithdrawalTransactionOptions({
                      position,
                    });

                  setTransactions([contractOptions]);
                }}
              >
                {isUnlocked
                  ? isWithdrawn
                    ? "Withdrawn"
                    : "Withdraw"
                  : "Locked"}
              </Button>
            </div>
          </BoycoWithdrawSectionRowContainer>
        );
      })}

      <div className="flex w-full flex-row items-center justify-center gap-2 rounded-xl border border-divider bg-z2 p-3 transition-all duration-200 ease-in-out hover:bg-focus">
        <InfoIcon
          strokeWidth={1.5}
          className="h-5 w-5 shrink-0 fill-tertiary stroke-z2"
        />
        <div className="flex-1 text-sm font-light leading-tight text-secondary">
          You can redeem your receipt tokens for underlying tokens from Dapp's
          page.{" "}
          {currentMarketData.boyco?.native_incentive_link && (
            <>
              Click{" "}
              <a
                href={currentMarketData.boyco?.native_incentive_link ?? ""}
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
      </div>

      {propsPositionsBoyco.data?.data?.length > 0 && (
        <>
          <div className="my-2 h-px w-full rounded-full bg-divider" />

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
                const redirect_link = `/claim/berachain/80094/${currentMarketData.boyco?.bera_merkle_id}`;

                window.open(redirect_link, "_blank", "noopener,noreferrer");
              }}
              disabled={
                !isUnlocked && !!currentMarketData.boyco?.bera_merkle_id
              }
              className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
              size="sm"
            >
              {isUnlocked && !!currentMarketData.boyco?.bera_merkle_id
                ? "Claim"
                : "Locked"}
            </Button>
          </BoycoWithdrawSectionRowContainer>

          <div className="my-2 h-px w-full rounded-full bg-divider" />

          <div className="text-sm font-normal text-secondary">
            Native Incentives
          </div>

          <BoycoWithdrawSectionRowContainer>
            <TokenDisplayer
              tokens={propsPositionsBoyco.data?.data?.[0].token_1_datas}
              symbols={true}
            />

            <Button
              onClick={() => {
                const redirect_link =
                  currentMarketData.boyco?.native_incentive_link ?? "";

                window.open(redirect_link, "_blank", "noopener,noreferrer");
              }}
              disabled={
                !isUnlocked && !!currentMarketData.boyco?.native_incentive_link
              }
              className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
              size="sm"
            >
              {isUnlocked && !!currentMarketData.boyco?.native_incentive_link
                ? "View"
                : "Locked"}
            </Button>
          </BoycoWithdrawSectionRowContainer>
        </>
      )}

      {/* <div className="my-2 h-px w-full rounded-full bg-divider" />

      <div className="text-sm font-normal text-secondary">
        External Incentives
      </div>

      <BoycoWithdrawSectionRowContainer>
        <div className="flex grow flex-row items-center justify-start">
          <div className="h-6 w-6 rounded-full border border-divider bg-secondary drop-shadow-sm" />
          <div className="-ml-2 h-6 w-6 rounded-full border border-divider bg-tertiary drop-shadow-md" />
          <div className="-ml-2 h-6 w-6 rounded-full border border-divider bg-white drop-shadow-lg" />
        </div>

        <Button
          disabled={true}
          className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
          size="sm"
        >
          Locked
        </Button>
      </BoycoWithdrawSectionRowContainer> */}

      {/* <BoycoWithdrawSectionRowContainer>
        <div className="flex grow flex-col items-start justify-center">
          Bodiak Points
        </div>

        <Button
          className="h-fit w-fit rounded-lg px-4 py-2 text-sm font-normal"
          size="sm"
        >
          Claim
        </Button>
      </BoycoWithdrawSectionRowContainer> */}
    </div>
  );
});
