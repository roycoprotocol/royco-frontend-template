"use client";

import React from "react";
import { PoolFormUtilities } from "../../market-builder-form";

import { ExternalLinkIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";
import { getExplorerUrl } from "@/sdk/utils";

export const ActionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    PoolFormUtilities & {
      draggableProvided: any;
      action: any;
      index: number;
    }
>(
  (
    {
      className,
      watchMarketBuilderForm,
      setValueMarketBuilderForm,
      controlMarketBuilderForm,
      draggableProvided,
      action,
      index,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex w-full shrink-0 flex-row items-center justify-between space-x-2">
        <div className="flex w-fit flex-row items-center space-x-2">
          <div className="h-6 w-6" {...draggableProvided.dragHandleProps}>
            <GripVerticalIcon className="h-6 w-6 cursor-grab text-tertiary" />
          </div>

          <div className="flex w-3/12 shrink-0 flex-col items-start">
            <div className="body-2 text-primary">
              {action.contract_function.name === ""
                ? "Unknown"
                : action.contract_function.name}
            </div>
            <div className="text-xs leading-5 text-tertiary">
              {action.contract_address.slice(0, 6)}...
              {action.contract_address.slice(-4)}
            </div>
          </div>
        </div>

        <div className="flex w-fit flex-row items-center space-x-3">
          <ExternalLinkIcon
            onClick={() => {
              const explorerUrl = getExplorerUrl({
                chainId: watchMarketBuilderForm("chain").id,
                value: action.contract_address,
                type: "address",
              });

              window.open(explorerUrl, "_blank", "noopener,noreferrer");
            }}
            className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
          />
          <Trash2Icon
            onClick={() => {
              // const newAssets = watchMarketBuilderForm("assets").filter(
              //   (item) => item.address !== action.contract_address
              // );
              // setValueMarketBuilderForm("assets", newAssets);

              const newActions = watchMarketBuilderForm("actions").filter(
                (item, idx) => {
                  if (
                    item.contract_address === action.contract_address &&
                    idx === index
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                }
              );

              setValueMarketBuilderForm("actions", newActions);
            }}
            className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
          />
        </div>
      </div>
    );
  }
);
