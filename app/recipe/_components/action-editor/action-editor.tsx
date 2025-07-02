"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { recipeActionsAtom } from "@/store/recipe";
import { useAtom } from "jotai";
import {
  CircleIcon,
  ExternalLinkIcon,
  GripIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { toFunctionSelector, toFunctionSignature } from "viem";
import { getExplorerUrl, shortAddress } from "royco/utils";

export const RecipeActionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    action: {
      id: string;
      callType: 0 | 1 | 2;
      callValue: string;
      address: string;
      name: string;
      inputs: {
        name: string;
        type: string;
        inputType: "fixed" | "dynamic";
        fixedValue: string;
        dynamicValue: number;
      }[];
      outputs: {
        name: string;
        type: string;
      }[];
      stateMutability: "pure" | "view" | "nonpayable" | "payable";
      type: "function" | "constructor" | "event" | "error";
    };
    actionIndex: number;
  }
>(({ className, action, actionIndex, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  const functionSignature = toFunctionSignature({
    ...action,
    type: "function" as const,
    stateMutability: action.stateMutability as
      | "pure"
      | "view"
      | "nonpayable"
      | "payable",
  });

  const hexSignature = toFunctionSelector(functionSignature);

  const deleteAction = () => {
    setRecipeActions(recipeActions.filter((_, index) => index !== actionIndex));
  };

  return (
    <div
      ref={ref}
      {...props}
      className="flex w-full flex-col border border-_divider_ bg-white px-2 py-1"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <GripIcon strokeWidth={1.5} className="h-5 w-5 text-_tertiary_" />

          <div className="flex h-5 w-5 flex-col items-center justify-center bg-_secondary_ text-base font-normal text-white">
            {actionIndex + 1}
          </div>

          <div className="flex flex-col">
            <div className="font-normal text-_primary_">
              {functionSignature}
            </div>

            <div className="mt-[0.1rem] flex flex-row items-center gap-1  text-_secondary_">
              <div className="font-normal">{action.stateMutability}</div>
              <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />
              <div>{hexSignature}</div>{" "}
              <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />
              <div>{shortAddress(action.address)}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <ExternalLinkIcon
            // onClick={() => {
            //   const explorerUrl = getExplorerUrl({
            //     chainId:
            //   })
            // }}
            className="h-4 w-4 cursor-pointer text-_tertiary_"
          />
          <Trash2Icon
            onClick={deleteAction}
            className="h-4 w-4 cursor-pointer text-_tertiary_"
          />
        </div>
      </div>
    </div>
  );
});

export const ActionEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col gap-1 bg-_surface_secondary p-2 text-xs",
        className
      )}
    >
      <div>Recipe Actions</div>

      {recipeActions.map((action, actionIndex) => {
        return (
          <RecipeActionRow
            key={action.id}
            action={action}
            actionIndex={actionIndex}
          />
        );
      })}
    </div>
  );
});

ActionEditor.displayName = "ActionEditor";
