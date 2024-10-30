import { cn } from "@/lib/utils";
import React from "react";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  INFO_ROW_CLASSES,
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { useActiveMarket } from "../hooks";
import {
  ActionFlow,
  HorizontalTabs,
  LoadingSpinner,
  SpringNumber,
} from "@/components/composables";
import { MarketRewardStyle, MarketScriptType, useMarketManager } from "@/store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarketType } from "@/store";
import {
  BadgeLink,
  InfoCard,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";
import { getExplorerUrl, getSupportedChain, shortAddress } from "@/sdk/utils";
import { formatDuration } from "date-fns";
import { secondsToDuration } from "@/app/create/_components/market-builder-form";

const INFO_TIP_PROPS = {
  size: "sm" as "sm",
  type: "secondary" as "secondary",
  className: cn("w-full max-w-60"),
};

export const MarketInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    isLoading,
    marketMetadata,
    propsEnrichedMarket,
    currentMarketData,
    previousMarketData,
    propsReadMarket,
    propsActionsDecoderEnterMarket,
    propsActionsDecoderExitMarket,
  } = useActiveMarket();

  const { scriptType, setScriptType, viewType } = useMarketManager();

  if (
    !isLoading &&
    !!currentMarketData &&
    !!marketMetadata &&
    !!propsReadMarket.data
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-fit w-full shrink-0 flex-col divide-y divide-divider",
          // BASE_PADDING,
          className
        )}
        {...props}
      >
        <div className={cn(BASE_PADDING, "pb-4")}>
          <TertiaryLabel>MARKET</TertiaryLabel>

          <PrimaryLabel
            className={cn(BASE_MARGIN_TOP.XS)}
            isVerified={currentMarketData.is_verified ? true : false}
          >
            {currentMarketData.name && currentMarketData.name.trim() !== ""
              ? currentMarketData.name.trim()
              : "Unknown Market"}
          </PrimaryLabel>
        </div>

        <div className={cn(BASE_PADDING)}>
          {/**
           * Annual Incentive Percent
           */}

          <PrimaryLabel className={cn("text-3xl font-light")}>
            {currentMarketData.annual_change_ratio === Math.pow(10, 18) ||
            currentMarketData.annual_change_ratio === 0 ? (
              `N/D`
            ) : (
              <SpringNumber
                previousValue={
                  previousMarketData && previousMarketData.annual_change_ratio
                    ? previousMarketData.annual_change_ratio
                    : 0
                }
                currentValue={currentMarketData.annual_change_ratio ?? 0}
                numberFormatOptions={{
                  style: "percent",
                  notation: "compact",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
              />
            )}
          </PrimaryLabel>
          <TertiaryLabel className={cn(BASE_MARGIN_TOP.SM)}>
            Annual Percentage Yield
          </TertiaryLabel>

          <SecondaryLabel className={cn(BASE_MARGIN_TOP.XL)}>
            {currentMarketData.description ?? "No description available"}
          </SecondaryLabel>

          {/**
           * Currently hidden
           */}
          {/* {marketMetadata.market_type === MarketType.recipe.id && (
            <HoverCard openDelay={0} closeDelay={500}>
              <HoverCardTrigger className={cn("flex w-32")}>
                <SecondaryLabel
                  className={cn(BASE_MARGIN_TOP.MD, BASE_UNDERLINE.MD, "w-fit")}
                >
                  Recipe Details
                </SecondaryLabel>
              </HoverCardTrigger>

              <HoverCardContent
                sideOffset={10}
                side="right"
                align="start"
                className="w-80 p-2"
              >
                <HorizontalTabs
                  size="sm"
                  key="market:script-type:container"
                  baseId="market:script-type"
                  tabs={Object.values(MarketScriptType)}
                  activeTab={scriptType}
                  setter={setScriptType}
                />

                {propsActionsDecoderEnterMarket.isLoading ? (
                  <div className="flex h-16 w-full flex-col place-content-center items-center">
                    <LoadingSpinner className="h-5 w-5" />
                  </div>
                ) : (
                  <ActionFlow
                    className={cn(BASE_MARGIN_TOP.SM)}
                    size="sm"
                    actions={
                      scriptType === MarketScriptType.enter_actions.id
                        ? propsActionsDecoderEnterMarket.data ?? []
                        : propsActionsDecoderExitMarket.data ?? []
                    }
                  />
                )}
              </HoverCardContent>
            </HoverCard>
          )} */}

          <InfoCard className={cn("flex flex-col gap-1", BASE_MARGIN_TOP.LG)}>
            {/**
             * @info Chain
             */}
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Chain</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                {getSupportedChain(marketMetadata.chain_id)?.name ?? "Unknown"}

                <InfoTip {...INFO_TIP_PROPS}>
                  Chain Id: {marketMetadata.chain_id}
                </InfoTip>
              </InfoCard.Row.Value>
            </InfoCard.Row>

            {/**
             * @info Market Type
             */}
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Market Type</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                {marketMetadata.market_type === MarketType.recipe.id
                  ? "Recipe"
                  : "Vault"}

                <InfoTip {...INFO_TIP_PROPS}>
                  {MarketType[marketMetadata.market_type].description}
                </InfoTip>
              </InfoCard.Row.Value>
            </InfoCard.Row>

            {/**
             * @info Market Id
             */}
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Market Id</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                {`${marketMetadata.chain_id}_${marketMetadata.market_type === "recipe" ? "0" : "1"}_${shortAddress(
                  currentMarketData.market_id ?? ""
                )}`}

                <InfoTip {...INFO_TIP_PROPS}>
                  Market id is constructed as concatenation of chain id, market
                  type and market index. For recipe, market index is sequential
                  number and for vaults, it is the address of wrapped vault.
                </InfoTip>
              </InfoCard.Row.Value>
            </InfoCard.Row>

            {/**
             * @info Instructions
             */}
            {marketMetadata.market_type === MarketType.recipe.id && (
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>Instructions</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  <HoverCard openDelay={0} closeDelay={500}>
                    <HoverCardTrigger className={cn("flex cursor-pointer")}>
                      Recipe Details
                    </HoverCardTrigger>

                    <HoverCardContent
                      sideOffset={5}
                      alignOffset={-5}
                      side="right"
                      align="start"
                      className="w-96 p-2"
                    >
                      <HorizontalTabs
                        size="sm"
                        key="market:script-type:container"
                        baseId="market:script-type"
                        tabs={Object.values(MarketScriptType)}
                        activeTab={scriptType}
                        setter={setScriptType}
                      />

                      {propsActionsDecoderEnterMarket.isLoading ? (
                        <div className="flex h-16 w-full flex-col place-content-center items-center">
                          <LoadingSpinner className="h-5 w-5" />
                        </div>
                      ) : (
                        <ActionFlow
                          className={cn(BASE_MARGIN_TOP.SM)}
                          size="sm"
                          actions={
                            scriptType === MarketScriptType.enter_actions.id
                              ? (propsActionsDecoderEnterMarket.data ?? [])
                              : (propsActionsDecoderExitMarket.data ?? [])
                          }
                        />
                      )}
                    </HoverCardContent>
                  </HoverCard>

                  <InfoTip {...INFO_TIP_PROPS}>
                    Details of the market recipe
                  </InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            )}

            {/**
             * @info Reward Style
             * @condition Recipe Market
             */}
            {marketMetadata.market_type === MarketType.recipe.id && (
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>Reward Style</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  {
                    MarketRewardStyle[
                      currentMarketData.reward_style === 0
                        ? "upfront"
                        : currentMarketData.reward_style === 1
                          ? "arrear"
                          : "forfeitable"
                    ].label
                  }

                  <InfoTip {...INFO_TIP_PROPS}>
                    {
                      MarketRewardStyle[
                        currentMarketData.reward_style === 0
                          ? "upfront"
                          : currentMarketData.reward_style === 1
                            ? "arrear"
                            : "forfeitable"
                      ].description
                    }
                  </InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            )}

            {/**
             * @info Input Token
             */}
            <InfoCard.Row className={INFO_ROW_CLASSES}>
              <InfoCard.Row.Key>Accepts</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                <TokenDisplayer
                  size={4}
                  hover
                  bounce
                  tokens={[currentMarketData.input_token_data]}
                  symbols={true}
                />
                <InfoTip {...INFO_TIP_PROPS}>
                  Token that can be deposited in the market
                </InfoTip>
              </InfoCard.Row.Value>
            </InfoCard.Row>

            {/**
             * @info Incentives
             */}
            {
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>Incentives</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  {/* <TokenDisplayer
                    size={4}
                    hover
                    bounce
                    tokens={currentMarketData.incentive_tokens_data}
                    symbols={false}
                    className="-mr-1"
                  /> */}

                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                    useGrouping: true,
                  }).format(currentMarketData.total_incentive_amounts_usd ?? 0)}

                  <InfoTip {...INFO_TIP_PROPS}>Incentives</InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            }

            {/**
             * @info TVL
             */}
            {
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>TVL</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                    useGrouping: true,
                  }).format(currentMarketData.locked_quantity_usd ?? 0)}
                  <InfoTip {...INFO_TIP_PROPS}>Total Value Locked</InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            }

            {/**
             * @info ERC4626 Vault
             */}
            {marketMetadata.market_type === MarketType.vault.id && (
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>ERC4626 Vault</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  {
                    // @ts-ignore
                    currentMarketData.underlying_vault_address.slice(0, 6) +
                      "..." +
                      // @ts-ignore
                      currentMarketData.underlying_vault_address.slice(-4)
                  }
                  <InfoTip {...INFO_TIP_PROPS}>ERC4626 Vault</InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            )}

            {/**
             * @info Wrapped Vault
             */}
            {marketMetadata.market_type === MarketType.vault.id && (
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>Wrapped Vault</InfoCard.Row.Key>
                <InfoCard.Row.Value>
                  {
                    // @ts-ignore
                    currentMarketData.market_id.slice(0, 6) +
                      "..." +
                      // @ts-ignore
                      currentMarketData.market_id.slice(-4)
                  }
                  <InfoTip {...INFO_TIP_PROPS}>Wrapped Vault</InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            )}

            {/**
             * @info Lockup Time
             */}
            {marketMetadata.market_type === MarketType.recipe.id && (
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>Lockup Time</InfoCard.Row.Key>
                <InfoCard.Row.Value className="capitalize">
                  {formatDuration(
                    Object.entries(
                      secondsToDuration(currentMarketData.lockup_time)
                    )
                      .filter(([_, value]) => value > 0) // Filter out zero values
                      .slice(0, 2) // Take the first two non-zero units
                      .reduce(
                        (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                        {}
                      )
                  )}

                  {currentMarketData.lockup_time === "0" && "0 seconds"}

                  <InfoTip {...INFO_TIP_PROPS}>
                    Time duration for which assets must be deposited for
                  </InfoTip>
                </InfoCard.Row.Value>
              </InfoCard.Row>
            )}
          </InfoCard>

          <div className="mt-3 flex flex-row flex-wrap items-center gap-2">
            <BadgeLink
              size="sm"
              target="_blank"
              text="Market Deployer"
              href={getExplorerUrl({
                chainId: marketMetadata.chain_id,
                type: "address",
                value: currentMarketData.creator ?? "",
              })}
            />
            <BadgeLink
              size="sm"
              target="_blank"
              text="Creation Receipt"
              href={getExplorerUrl({
                chainId: marketMetadata.chain_id,
                type: "tx",
                value: currentMarketData.transaction_hash ?? "",
              })}
            />
            <BadgeLink
              size="sm"
              target="_blank"
              text="Input Token"
              href={getExplorerUrl({
                chainId: marketMetadata.chain_id,
                type: "address",
                value:
                  currentMarketData.input_token_data.contract_address ?? "",
              })}
            />

            {marketMetadata.market_type === MarketType.vault.id && (
              <BadgeLink
                size="sm"
                target="_blank"
                text="ERC4626 Vault"
                href={getExplorerUrl({
                  chainId: marketMetadata.chain_id,
                  type: "address",
                  value: currentMarketData.underlying_vault_address ?? "",
                })}
              />
            )}

            {marketMetadata.market_type === MarketType.vault.id && (
              <BadgeLink
                size="sm"
                target="_blank"
                text="Wrapped Vault"
                href={getExplorerUrl({
                  chainId: marketMetadata.chain_id,
                  type: "address",
                  value: currentMarketData.market_id ?? "",
                })}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
});
