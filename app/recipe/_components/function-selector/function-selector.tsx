"use client";

import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useAtom } from "jotai";
import {
  recipeContractAbiAtom,
  recipeContractAbiStatusAtom,
  recipeContractAddressAtom,
  recipeContractAddressStatusAtom,
  recipeContractFunctionsAtom,
} from "@/store/recipe";
import { isAlphanumeric } from "validator";
import {
  AlertTriangleIcon,
  CheckIcon,
  CircleIcon,
  ListPlusIcon,
  SquarePenIcon,
  XIcon,
} from "lucide-react";
import { toFunctionSignature, toFunctionSelector } from "viem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { recipeActionsAtom } from "@/store/recipe";

export const ContractFunctionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    functionItem: {
      id: string;
      address: string;
      name: string;
      inputs: {
        name: string;
        type: string;
      }[];
      outputs: {
        name: string;
        type: string;
      }[];
      stateMutability: "pure" | "view" | "nonpayable" | "payable";
      type: "function" | "constructor" | "event" | "error";
    };
  }
>(({ className, functionItem, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  const functionSignature = toFunctionSignature({
    ...functionItem,
    type: "function" as const,
    stateMutability: functionItem.stateMutability as
      | "pure"
      | "view"
      | "nonpayable"
      | "payable",
  });
  const hexSignature = toFunctionSelector(functionSignature);

  return (
    <div
      onClick={() => {
        const newActionIndex = recipeActions.length;

        const newActions = [
          ...recipeActions,
          {
            ...functionItem,
            id: `${newActionIndex}_${hexSignature}`,
            address: functionItem.address.toLowerCase(),
            callType: 0 as const,
            callValue: "",
            inputs: functionItem.inputs.map((input) => ({
              name: input.name,
              type: input.type,
              inputType: "fixed" as const,
              fixedValue: "",
              dynamicValue: -1,
            })),
          },
        ];

        setRecipeActions(newActions);
      }}
      ref={ref}
      {...props}
      key={functionItem.id}
      className="flex cursor-pointer flex-row items-center justify-between px-2 py-2 hover:bg-focus"
    >
      <div className="flex flex-col">
        <div className="font-normal text-_primary_">{functionSignature}</div>
        <div className="mt-[0.1rem] flex flex-row items-center gap-1  text-_secondary_">
          <div className="font-normal">{functionItem.stateMutability}</div>

          <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />

          <div>{hexSignature}</div>
        </div>
      </div>

      <div className="pr-2">
        <ListPlusIcon strokeWidth={1.5} className="h-5 w-5 text-_tertiary_" />
      </div>
    </div>
  );
});

export const FunctionSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [contractAddress, setContractAddress] = useAtom(
    recipeContractAddressAtom
  );
  const [contractAddressStatus, setContractAddressStatus] = useAtom(
    recipeContractAddressStatusAtom
  );

  const [contractAbi, setContractAbi] = useAtom(recipeContractAbiAtom);
  const [contractAbiStatus, setContractAbiStatus] = useAtom(
    recipeContractAbiStatusAtom
  );

  const [contractFunctions, setContractFunctions] = useAtom(
    recipeContractFunctionsAtom
  );

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col gap-1 bg-_surface_tertiary p-2 text-xs",
        className
      )}
    >
      {/* <div>Chain Selector</div> */}

      <div className="flex flex-row">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 flex-col items-center justify-center border border-r-0 border-_divider_ bg-white transition-all duration-200 ease-in-out",
            contractAddressStatus.status === "valid" && "bg-success",
            contractAddressStatus.status === "invalid" && "bg-error",
            contractAddressStatus.status === "empty" && "bg-_tertiary_"
          )}
        >
          {contractAddressStatus.status === "empty" ? (
            <SquarePenIcon strokeWidth={1.5} className="h-5 w-5 text-white" />
          ) : contractAddressStatus.status === "valid" ? (
            <CheckIcon strokeWidth={1.5} className="h-5 w-5 text-white" />
          ) : (
            <XIcon strokeWidth={1.5} className="h-5 w-5 text-white" />
          )}
        </div>

        <Input
          placeholder="Contract Address"
          containerClassName="w-full rounded-none bg-_surface_ border-_divider_ text-xs h-8 px-2 py-1"
          value={contractAddress}
          onChange={(e) => {
            if (isAlphanumeric(e.target.value)) {
              setContractAddress(e.target.value);
            } else if (e.target.value === "") {
              setContractAddress("");
            }
          }}
        />
      </div>

      <div className="flex h-[30%] flex-col">
        <AutosizeTextarea
          placeholder={JSON.stringify(
            [
              {
                inputs: [],
                name: "liquidity",
                outputs: [
                  {
                    internalType: "string",
                    name: "",
                    type: "string",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            null,
            4
          )}
          className={cn(
            "h-full flex-1 rounded-none border-_divider_ bg-_surface_ px-2 py-1 text-xs"
            // error && "border-error"
          )}
          value={contractAbi}
          onChange={(e) => {
            try {
              const parsedAbi = JSON.parse(e.target.value);
              setContractAbi(JSON.stringify(parsedAbi, null, 2));
            } catch {
              setContractAbi(e.target.value);
            }
          }}
        />

        <div
          className={cn(
            "w-full shrink-0 border border-t-0 border-_divider_ px-2 text-xs font-normal text-white",
            contractAbiStatus.status === "valid" && "bg-success",
            contractAbiStatus.status === "invalid" && "bg-error",
            contractAbiStatus.status === "empty" && "bg-_tertiary_"
          )}
        >
          {contractAbiStatus.message}
        </div>
      </div>

      <div className="w-full flex-1 overflow-hidden border border-_divider_ bg-_surface_ text-xs">
        <ScrollArea className="h-full px-2">
          {contractFunctions.length > 0 ? (
            <div className="flex flex-col divide-y divide-_divider_">
              {contractFunctions.map((functionItem) => {
                return (
                  <ContractFunctionRow
                    key={functionItem.id}
                    functionItem={functionItem}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-5 text-center">
              <AlertTriangleIcon
                strokeWidth={1.5}
                className="h-6 w-6 text-_tertiary_"
              />

              {contractAbiStatus.status === "empty" ? (
                <div className="text-_secondary_">
                  Enter a verified contract address / valid ABI to see functions
                </div>
              ) : (
                <div className="text-_secondary_">No functions found</div>
              )}
            </div>
          )}

          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      <div
        className={cn(
          "-mt-1 border border-t-0 border-_divider_ px-2 text-xs font-normal text-white",
          contractFunctions.length === 0 && "bg-_tertiary_",
          contractFunctions.length > 0 && "bg-success"
        )}
      >
        {contractFunctions.length} Functions
      </div>
    </div>
  );
});

FunctionSelector.displayName = "FunctionSelector";
