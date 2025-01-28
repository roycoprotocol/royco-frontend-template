import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { InfoCard } from "@/components/common";
import { ChevronDown, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { TokenDisplayer } from "@/components/common";
import { CopyWrapper } from "@/app/_components/ui/composables/copy-wrapper";
import { MarketType } from "@/store/market-manager-props";
import { AnimatePresence, motion } from "framer-motion";
import { ActionFlow, SpringNumber } from "@/components/composables";
import validator from "validator";
import { parseRawAmountToTokenAmount, shortAddress } from "royco/utils";
import { getExplorerUrl } from "royco/utils";
import {
  BASE_MARGIN_TOP,
  INFO_ROW_CLASSES,
  PrimaryLabel,
  SecondaryLabel,
} from "../../../composables";
import { useActiveMarket } from "../../../hooks";
import { TertiaryLabel } from "../../../composables";
import formatNumber from "@/utils/numbers";

export const MarketDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketMetadata,
    currentMarketData,
    previousMarketData,
    propsActionsDecoderEnterMarket,
    propsActionsDecoderExitMarket,
  } = useActiveMarket();

  const [showActionDetails, setShowActionDetails] = useState(false);

  const formattedFillableAmount = useMemo(() => {
    if (!currentMarketData) {
      return;
    }

    const _fillableAmount = parseRawAmountToTokenAmount(
      currentMarketData?.quantity_ip ?? "0",
      currentMarketData?.input_token_data.decimals ?? 0
    );
    return `${formatNumber(_fillableAmount)} ${currentMarketData.input_token_data.symbol} (${formatNumber(currentMarketData.quantity_ip_usd ?? 0, { type: "currency" })})`;
  }, [currentMarketData]);

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border px-4 py-3", className)}
      {...props}
    >
      {/**
       * TVL
       */}
      <div>
        <TertiaryLabel className="text-sm">TVL</TertiaryLabel>
        <PrimaryLabel className="mt-1 text-2xl font-500">
          <SpringNumber
            previousValue={
              previousMarketData && previousMarketData.locked_quantity_usd
                ? previousMarketData.locked_quantity_usd
                : 0
            }
            currentValue={currentMarketData.locked_quantity_usd ?? 0}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          />
        </PrimaryLabel>
      </div>

      <hr className="my-4" />

      <InfoCard className="flex flex-col gap-2">
        {/**
         * Input Token
         */}
        <InfoCard.Row className={INFO_ROW_CLASSES}>
          <InfoCard.Row.Key>Accepts</InfoCard.Row.Key>

          <InfoCard.Row.Value>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={getExplorerUrl({
                chainId: marketMetadata.chain_id,
                type: "address",
                value:
                  currentMarketData.input_token_data.contract_address ?? "",
              })}
              className="flex items-center gap-2"
            >
              <TokenDisplayer
                tokens={[currentMarketData.input_token_data] as any}
                symbols={true}
                symbolClassName="text-xs font-medium"
                size={4}
              />
              <span>
                {shortAddress(
                  currentMarketData.input_token_data.contract_address ?? ""
                )}
              </span>
              <ExternalLinkIcon
                strokeWidth={1.5}
                className={cn("h-[18px] w-[18px] text-secondary")}
              />
            </Link>
          </InfoCard.Row.Value>
        </InfoCard.Row>

        {/**
         * Market Id
         */}
        <InfoCard.Row className={INFO_ROW_CLASSES}>
          <InfoCard.Row.Key>Market ID</InfoCard.Row.Key>

          <InfoCard.Row.Value>
            <CopyWrapper
              showIcon={false}
              text={currentMarketData.market_id ?? ""}
            >
              <span>{(currentMarketData.market_id ?? "").slice(0, 6)}...</span>
            </CopyWrapper>
          </InfoCard.Row.Value>
        </InfoCard.Row>

        {/**
         * ERC4626 Vault
         */}
        {marketMetadata.market_type === MarketType.vault.id && (
          <InfoCard.Row className={INFO_ROW_CLASSES}>
            <InfoCard.Row.Key>ERC4626 Vault</InfoCard.Row.Key>

            <InfoCard.Row.Value>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={getExplorerUrl({
                  chainId: marketMetadata.chain_id,
                  type: "address",
                  value: currentMarketData.underlying_vault_address ?? "",
                })}
                className="flex items-center gap-2"
              >
                <span>
                  {shortAddress(
                    currentMarketData.underlying_vault_address ?? ""
                  )}
                </span>
                <ExternalLinkIcon
                  strokeWidth={1.5}
                  className={cn("h-[18px] w-[18px] text-secondary")}
                />
              </Link>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        )}

        {/**
         * Wrapped Vault
         */}
        {marketMetadata.market_type === MarketType.vault.id && (
          <InfoCard.Row className={INFO_ROW_CLASSES}>
            <InfoCard.Row.Key>Wrapped Vault</InfoCard.Row.Key>

            <InfoCard.Row.Value>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={getExplorerUrl({
                  chainId: marketMetadata.chain_id,
                  type: "address",
                  value: currentMarketData.market_id ?? "",
                })}
                className="flex items-center gap-2"
              >
                <span>{shortAddress(currentMarketData.market_id ?? "")}</span>
                <ExternalLinkIcon
                  strokeWidth={1.5}
                  className={cn("h-[18px] w-[18px] text-secondary")}
                />
              </Link>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        )}

        <InfoCard.Row className={INFO_ROW_CLASSES}>
          <InfoCard.Row.Key>Amount Fillable</InfoCard.Row.Key>

          <InfoCard.Row.Value>
            <span>{formattedFillableAmount}</span>
          </InfoCard.Row.Value>
        </InfoCard.Row>
      </InfoCard>

      {/**
       * Show/Hide Market Details
       */}
      {/* <button
        className="mt-3 flex w-full flex-row justify-between text-sm font-light text-secondary"
        onClick={() => setShowActionDetails((prev) => !prev)}
      >
        <div>Market Details</div>

        <motion.div
          animate={{ rotate: showActionDetails ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <ChevronDown className="h-5" strokeWidth={1} />
        </motion.div>
      </button> */}

      {/**
       * Action Details
       */}
      <AnimatePresence>
        {showActionDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-hidden"
          >
            {marketMetadata.market_type === MarketType.recipe.id && (
              <SecondaryLabel
                className={cn("break-normal font-light text-secondary")}
              >
                {validator.unescape(currentMarketData.description ?? "") ??
                  "No description available"}
              </SecondaryLabel>
            )}

            {/**
             * @note Actions are currently hidden
             * -- do not un-hide this, otherwise it will break the frontend
             * -- i repeat, "DO NOT UN-HIDE THIS"
             */}
            {/* {marketMetadata.market_type === MarketType.recipe.id && (
              <>
                <hr className="my-3" />

                <div className="mb-2 grid grid-cols-2 gap-x-1 md:gap-x-3">
                  <div>
                    <SecondaryLabel className="font-light">
                      Supply Script
                    </SecondaryLabel>
                    <div
                      className={cn(
                        BASE_MARGIN_TOP.SM,
                        "max-h-[200px] overflow-x-hidden overflow-y-scroll rounded-lg border p-1"
                      )}
                    >
                      <ActionFlow
                        size="xs"
                        actions={propsActionsDecoderEnterMarket.data ?? []}
                        showAlertIcon={false}
                      />
                    </div>
                  </div>

                  <div>
                    <SecondaryLabel className="font-light">
                      Withdraw Script
                    </SecondaryLabel>
                    <div
                      className={cn(
                        BASE_MARGIN_TOP.SM,
                        "max-h-[200px] overflow-x-hidden overflow-y-scroll rounded-lg border p-1"
                      )}
                    >
                      <ActionFlow
                        size="xs"
                        actions={propsActionsDecoderExitMarket.data ?? []}
                        showAlertIcon={false}
                      />
                    </div>
                  </div>
                </div>
              </>
            )} */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
