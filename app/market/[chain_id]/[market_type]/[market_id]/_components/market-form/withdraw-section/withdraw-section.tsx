import { HorizontalTabs, LoadingSpinner } from "@/components/composables";
import { cn } from "@/lib/utils";
import { MarketUserType, MarketWithdrawType, useMarketManager } from "@/store";
import React, { Fragment } from "react";
import { SelectWithdrawType } from "./select-withdraw-type";
import { useEnrichedPositionsRecipe } from "@/sdk/hooks";
import { useActiveMarket } from "../../hooks";
import { useAccount } from "wagmi";
import { AlertIndicator } from "@/components/common";

export const WithdrawSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { marketMetadata } = useActiveMarket();
  const { address, isConnected } = useAccount();

  const {
    withdrawType,
    setWithdrawType,
    withdrawSectionPage,
    setWithdrawSectionPage,
    userType,
  } = useMarketManager();

  const { isLoading, data, isError, error } = useEnrichedPositionsRecipe({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: withdrawSectionPage,
    filters: [
      {
        id:
          withdrawType === MarketWithdrawType.input_token.id
            ? "can_withdraw"
            : "can_claim",
        value: true,
      },
    ],
  });

  const totalCount =
    data && "count" in data ? (data.count ? data.count : 0) : 0;

  return (
    <div
      ref={ref}
      className={cn("flex w-full grow flex-col", className)}
      {...props}
    >
      {userType === MarketUserType.ap.id ? (
        <Fragment>
          <SelectWithdrawType />

          <div className="mt-5 flex w-full grow flex-col">
            <div className="flex grow flex-col place-content-center items-center">
              {isLoading && <LoadingSpinner className="h-5 w-5" />}

              {!isConnected && (
                <AlertIndicator>Wallet not connected</AlertIndicator>
              )}

              {!isLoading && totalCount === 0 && isConnected && (
                <AlertIndicator>No withdrawable positions found</AlertIndicator>
              )}
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex grow flex-col place-content-center items-center">
            <AlertIndicator>Only AP can withdraw</AlertIndicator>
          </div>
        </Fragment>
      )}
    </div>
  );
});
