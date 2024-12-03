import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
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
import {
  MarketRewardStyle,
  MarketScriptType,
  MarketViewType,
  useMarketManager,
} from "@/store";
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
import { getExplorerUrl, getSupportedChain, shortAddress } from "royco/utils";
import { formatDuration } from "date-fns";
import { secondsToDuration } from "@/app/create/_components/market-builder-form";
import { ChevronDown, ExternalLinkIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { isEqual } from "lodash";
import {
  useEnrichedAccountBalancesRecipeInMarket,
  useEnrichedAccountBalancesVaultInMarket,
} from "royco/hooks";
import { useAccount } from "wagmi";
import { produce } from "immer";
import { CopyWrapper } from "@/app/_components/ui/composables/copy-wrapper";

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
    currentHighestOffers,
  } = useActiveMarket();

  const { scriptType, setScriptType, viewType } = useMarketManager();

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const { address } = useAccount();

  const {
    isLoading: isLoadingRecipe,
    isRefetching: isRefetchingRecipe,
    data: dataRecipe,
  } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
    custom_token_data: undefined,
  });

  const {
    isLoading: isLoadingVault,
    isRefetching: isRefetchingVault,
    data: dataVault,
  } = useEnrichedAccountBalancesVaultInMarket({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
    custom_token_data: undefined,
  });

  const [placeholderData, setPlaceholderData] = React.useState<
    Array<typeof dataRecipe | typeof dataVault | undefined>
  >([undefined, undefined]);

  /**
   * @effect Update placeholder data for recipe
   */
  useEffect(() => {
    if (
      marketMetadata.market_type === MarketType.recipe.id &&
      isLoadingRecipe === false &&
      isRefetchingRecipe === false &&
      !isEqual(dataRecipe, placeholderData[1])
    ) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataRecipe)) {
            draft[0] = draft[1] as typeof dataRecipe;
            draft[1] = dataRecipe as typeof dataRecipe;
          }
        });
      });
    }
  }, [isLoadingRecipe, isRefetchingRecipe, dataRecipe]);

  /**
   * @effect Update placeholder data for vault
   */
  useEffect(() => {
    if (
      marketMetadata.market_type === MarketType.vault.id &&
      isLoadingVault === false &&
      isRefetchingVault === false &&
      !isEqual(dataVault, placeholderData[1])
    ) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataVault)) {
            draft[0] = draft[1] as typeof dataVault;
            draft[1] = dataVault as typeof dataVault;
          }
        });
      });
    }
  }, [isLoadingVault, isRefetchingVault, dataVault]);

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
        <div className={cn(BASE_PADDING, "flex flex-col pb-4")}>
          <div className="flex justify-between">
            <TertiaryLabel>MARKET</TertiaryLabel>
            <img
              src={getSupportedChain(marketMetadata.chain_id)?.image}
              alt={String(marketMetadata.chain_id)}
              className="h-6 w-6 rounded-md border"
            />
          </div>

          <PrimaryLabel
            className={cn(BASE_MARGIN_TOP.XS)}
            isVerified={currentMarketData.is_verified ? true : false}
          >
            {currentMarketData.name && currentMarketData.name.trim() !== ""
              ? currentMarketData.name.trim()
              : "Unknown Market"}
          </PrimaryLabel>

          <SecondaryLabel className={cn(BASE_MARGIN_TOP.XS)}>
            {currentMarketData.description ?? "No description available"}
          </SecondaryLabel>
        </div>

        <div className={cn(BASE_PADDING)}>
          {/**
           * Annual Incentive Percent
           */}

          <div
            className={cn(
              "flex gap-4",
              marketMetadata.market_type === MarketType.recipe.id &&
                currentMarketData.lockup_time !== "0"
                ? "flex-col"
                : "flex-row",
              viewType === MarketViewType.advanced.id &&
                marketMetadata.market_type === MarketType.recipe.id &&
                currentMarketData.lockup_time !== "0"
                ? "md:flex-col"
                : "md:flex-row"
            )}
          >
            {placeholderData[1] && placeholderData[1].balance_usd_ap > 0 && (
              <div className="flex flex-1">
                <div className="hide-scrollbar flex-1 overflow-x-scroll rounded-xl border bg-z2 p-3">
                  <SecondaryLabel>Balance</SecondaryLabel>
                  <PrimaryLabel
                    className={cn(BASE_MARGIN_TOP.SM, "text-3xl font-light")}
                  >
                    {(currentMarketData.annual_change_ratio ?? 0) >=
                    Math.pow(10, 18) ? (
                      `0`
                    ) : (
                      <SpringNumber
                        previousValue={
                          placeholderData[0]
                            ? placeholderData[0].balance_usd_ap
                            : 0
                        }
                        currentValue={
                          placeholderData[1]
                            ? placeholderData[1].balance_usd_ap
                            : 0
                        }
                        numberFormatOptions={{
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    )}
                  </PrimaryLabel>
                </div>
              </div>
            )}

            <div className="flex flex-1 rounded-xl border bg-z2">
              <div className="hide-scrollbar flex-1 overflow-x-scroll p-3">
                <SecondaryLabel>APR</SecondaryLabel>
                <PrimaryLabel
                  className={cn(BASE_MARGIN_TOP.SM, "text-3xl font-light")}
                >
                  {(currentMarketData.annual_change_ratio ?? 0) >=
                  Math.pow(10, 18) ? (
                    `0`
                  ) : (
                    <SpringNumber
                      previousValue={
                        previousMarketData &&
                        previousMarketData.annual_change_ratio
                          ? previousMarketData.annual_change_ratio
                          : 0
                      }
                      currentValue={currentMarketData.annual_change_ratio ?? 0}
                      numberFormatOptions={{
                        style: "percent",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                  )}
                </PrimaryLabel>
              </div>

              {marketMetadata.market_type === MarketType.recipe.id &&
                currentMarketData.lockup_time !== "0" && (
                  <div className="hide-scrollbar flex-1 overflow-x-scroll border-l p-3">
                    <SecondaryLabel>Lockup</SecondaryLabel>
                    <PrimaryLabel
                      className={cn(
                        BASE_MARGIN_TOP.SM,
                        "text-3xl font-light capitalize"
                      )}
                    >
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
                    </PrimaryLabel>
                  </div>
                )}
            </div>
          </div>

          <button onClick={() => setShowTransactionDetails((prev) => !prev)}>
            <TertiaryLabel className={cn(BASE_MARGIN_TOP.XL, "text-sm")}>
              <span>Transaction details</span>
              <motion.div
                animate={{ rotate: showTransactionDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1"
              >
                <ChevronDown className="h-5 " />
              </motion.div>
            </TertiaryLabel>
          </button>

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

          <AnimatePresence>
            {showTransactionDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <InfoCard
                  className={cn("flex flex-col gap-1", BASE_MARGIN_TOP.LG)}
                >
                  {marketMetadata.market_type === MarketType.recipe.id && (
                    <div className="mb-2 grid grid-cols-2 gap-x-1 md:gap-x-3">
                      <div>
                        <SecondaryLabel>Deposit Script</SecondaryLabel>

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
                        <SecondaryLabel>Withdrawal Script</SecondaryLabel>

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
                  )}

                  {/**
                   * @info Chain
                   */}
                  {/* <InfoCard.Row className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>Chain</InfoCard.Row.Key>
                    <InfoCard.Row.Value>
                      {getSupportedChain(marketMetadata.chain_id)?.name ??
                        "Unknown"}

                      <InfoTip {...INFO_TIP_PROPS}>
                        Chain Id: {marketMetadata.chain_id}
                      </InfoTip>
                    </InfoCard.Row.Value>
                  </InfoCard.Row> */}

                  {/**
                   * @info Market Type
                   */}
                  {/* <InfoCard.Row className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>Market Type</InfoCard.Row.Key>
                    <InfoCard.Row.Value>
                      {marketMetadata.market_type === MarketType.recipe.id
                        ? "Recipe"
                        : "Vault"}

                      <InfoTip {...INFO_TIP_PROPS}>
                        {MarketType[marketMetadata.market_type].description}
                      </InfoTip>
                    </InfoCard.Row.Value>
                  </InfoCard.Row> */}

                  {/**
                   * @info Market Id
                   */}
                  <InfoCard.Row className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>Market ID</InfoCard.Row.Key>
                    <InfoCard.Row.Value>
                      <CopyWrapper
                        iconPosition={"left"}
                        text={currentMarketData.market_id ?? ""}
                      >
                        {`${shortAddress(currentMarketData.market_id ?? "")}`}
                      </CopyWrapper>

                      <InfoTip {...INFO_TIP_PROPS}>
                        Market id is constructed as concatenation of chain id,
                        market type and market index. For recipes, market id is
                        hash of the market and for vaults, it is the address of
                        wrapped vault.
                      </InfoTip>
                    </InfoCard.Row.Value>
                  </InfoCard.Row>

                  {/**
                   * @info Instructions
                   */}
                  {
                    // marketMetadata.market_type === MarketType.recipe.id && (
                    //   <InfoCard.Row className={INFO_ROW_CLASSES}>
                    //     <InfoCard.Row.Key>Instructions</InfoCard.Row.Key>
                    //     <InfoCard.Row.Value>
                    //       <HoverCard openDelay={0} closeDelay={500}>
                    //         <HoverCardTrigger
                    //           className={cn("flex cursor-pointer")}
                    //         >
                    //           Recipe Details
                    //         </HoverCardTrigger>
                    //         <HoverCardContent
                    //           sideOffset={5}
                    //           alignOffset={-5}
                    //           side="right"
                    //           align="start"
                    //           className="w-96 p-2"
                    //         >
                    //           <HorizontalTabs
                    //             size="sm"
                    //             key="market:script-type:container"
                    //             baseId="market:script-type"
                    //             tabs={Object.values(MarketScriptType)}
                    //             activeTab={scriptType}
                    //             setter={setScriptType}
                    //           />
                    //           {propsActionsDecoderEnterMarket.isLoading ? (
                    //             <div className="flex h-16 w-full flex-col place-content-center items-center">
                    //               <LoadingSpinner className="h-5 w-5" />
                    //             </div>
                    //           ) : (
                    //             <ActionFlow
                    //               className={cn(BASE_MARGIN_TOP.SM)}
                    //               size="sm"
                    //               actions={
                    //                 scriptType ===
                    //                 MarketScriptType.enter_actions.id
                    //                   ? (propsActionsDecoderEnterMarket.data ??
                    //                     [])
                    //                   : (propsActionsDecoderExitMarket.data ?? [])
                    //               }
                    //             />
                    //           )}
                    //         </HoverCardContent>
                    //       </HoverCard>
                    //       <InfoTip {...INFO_TIP_PROPS}>
                    //         Details of the market recipe
                    //       </InfoTip>
                    //     </InfoCard.Row.Value>
                    //   </InfoCard.Row>
                    // )
                  }

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
                  {/* <InfoCard.Row className={INFO_ROW_CLASSES}>
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
                  </InfoCard.Row> */}

                  {/**
                   * @info Incentives
                   */}
                  {
                    <InfoCard.Row className={INFO_ROW_CLASSES}>
                      <InfoCard.Row.Key>Incentives Remaining</InfoCard.Row.Key>
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
                          notation: "standard",
                          useGrouping: true,
                        }).format(
                          currentMarketData.total_incentive_amounts_usd ?? 0
                        )}

                        <InfoTip {...INFO_TIP_PROPS}>
                          {marketMetadata.market_type === MarketType.recipe.id
                            ? "Remaining incentives in all IP offers"
                            : "Remaining incentives in a present or future campaign"}
                        </InfoTip>
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
                          notation: "standard",
                          useGrouping: true,
                        }).format(currentMarketData.locked_quantity_usd ?? 0)}
                        <InfoTip {...INFO_TIP_PROPS}>
                          {marketMetadata.market_type === MarketType.recipe.id
                            ? "Value of all input tokens locked inside weiroll wallets"
                            : "Value of all input tokens deposited in underlying vault through Royco"}
                        </InfoTip>
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
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getExplorerUrl({
                            chainId: marketMetadata.chain_id,
                            type: "address",
                            value:
                              currentMarketData.underlying_vault_address ?? "",
                          })}
                          className="flex items-center gap-1"
                        >
                          {
                            // @ts-ignore
                            currentMarketData.underlying_vault_address.slice(
                              0,
                              6
                            ) +
                              "..." +
                              // @ts-ignore
                              currentMarketData.underlying_vault_address.slice(
                                -4
                              )
                          }
                          <ExternalLinkIcon
                            strokeWidth={1.5}
                            className={cn("h-5 w-5 p-[0.1rem] text-secondary")}
                          />
                        </Link>
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
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getExplorerUrl({
                            chainId: marketMetadata.chain_id,
                            type: "address",
                            value: currentMarketData.market_id ?? "",
                          })}
                          className="flex items-center gap-1"
                        >
                          {
                            // @ts-ignore
                            currentMarketData.market_id.slice(0, 6) +
                              "..." +
                              // @ts-ignore
                              currentMarketData.market_id.slice(-4)
                          }
                          <ExternalLinkIcon
                            strokeWidth={1.5}
                            className={cn("h-5 w-5 p-[0.1rem] text-secondary")}
                          />
                        </Link>
                      </InfoCard.Row.Value>
                    </InfoCard.Row>
                  )}

                  <InfoCard.Row className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>Input Token</InfoCard.Row.Key>

                    <InfoCard.Row.Value>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={getExplorerUrl({
                          chainId: marketMetadata.chain_id,
                          type: "address",
                          value:
                            currentMarketData.input_token_data
                              .contract_address ?? "",
                        })}
                        className="flex items-center gap-1"
                      >
                        {
                          // @ts-ignore
                          currentMarketData.input_token_data.contract_address.slice(
                            0,
                            6
                          ) +
                            "..." +
                            // @ts-ignore
                            currentMarketData.input_token_data.contract_address.slice(
                              -4
                            )
                        }
                        {/* <InfoTip {...INFO_TIP_PROPS}>Wrapped Vault</InfoTip> */}
                        <ExternalLinkIcon
                          strokeWidth={1.5}
                          className={cn("h-5 w-5 p-[0.1rem] text-secondary")}
                        />
                      </Link>
                    </InfoCard.Row.Value>
                  </InfoCard.Row>

                  {/**
                   * @info Lockup Time
                   */}
                  {
                    // marketMetadata.market_type === MarketType.recipe.id && (
                    // <InfoCard.Row className={INFO_ROW_CLASSES}>
                    //   <InfoCard.Row.Key>Lockup Time</InfoCard.Row.Key>
                    //   <InfoCard.Row.Value className="capitalize">
                    //     {formatDuration(
                    //       Object.entries(
                    //         secondsToDuration(currentMarketData.lockup_time)
                    //       )
                    //         .filter(([_, value]) => value > 0) // Filter out zero values
                    //         .slice(0, 2) // Take the first two non-zero units
                    //         .reduce(
                    //           (acc, [unit, value]) => ({
                    //             ...acc,
                    //             [unit]: value,
                    //           }),
                    //           {}
                    //         )
                    //     )}
                    //     {currentMarketData.lockup_time === "0" && "0 seconds"}
                    //     <InfoTip {...INFO_TIP_PROPS}>
                    //       Time duration for which assets must be deposited for
                    //     </InfoTip>
                    //   </InfoCard.Row.Value>
                    // </InfoCard.Row>
                    // )
                  }
                </InfoCard>

                {/* <div className="mt-3 flex flex-row flex-wrap items-center gap-2">
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
                        currentMarketData.input_token_data.contract_address ??
                        "",
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
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
});
