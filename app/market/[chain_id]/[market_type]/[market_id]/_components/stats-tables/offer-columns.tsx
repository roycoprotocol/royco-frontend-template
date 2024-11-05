import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EnrichedOfferDataType } from "@/sdk/queries";
import { SecondaryLabel } from "../composables";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { getExplorerUrl } from "@/sdk/utils";
import { MarketType, useMarketManager } from "@/store";
import { TransactionOptionsType } from "@/sdk/types";
import { useActiveMarket } from "../hooks";
import { ContractMap } from "@/sdk/contracts";
import { BigNumber } from "ethers";

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
/**
 * @TODO Strictly type this
 */
// @ts-ignore
export const offerColumns: ColumnDef<EnrichedOfferDataType> = [
  // {
  //   accessorKey: "name",
  //   enableResizing: false,
  //   enableSorting: false,
  //   header: "Name",
  //   meta: {
  //     className: "min-w-52",
  //   },
  //   cell: (props: any) => {
  //     return <div>{props.row.original.name}</div>;
  //   },
  // },

  /**
   * @note Commented out for now because we are filtering offers by user type
   */
  // {
  //   accessorKey: "offer_side",
  //   enableResizing: false,
  //   enableSorting: false,
  //   header: "Side",
  //   meta: {
  //     className: "min-w-24",
  //   },
  //   cell: (props: any) => {
  //     return (
  //       <div
  //         className={cn(
  //           "font-gt text-sm font-300",
  //           props.row.original.offer_side === "0"
  //             ? "text-success"
  //             : "text-error"
  //         )}
  //       >
  //         {props.row.original.offer_side === "0" ? "AP" : "IP"}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "tokens_data",
    enableResizing: false,
    enableSorting: false,
    header: "Condition",
    meta: {
      className: "min-w-36",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn("flex flex-col gap-[0.2rem] font-gt text-sm font-300")}
        >
          {props.row.original.tokens_data.map(
            (
              // @ts-ignore
              token,
              // @ts-ignore
              tokenIndex
            ) => {
              return (
                <div key={tokenIndex} className="flex items-center space-x-2">
                  <div className="h-4">
                    <span className="leading-5">
                      {Intl.NumberFormat("en-US", {
                        style: "decimal",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(token.token_amount)}
                    </span>
                  </div>

                  <TokenDisplayer size={4} tokens={[token]} symbols={true} />
                </div>
              );
            }
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "input_token_data",
    enableResizing: false,
    enableSorting: false,
    header: "Size Remaining",
    meta: {
      // className: "min-w-52",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(props.row.original.input_token_data.token_amount_usd)}
          </SecondaryLabel>

          <SecondaryLabel className="text-tertiary">
            {Intl.NumberFormat("en-US", {
              style: "decimal",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(props.row.original.input_token_data.token_amount)}{" "}
            {props.row.original.input_token_data.symbol.toUpperCase()}
          </SecondaryLabel>
        </div>
      );
    },
  },
  {
    accessorKey: "expiry",
    enableResizing: false,
    enableSorting: false,
    header: "Expiration",
    meta: {
      // className: "min-w-18",
    },
    cell: (props: any) => {
      return (
        <div className={cn("font-gt text-sm font-300")}>
          {props.row.original.expiry === "0"
            ? "Never"
            : formatDistanceToNow(
                new Date(parseInt(props.row.original.expiry) * 1000),
                {
                  addSuffix: true,
                }
              )}
        </div>
      );
    },
  },
  {
    accessorKey: "is_cancelled",
    enableResizing: false,
    enableSorting: false,
    header: "Status",
    meta: {
      // className: "min-w-18",
    },
    cell: (props: any) => {
      let status = "Open";

      if (props.row.original.is_cancelled) {
        status = "Cancelled";
      } else if (
        BigNumber.from(props.row.original.quantity_remaining).isZero()
      ) {
        status = "Filled";
      } else if (
        !BigNumber.from(props.row.original.expiry).eq(0) &&
        BigNumber.from(props.row.original.expiry).lt(
          BigNumber.from(Math.floor(Date.now() / 1000))
        )
      ) {
        status = "Expired";
      } else if (props.row.original.is_valid === false) {
        status = "Invalid";
      }

      return <div className={cn("font-gt text-sm font-300")}>{status}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    meta: {},
    cell: (props: any) => {
      const { transactions, setTransactions } = useMarketManager();

      const { marketMetadata } = useActiveMarket();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!props.row.original.is_cancelled && (
              <DropdownMenuItem
                onClick={() => {
                  const contract =
                    marketMetadata.market_type === MarketType.recipe.id
                      ? ContractMap[
                          marketMetadata.chain_id as keyof typeof ContractMap
                        ]["RecipeMarketHub"]
                      : ContractMap[
                          marketMetadata.chain_id as keyof typeof ContractMap
                        ]["VaultMarketHub"];

                  const address = contract.address;
                  const abi = contract.abi;

                  const functionName =
                    props.row.original.offer_side === 0
                      ? marketMetadata.market_type === MarketType.recipe.id
                        ? "cancelAPOffer"
                        : "cancelOffer"
                      : "cancelIPOffer";

                  const marketType = marketMetadata.market_type;

                  const args =
                    props.row.original.offer_side === 0
                      ? marketMetadata.market_type === MarketType.recipe.id
                        ? [
                            {
                              offerID: props.row.original.offer_id,
                              targetMarketHash: marketMetadata.market_id,
                              ap: props.row.original.creator,
                              fundingVault: props.row.original.funding_vault,
                              quantity: props.row.original.quantity,
                              expiry: props.row.original.expiry,
                              incentivesRequested:
                                props.row.original.token_ids.map(
                                  (tokenId: string, tokenIndex: number) => {
                                    const [chainId, contractAddress] =
                                      tokenId.split("-");

                                    return contractAddress;
                                  }
                                ),
                              incentiveAmountsRequested:
                                props.row.original.token_amounts,
                            },
                          ]
                        : [
                            {
                              offerID: props.row.original.offer_id,
                              targetVault: marketMetadata.market_id,
                              ap: props.row.original.creator,
                              fundingVault: props.row.original.funding_vault,
                              expiry: props.row.original.expiry,
                              incentivesRequested:
                                props.row.original.token_ids.map(
                                  (tokenId: string, tokenIndex: number) => {
                                    const [chainId, contractAddress] =
                                      tokenId.split("-");

                                    return contractAddress;
                                  }
                                ),
                              incentivesRatesRequested:
                                props.row.original.token_amounts,
                            },
                          ]
                      : [props.row.original.offer_id];

                  const txOptions: TransactionOptionsType = {
                    contractId:
                      marketMetadata.market_type === MarketType.recipe.id
                        ? "RecipeMarketHub"
                        : "VaultMarketHub",
                    chainId: props.row.original.chain_id,
                    id: `cancel_offer_${props.row.original.id}`,
                    label: `Cancel Limit Offer`,
                    address,
                    abi,
                    functionName,
                    marketType,
                    args,
                    txStatus: "idle",
                    txHash: null,
                  };

                  setTransactions([txOptions]);
                }}
              >
                Cancel offer
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                const explorerUrl = getExplorerUrl({
                  chainId: props.row.original.chain_id,
                  value: props.row.original.transaction_hash,
                  type: "tx",
                });

                window.open(explorerUrl, "_blank", "noopener,noreferrer");
              }}
            >
              View on explorer
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
