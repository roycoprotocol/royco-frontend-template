import { ColumnDef } from "@tanstack/react-table";
import { useEnrichedPositionsVault } from "royco/hooks";

import { cn } from "@/lib/utils";
import React from "react";

import { TokenDisplayer } from "@/components/common";
import { createPortal } from "react-dom";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";

export type PositionsVaultDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsVault>>["data"]
  >["data"]
>[number];

export type PositionsVaultColumnDataElement = PositionsVaultDataElement & {
  prev: PositionsVaultDataElement | null;
};

// export const actionsVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] =
//   [
//     {
//       id: "actions",
//       enableHiding: false,
//       meta: "",
//       cell: ({ row }) => {
//         const { transactions, setTransactions } = useMarketManager();

//         const { currentMarketData, marketMetadata } = useActiveMarket();

//         let can_be_forfeited = false;

//         if (
//           !!currentMarketData &&
//           currentMarketData.reward_style === 2 && // "2" represents forfeitable position
//           row.original.is_forfeited === false &&
//           row.original.is_claimed &&
//           row.original.is_claimed.every(
//             (isClaimed: boolean) => isClaimed === false
//           ) &&
//           row.original.is_withdrawn === false &&
//           BigNumber.from(row.original.unlock_timestamp).gt(
//             BigNumber.from(Math.floor(Date.now() / 1000))
//           )
//         ) {
//           can_be_forfeited = true;
//         }

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <DotsHorizontalIcon className="h-4 w-4 text-secondary" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="text-sm" align="end">
//               {/* {can_be_forfeited && (
//               <DropdownMenuItem
//                 onClick={() => {
//                   const txOptions = getRecipeForfeitTransactionOptions({
//                     position: props.row.original,
//                   });

//                   setTransactions([...transactions, txOptions]);
//                 }}
//               >
//                 Forfeit All Royco Incentives for Input Asset
//               </DropdownMenuItem>
//             )} */}

//               <DropdownMenuItem
//                 onClick={() => {
//                   const explorerUrl = getExplorerUrl({
//                     chainId: row.original.chain_id ?? 0,
//                     value: row.original.weiroll_wallet ?? "",
//                     type: "address",
//                   });

//                   window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                 }}
//               >
//                 View Weiroll Wallet on{" "}
//                 {getSupportedChain(row.original.chain_id ?? 0)?.name}
//               </DropdownMenuItem>

//               {row.original.deposit_transaction_hash && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     const explorerUrl = getExplorerUrl({
//                       chainId: row.original.chain_id ?? 0,
//                       value: row.original.deposit_transaction_hash ?? "",
//                       type: "tx",
//                     });

//                     window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                   }}
//                 >
//                   View Deposit Transaction on{" "}
//                   {getSupportedChain(row.original.chain_id ?? 0)?.name}
//                 </DropdownMenuItem>
//               )}

//               {row.original.bridge_transaction_hash && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     const explorerUrl = getExplorerUrl({
//                       chainId: row.original.chain_id ?? 0,
//                       value: row.original.bridge_transaction_hash ?? "",
//                       type: "tx",
//                     });

//                     window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                   }}
//                 >
//                   View Bridge Transaction on{" "}
//                   {getSupportedChain(row.original.chain_id ?? 0)?.name}
//                 </DropdownMenuItem>
//               )}

//               {row.original.forfeit_transaction_hash && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     const explorerUrl = getExplorerUrl({
//                       chainId: row.original.chain_id ?? 0,
//                       value: row.original.forfeit_transaction_hash ?? "",
//                       type: "tx",
//                     });

//                     window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                   }}
//                 >
//                   View Withdraw Transaction on{" "}
//                   {getSupportedChain(row.original.chain_id ?? 0)?.name}
//                 </DropdownMenuItem>
//               )}

//               {row.original.process_transaction_hash && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     const explorerUrl = getExplorerUrl({
//                       chainId: row.original.chain_id ?? 0,
//                       value: row.original.process_transaction_hash ?? "",
//                       type: "tx",
//                     });

