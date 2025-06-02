import React, { Fragment } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/app/vault/common/gradient-text";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { useAtom, useAtomValue } from "jotai";
import { portfolioTransactionsAtom } from "@/store/portfolio";
import {
  claimRecipeIncentiveTokenTxOptions,
  claimVaultIncentiveTokenTxOptions,
} from "royco/transaction";
import { accountAddressAtom } from "@/store/global";
import { ContentFlow } from "@/components/animations/content-flow";
import { DotIcon } from "lucide-react";

export type TokenRewardsColumnDataElement = BaseEnrichedTokenDataWithClaimInfo;

export const tokenRewardsColumns: ColumnDef<TokenRewardsColumnDataElement>[] = [
  {
    accessorKey: "amount",
    enableResizing: true,
    enableSorting: false,
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      let sourceName = null;
      let description = "";

      if (row.original.claimInfo?.recipe) {
        sourceName = row.original.claimInfo.recipe.name;
      } else if (row.original.claimInfo?.vault) {
        sourceName = row.original.claimInfo.vault.name;
      }

      if (row.original.isUnlocked) {
        description = "Claimable";
      } else {
        if (row.original.unlockTimestamp) {
          description = `Unlocks at ${formatDate(
            Number(row.original.unlockTimestamp) * 1000,
            "MMM d, yyyy"
          )}`;
        } else {
          description = "-";
        }
      }

      return (
        <ContentFlow customKey={`token:${row.original.id}:amount`}>
          <div className={cn("flex items-center gap-3")}>
            <TokenDisplayer size={6} tokens={[row.original]} symbols={false} />

            <div>
              <PrimaryLabel className="text-base font-normal text-_primary_">
                {`${formatNumber(row.original.tokenAmount, { type: "number" })} ${row.original.label || row.original.symbol}`}
              </PrimaryLabel>

              <SecondaryLabel className="mt-1 flex flex-row items-center text-xs font-normal text-_secondary_">
                <div>{description}</div>

                {sourceName && (
                  <Fragment>
                    <DotIcon className="h-5 w-5 text-_secondary_" />
                    <div className="text-xs font-normal text-_secondary_">
                      {sourceName}
                    </div>
                  </Fragment>
                )}
              </SecondaryLabel>
            </div>
          </div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "claim",
    enableResizing: true,
    enableSorting: false,
    header: "",
    meta: { className: "text-right min-w-32", align: "right" },
    cell: ({ row }) => {
      const accountAddress = useAtomValue(accountAddressAtom);

      const [transactions, setTransactions] = useAtom(
        portfolioTransactionsAtom
      );

      let canClaim = false;

      if (row.original.isUnlocked && accountAddress) {
        if (row.original.claimInfo?.recipe || row.original.claimInfo?.vault) {
          canClaim = true;
        }
      }

      const onClick = () => {
        if (accountAddress) {
          if (row.original.claimInfo?.recipe) {
            const txOptions = claimRecipeIncentiveTokenTxOptions({
              chainId: Number(
                row.original.claimInfo?.recipe.rawMarketRefId.split("_")[0]
              ),
              tokenAddress: row.original.contractAddress,
              weirollWallet: row.original.claimInfo?.recipe.weirollWallet,
              accountAddress: accountAddress,
            });

            setTransactions({
              title: `Claim Incentive`,
              successTitle: `Incentive Claimed `,
              steps: txOptions,
              token: row.original,
            });
          } else if (row.original.claimInfo?.vault) {
            const txOptions = claimVaultIncentiveTokenTxOptions({
              chainId: Number(
                row.original.claimInfo?.vault.rawMarketRefId.split("_")[0]
              ),
              vaultAddress:
                row.original.claimInfo?.vault.rawMarketRefId.split("_")[2],
              tokenAddress: row.original.contractAddress,
              accountAddress,
            });

            setTransactions({
              title: `Claim Incentive`,
              successTitle: `Incentive Claimed `,
              steps: txOptions,
              token: row.original,
            });
          }
        }
      };

      return (
        <ContentFlow customKey={`token:${row.original.id}:claim`}>
          <div className={cn("flex flex-col items-end")}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm font-semibold hover:bg-success/10 hover:text-primary",
                !canClaim && "opacity-50"
              )}
              onClick={onClick}
              disabled={!canClaim}
            >
              <GradientText>Claim</GradientText>
            </Button>
          </div>
        </ContentFlow>
      );
    },
  },
];
