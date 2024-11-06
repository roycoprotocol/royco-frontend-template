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
import { MarketType, MarketUserType, useMarketManager } from "@/store";
import { TransactionOptionsType } from "@/sdk/types";
import { useActiveMarket } from "../hooks";
import { ContractMap } from "@/sdk/contracts";
import { BigNumber } from "ethers";
import {
  getRecipeCancelAPOfferTransactionOptions,
  getRecipeCancelIPOfferTransactionOptions,
} from "@/sdk/hooks";
import { getVaultCancelAPOfferTransactionOptions } from "@/sdk/hooks/use-vault-offer-contract-options";

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
                        maximumFractionDigits: 8,
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
              maximumFractionDigits: 8,
            }).format(props.row.original.input_token_data.token_amount_usd)}
          </SecondaryLabel>

          <SecondaryLabel className="text-tertiary">
            {Intl.NumberFormat("en-US", {
              style: "decimal",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
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
      const { transactions, setTransactions, userType } = useMarketManager();

      const { marketMetadata } = useActiveMarket();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!props.row.original.is_cancelled &&
              !BigNumber.from(
                props.row.original.quantity_remaining
              ).isZero() && (
                <DropdownMenuItem
                  onClick={() => {
                    let txOptions: TransactionOptionsType | null = null;

                    if (marketMetadata.market_type === MarketType.recipe.id) {
                      if (userType === MarketUserType.ap.id) {
                        // Cancel Recipe AP Offer
                        txOptions = getRecipeCancelAPOfferTransactionOptions({
                          offer: props.row.original,
                        });
                      } else {
                        // Cancel Recipe IP Offer
                        txOptions = getRecipeCancelIPOfferTransactionOptions({
                          offer: props.row.original,
                        });
                      }
                    } else {
                      // Cancel Vault AP Offer
                      txOptions = getVaultCancelAPOfferTransactionOptions({
                        offer: props.row.original,
                      });
                    }

                    if (txOptions) {
                      setTransactions([txOptions]);
                    }
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
              Creation Transaction
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