//                     window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                   }}
//                 >
//                   View Bridge Transaction on{" "}
//                   {getSupportedChain(row.original.chain_id ?? 0)?.name}
//                 </DropdownMenuItem>
//               )}

//               {row.original.withdraw_transaction_hash && (
//                 <DropdownMenuItem
//                   onClick={() => {
//                     const explorerUrl = getExplorerUrl({
//                       chainId: row.original.chain_id ?? 0,
//                       value: row.original.withdraw_transaction_hash ?? "",
//                       type: "tx",
//                     });

//                     window.open(explorerUrl, "_blank", "noopener,noreferrer");
//                   }}
//                 >
//                   View Withdraw Transaction on{" "}
//                   {getSupportedChain(row.original.chain_id ?? 0)?.name}
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

export const baseVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] = [
  {
    accessorKey: "market_value",
    enableResizing: true,
    enableSorting: false,
    header: "Market Value",
    meta: "text-left",
    cell: ({ row }) => {
      const input_token_value = row.original.input_token_data.token_amount_usd;

      const incentive_tokens_value = row.original.tokens_data.reduce(
        (acc, token, index) => {
          return acc + token.token_amount_usd;
        },
        0
      );

      const market_value = input_token_value + incentive_tokens_value;

      return (
        <div className={cn("")}>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "standard",
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(market_value)}
        </div>
      );
    },
  },
  {
    accessorKey: "assets_in_vault",
    enableResizing: true,
    enableSorting: false,
    header: "Assets in Vault",
    meta: "text-left",
    cell: ({ row }) => {
      const input_token_value = row.original.input_token_data.token_amount_usd;

      return (
        <div className={cn("flex w-fit flex-row items-center gap-2")}>
          <div>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }).format(input_token_value)}
          </div>

          <TokenDisplayer
            size={4}
            tokens={[row.original.input_token_data] as any}
            symbols={true}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "unclaimed_incentives",
    enableResizing: true,
    enableSorting: false,
    header: "Accumulated Incentives",
    meta: "text-left",
    cell: ({ row }) => {
      let unclaimed_first_incentive = 0;

      if (row.original.tokens_data.length > 0) {
        unclaimed_first_incentive = row.original.tokens_data[0].token_amount;
      }

      if (row.original.offer_side === 1) {
        return <div className={cn("")}>Not Applicable</div>;
      } else {
        return (
          <div className={cn("flex w-fit flex-row items-center gap-2")}>
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger
                className={cn("flex cursor-pointer items-end gap-1")}
              >
                <span>
                  {Intl.NumberFormat("en-US", {
                    notation: "standard",
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  }).format(unclaimed_first_incentive)}
                </span>

                <TokenDisplayer
                  size={4}
                  tokens={row.original.tokens_data as any}
                  symbols={true}
                />
              </HoverCardTrigger>
              {typeof window !== "undefined" &&
                row.original.tokens_data.length > 0 &&
                createPortal(
                  <HoverCardContent
                    className="min-w-40 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.original.tokens_data.map((item) => (
                      <div
                        key={`incentive-breakdown:${row.original.id}:${item.id}`}
                        className="flex flex-row items-center justify-between font-light"
                      >
                        <TokenDisplayer
                          size={4}
                          tokens={[item] as any}
                          symbols={true}
                        />

                        {item.token_amount && (
                          <div className="ml-2 flex flex-row items-center gap-2 text-sm">
                            {Intl.NumberFormat("en-US", {
                              notation: "standard",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 8,
                              useGrouping: true,
                            }).format(item.token_amount)}
                          </div>
                        )}
                      </div>
                    ))}
                  </HoverCardContent>,
                  document.body
                )}
            </HoverCard>
          </div>
        );
      }
    },
  },
];

export const positionsVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] =
  [...baseVaultColumns];
