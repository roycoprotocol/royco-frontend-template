"use client";

import React, { useMemo } from "react";
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
} from "@/store/recipe";
import { isAlphanumeric } from "validator";
import { CheckIcon, SquarePenIcon, XIcon } from "lucide-react";
import { isAddress } from "viem";

export const FunctionSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
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

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col gap-1 bg-_surface_tertiary p-2", className)}
    >
      <div className="flex flex-row">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 flex-col items-center justify-center border border-_divider_ bg-white transition-all duration-200 ease-in-out",
            contractAddressStatus.status === "valid" && "bg-success",
            contractAddressStatus.status === "invalid" && "bg-error",
            contractAddressStatus.status === "empty" && "bg-tertiary"
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

      <div>
        <div
          className={cn(
            "w-full border border-b-0 border-_divider_ px-2 py-1 text-xs font-light text-white",
            contractAbiStatus.status === "valid" && "bg-success",
            contractAbiStatus.status === "invalid" && "bg-error",
            contractAbiStatus.status === "empty" && "bg-tertiary"
          )}
        >
          {contractAbiStatus.message}
        </div>
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
            "flex-1 rounded-none border-_divider_ bg-_surface_ px-2 py-1 text-xs"
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
      </div>

      <div className="w-full border border-_divider_ bg-_surface_ px-2 py-1 text-xs">
        Function List
      </div>
    </div>
  );
});

FunctionSelector.displayName = "FunctionSelector";
