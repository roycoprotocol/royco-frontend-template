import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { ContentFlow } from "@/components/animations/content-flow";

export type PointRewardsColumnDataElement =
  BaseEnrichedTokenDataWithClaimInfo & {
    isClaimed: boolean;
  };

export const pointRewardsColumns: ColumnDef<PointRewardsColumnDataElement>[] = [
  {
    accessorKey: "amount",
    enableResizing: true,
    enableSorting: false,
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      let description = "";

      if (row.original?.isClaimed) {
        description = "Claimed";
      } else if (row.original?.isUnlocked) {
        // description = "Claimable";
        description = "Claimed";
      } else {
        if (row.original?.unlockTimestamp) {
          description = `Unlocks at ${formatDate(
            Number(row.original.unlockTimestamp) * 1000,
            "MMM d, yyyy"
          )}`;
        } else {
          description = "-";
        }
      }

      return (
        <ContentFlow customKey={`point:${row.original.id}:amount`}>
          <div className={cn("flex items-center gap-3")}>
            <TokenDisplayer size={6} tokens={[row.original]} symbols={false} />

            <div>
              <PrimaryLabel className="text-base font-normal text-_primary_">
                {`${formatNumber(row.original.tokenAmount, { type: "number" })} ${row.original.label || row.original.symbol}`}
              </PrimaryLabel>

              <SecondaryLabel className="mt-1 flex flex-row items-center text-xs font-normal text-_secondary_">
                <div>{description}</div>
              </SecondaryLabel>
            </div>
          </div>
        </ContentFlow>
      );
    },
  },
  // {
  //   accessorKey: "claim",
  //   enableResizing: true,
  //   enableSorting: false,
  //   header: "",
  //   meta: { className: "text-right min-w-32", align: "right" },
  //   cell: ({ row }) => {
  //     const accountAddress = useAtomValue(accountAddressAtom);

  //     const [transactions, setTransactions] = useAtom(
  //       portfolioTransactionsAtom
  //     );

  //     let canClaim = false;

  //     const isClaimed = row.original.isClaimed;

  //     if (row.original.isUnlocked && accountAddress) {
  //       if (row.original.claimInfo?.recipe || row.original.claimInfo?.vault) {
  //         canClaim = true;
  //       }
  //     }

  //     const onClick = () => {
  //       if (accountAddress) {
  //         if (row.original.claimInfo?.recipe) {
  //           const txOptions = claimRecipeIncentiveTokenTxOptions({
  //             chainId: Number(
  //               row.original.claimInfo?.recipe.rawMarketRefId.split("_")[0]
  //             ),
  //             tokenAddress: row.original.contractAddress,
  //             weirollWallet: row.original.claimInfo?.recipe.weirollWallet,
  //             accountAddress: accountAddress,
  //           });

  //           setTransactions({
  //             title: `Claim Incentive`,
  //             successTitle: `Incentive Claimed `,
  //             steps: txOptions,
  //             token: row.original,
  //           });
  //         } else if (row.original.claimInfo?.vault) {
  //           const txOptions = claimVaultIncentiveTokenTxOptions({
  //             chainId: Number(
  //               row.original.claimInfo?.vault.rawMarketRefId.split("_")[0]
  //             ),
  //             vaultAddress:
  //               row.original.claimInfo?.vault.rawMarketRefId.split("_")[2],
  //             tokenAddress: row.original.contractAddress,
  //             accountAddress,
  //           });

  //           setTransactions({
  //             title: `Claim Incentive`,
  //             successTitle: `Incentive Claimed `,
  //             steps: txOptions,
  //             token: row.original,
  //           });
  //         }
  //       }
  //     };

  //     if (!isClaimed) {
  //       return (
  //         <ContentFlow customKey={`point:${row.original.id}:claim`}>
  //           <div className={cn("flex flex-col items-end")}>
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className={cn(
  //                 "text-sm font-semibold hover:bg-success/10 hover:text-primary",
  //                 !canClaim && "opacity-50"
  //               )}
  //               onClick={onClick}
  //               disabled={!canClaim}
  //             >
  //               <GradientText>Claim</GradientText>
  //             </Button>
  //           </div>
  //         </ContentFlow>
  //       );
  //     }
  //   },
  // },
];
