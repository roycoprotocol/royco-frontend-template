import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { InfoCard } from "@/components/common";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { TokenDisplayer } from "@/components/common";
import { CopyWrapper } from "@/app/_containers/wrappers/copy-wrapper";
import { AnimatePresence, motion } from "framer-motion";
import validator from "validator";
import { shortAddress, getExplorerUrl } from "royco/utils";
import { SONIC_APP_TYPE } from "royco/sonic";
import {
  INFO_ROW_CLASSES,
  PrimaryLabel,
  SecondaryLabel,
} from "../../../composables";
import { TertiaryLabel } from "../../../composables";
import formatNumber from "@/utils/numbers";
import { MULTIPLIER_ASSET_TYPE } from "royco/boyco";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { useAtomValue } from "jotai";
import NumberFlow from "@number-flow/react";

export const MarketDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const [showActionDetails, setShowActionDetails] = useState(false);

  if (!!enrichedMarket) {
    return (
      <div
        ref={ref}
        className={cn("rounded-lg border px-4 py-3", className)}
        {...props}
      >
        {/**
         * Fillable
         */}
        <div className="flex flex-row justify-between">
          {enrichedMarket.marketType === 0 ? (
            <div>
              <TertiaryLabel className="text-sm">Capacity</TertiaryLabel>
              <PrimaryLabel className="mt-1 text-2xl font-500 ">
                <NumberFlow
                  value={enrichedMarket?.fillableUsd ?? 0}
                  format={{
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
          ) : (
            <div>
              <TertiaryLabel className="text-sm">Fillable</TertiaryLabel>
              <PrimaryLabel className="mt-1 text-2xl font-500">
                No Limit
              </PrimaryLabel>
            </div>
          )}

          {enrichedMarket.marketMetadata?.boyco?.assetType &&
            enrichedMarket.marketMetadata?.boyco?.multiplier && (
              <div className="flex flex-col items-end">
                <TertiaryLabel className="text-sm">
                  {(() => {
                    if (
                      enrichedMarket.marketMetadata?.boyco?.assetType ===
                      MULTIPLIER_ASSET_TYPE.MAJOR_ONLY
                    ) {
                      return "MAJOR";
                    } else if (
                      enrichedMarket.marketMetadata?.boyco?.assetType ===
                      MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY
                    ) {
                      return "THIRD-PARTY";
                    } else if (
                      enrichedMarket.marketMetadata?.boyco?.assetType ===
                      MULTIPLIER_ASSET_TYPE.HYBRID
                    ) {
                      return "HYBRID";
                    } else {
                      return "Unknown";
                    }
                  })()}
                </TertiaryLabel>
                <SecondaryLabel className="mt-1 h-full rounded-full border border-success px-3 py-1 font-semibold text-success">
                  {enrichedMarket.marketMetadata?.boyco?.multiplier}x
                </SecondaryLabel>
              </div>
            )}

          {enrichedMarket.marketMetadata?.sonic?.appType && (
            <div className="flex flex-col items-end">
              <SecondaryLabel className="mt-1 rounded-full border border-success px-3 py-1 text-success">
                {(() => {
                  if (
                    enrichedMarket.marketMetadata?.sonic?.appType ===
                    SONIC_APP_TYPE.EMERALD
                  ) {
                    return "Emerald";
                  } else if (
                    enrichedMarket.marketMetadata?.sonic?.appType ===
                    SONIC_APP_TYPE.SAPPHIRE
                  ) {
                    return "Sapphire";
                  } else if (
                    enrichedMarket.marketMetadata?.sonic?.appType ===
                    SONIC_APP_TYPE.RUBY
                  ) {
                    return "Ruby";
                  } else {
                    return "Unknown";
                  }
                })()}
              </SecondaryLabel>
            </div>
          )}
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
                  chainId: enrichedMarket?.chainId,
                  type: "address",
                  value: enrichedMarket?.inputToken?.contractAddress ?? "",
                })}
                className="flex items-center gap-2"
              >
                <TokenDisplayer
                  tokens={[enrichedMarket?.inputToken]}
                  symbols={true}
                  symbolClassName="text-xs font-medium"
                  size={4}
                />
                <span>
                  {shortAddress(
                    enrichedMarket?.inputToken?.contractAddress ?? ""
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
                text={enrichedMarket?.marketId ?? ""}
              >
                <span>{(enrichedMarket?.marketId ?? "").slice(0, 6)}...</span>
              </CopyWrapper>
            </InfoCard.Row.Value>
          </InfoCard.Row>

          {/**
           * Sonic Incentive Payout
           */}
          {process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic" && (
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Incentive Payout</InfoCard.Row.Key>

              <InfoCard.Row.Value>After Sonic S1</InfoCard.Row.Value>
            </InfoCard.Row>
          )}

          {/**
           * ERC4626 Vault
           */}
          {enrichedMarket.marketType === 1 && (
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>ERC4626 Vault</InfoCard.Row.Key>

              <InfoCard.Row.Value>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getExplorerUrl({
                    chainId: enrichedMarket?.chainId,
                    type: "address",
                    value: enrichedMarket?.underlyingVaultAddress ?? "",
                  })}
                  className="flex items-center gap-2"
                >
                  <span>
                    {shortAddress(enrichedMarket?.underlyingVaultAddress ?? "")}
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
          {enrichedMarket.marketType === 1 && (
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Wrapped Vault</InfoCard.Row.Key>

              <InfoCard.Row.Value>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getExplorerUrl({
                    chainId: enrichedMarket?.chainId,
                    type: "address",
                    value: enrichedMarket?.marketId ?? "",
                  })}
                  className="flex items-center gap-2"
                >
                  <span>{shortAddress(enrichedMarket?.marketId ?? "")}</span>
                  <ExternalLinkIcon
                    strokeWidth={1.5}
                    className={cn("h-[18px] w-[18px] text-secondary")}
                  />
                </Link>
              </InfoCard.Row.Value>
            </InfoCard.Row>
          )}

          <InfoCard.Row className={INFO_ROW_CLASSES}>
            <InfoCard.Row.Key>TVL</InfoCard.Row.Key>

            <InfoCard.Row.Value>
              <span>
                {formatNumber(enrichedMarket?.tvlUsd ?? 0, {
                  type: "currency",
                })}
              </span>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        </InfoCard>

        {/**
         * Show/Hide Market Details
         * Disabled currently
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
              {enrichedMarket.marketType === 0 && (
                <SecondaryLabel
                  className={cn("break-normal font-light text-secondary")}
                >
                  {validator.unescape(enrichedMarket.description ?? "") ??
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
  }
});
