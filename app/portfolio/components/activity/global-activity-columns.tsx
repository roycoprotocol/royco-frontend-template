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
import { ContentFlow } from "@/components/animations/content-flow";
import { DotIcon } from "lucide-react";
import { EnrichedActivity } from "royco/api";
import { getExplorerUrl } from "royco/utils";
import { ExternalLinkIcon } from "@/assets/icons/external-link";

export type GlobalActivityColumnDataElement = EnrichedActivity;

export const globalActivityColumns: ColumnDef<GlobalActivityColumnDataElement>[] =
  [
    {
      accessorKey: "left",
      enableResizing: true,
      enableSorting: false,
      meta: { className: "text-left w-full", align: "left" },
      cell: ({ row }) => {
        let sourceName = null;

        if (row.original.sourceInfo?.name) {
          sourceName = row.original.sourceInfo.name;
        }

        let title = `Transfer ${row.original.activityToken.symbol}`;

        if (row.original.subCategory === "deposit") {
          title = `Deposit ${row.original.activityToken.symbol}`;
        } else if (row.original.subCategory === "withdraw") {
          title = `Withdraw ${row.original.activityToken.symbol}`;
        } else if (row.original.subCategory === "claim") {
          title = `Claim ${row.original.activityToken.symbol}`;
        } else if (row.original.subCategory === "withdraw-requested") {
          title = `Withdraw ${row.original.activityToken.symbol}`;
        } else if (row.original.subCategory === "withdraw-cancelled") {
          title = `Withdraw ${row.original.activityToken.symbol}`;
        } else if (row.original.subCategory === "withdraw-complete") {
          title = `Withdraw ${row.original.activityToken.symbol}`;
        }

        let activityTimestamp = `${formatDate(
          Number(row.original.blockTimestamp) * 1000,
          "MMM d, yyyy"
        )}`;

        return (
          <ContentFlow customKey={`token:${row.original.id}:left`}>
            <div className={cn("flex items-center gap-3")}>
              <TokenDisplayer
                size={6}
                tokens={[row.original.activityToken]}
                symbols={false}
              />

              <div>
                <PrimaryLabel className="text-base font-normal text-_primary_">
                  {title}
                </PrimaryLabel>

                <SecondaryLabel className="mt-1 flex flex-row items-center text-xs font-normal text-_secondary_">
                  <div>{activityTimestamp}</div>

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
      accessorKey: "right",
      enableResizing: true,
      enableSorting: false,
      header: "",
      meta: { className: "text-right min-w-32", align: "right" },
      cell: ({ row }) => {
        const amount = formatNumber(row.original.activityToken.tokenAmount, {
          type: "number",
        });

        let status = "Complete";

        if (row.original.subCategory === "withdraw-requested") {
          status = "Requested";
        } else if (row.original.subCategory === "withdraw-cancelled") {
          status = "Cancelled";
        }

        return (
          <ContentFlow customKey={`token:${row.original.id}:right`}>
            <div className={cn("flex flex-col items-end")}>
              <PrimaryLabel className="text-base font-normal text-_primary_">
                {amount}
              </PrimaryLabel>

              <SecondaryLabel className="mt-1 flex flex-row items-center gap-[0.3rem] text-xs font-normal text-_secondary_">
                <div className={cn(status === "Cancelled" && "text-error")}>
                  {status}
                </div>
                <div
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chainId,
                      value: row.original.transactionHash,
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <ExternalLinkIcon className="h-4 w-4 cursor-pointer opacity-90 transition-all duration-200 ease-in-out hover:opacity-70" />
                </div>
              </SecondaryLabel>
            </div>
          </ContentFlow>
        );
      },
    },
  ];
