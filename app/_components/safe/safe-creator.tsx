"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import {
  vaultManagerAtom,
  vaultMetadataAtom,
} from "@/store/vault/vault-manager";
import { Input } from "@/components/ui/input";
import { ThemedInput } from "../common/themed-input";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  CheckIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { safeOwnersAtom, safeThresholdAtom } from "@/store/safe/create";
import { isAddress } from "viem";
import { Counter } from "@/components/animate-ui/components/counter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipProviderProps,
  type TooltipProps,
  type TooltipContentProps,
} from "@/components/animate-ui/components/tooltip";
import {
  MarketTransactionType,
  useTransactionManager,
} from "@/store/global/use-transaction-manager";
import { RoycoAbi } from "./safe-abi";

const SafeOwnerEntry = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    canDelete: boolean;
    value: string;
    message: string;
    onChange: (value: string) => void;
    status: "valid" | "invalid" | "empty";
    onDelete: () => void;
  }
>(
  (
    {
      className,
      value,
      onChange,
      canDelete,
      status,
      onDelete,
      message,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex flex-row items-center gap-3", className)}
      >
        <TooltipProvider openDelay={0} closeDelay={200}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="base"
                size="small"
                colorScheme={
                  status === "empty"
                    ? "tertiary"
                    : status === "valid"
                      ? "success"
                      : "error"
                }
                className="h-8 w-8"
              >
                {status === "empty" ? (
                  <Edit2Icon className="h-5 w-5" />
                ) : status === "valid" ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <AlertCircleIcon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ThemedInput
          pattern="[a-zA-Z0-9]*"
          containerClassName="flex-1"
          placeholder="Enter wallet address here..."
          value={value}
          onChange={onChange}
        />

        <Button
          variant="base"
          size="small"
          colorScheme={canDelete ? "error" : "disabled"}
          className="h-8 w-8"
          disabled={!canDelete}
          onClick={onDelete}
        >
          <Trash2Icon className="h-5 w-5" />
        </Button>
      </div>
    );
  }
);

export const SafeCreator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setTransactions } = useTransactionManager();

  const [safeOwners, setSafeOwners] = useAtom(safeOwnersAtom);
  const [threshold, setThreshold] = useAtom(safeThresholdAtom);

  const isValid = useMemo(() => {
    return (
      safeOwners.length > 0 &&
      safeOwners.every((owner, index) => {
        if (!owner || owner.trim().length === 0 || !isAddress(owner)) {
          return false;
        }

        // Check for duplicates
        const trimmedOwner = owner.trim().toLowerCase();
        const duplicateCount = safeOwners.filter(
          (o) => o.trim().toLowerCase() === trimmedOwner
        ).length;

        return duplicateCount === 1;
      }) &&
      threshold >= 1 &&
      threshold <= safeOwners.length
    );
  }, [safeOwners, threshold]);

  const handleSafeCreation = async () => {
    setTransactions({
      type: MarketTransactionType.CreateSafe,
      title: "Create new Royco Safe",
      description: "This safe will be used to manage your assets across royco",
      steps: [
        {
          type: MarketTransactionType.CreateSafe,
          label: "Create Safe",
          id: "create_safe",
          chainId: 11155111,
          contractId: "Royco",
          category: "safe",
          data: {
            address: "0xA7081d927570A98B74f0448E7C83c91b499C5847",
            abi: RoycoAbi,
            functionName: "deployRoycoAccount",
            args: [
              safeOwners.map(
                (owner) => owner.trim().toLowerCase() as `0x${string}`
              ),
              threshold,
            ],
          },
          txStatus: "idle",
          txHash: null,
        },
      ],
    });
  };

  useEffect(() => {
    if (threshold < 1 || threshold > safeOwners.length) {
      setThreshold(1);
    }
  }, [threshold, safeOwners.length]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full max-w-xl flex-col border border-divider p-3 md:p-5",
        className
      )}
    >
      <div>Title: Create Safe</div>
      <div>
        Description: Create a new safe to manage your assets across royco
      </div>

      {/**
       * === Safe Owners ===
       */}
      <div className="mt-7">Sub Title 1: Safe Owners</div>
      <div>Description: Add the owners of the safe.</div>

      <div className="mt-3 flex flex-col gap-2">
        {safeOwners.map((owner, index) => {
          let status: "valid" | "invalid" | "empty" = "valid";
          let message: string = "Address is valid";

          if (!owner || owner.length === 0 || owner.trim().length < 42) {
            status = "empty";
            message = "Address is empty";
          } else if (owner.trim().length > 42) {
            status = "invalid";
            message = "Address is invalid";
          } else {
            let previousOwners = safeOwners.slice(0, index);

            let existsPreviously = previousOwners.some(
              (o) => o.trim().toLowerCase() === owner.trim().toLowerCase()
            );

            if (existsPreviously) {
              status = "invalid";
              message = "Address already exists";
            }
          }

          return (
            <SafeOwnerEntry
              key={`safe:create:owner:${index}`}
              canDelete={safeOwners.length > 1}
              value={owner}
              status={status}
              message={message}
              onChange={(value) => {
                const stringValue =
                  typeof value === "string"
                    ? value
                    : (value as any)?.target?.value || "";

                // Filter out non-alphanumeric characters and spaces
                const filteredValue = stringValue.replace(/[^a-zA-Z0-9]/g, "");
                let newOwners = [...safeOwners];
                newOwners[index] = filteredValue;

                setSafeOwners(newOwners);
              }}
              onDelete={() => {
                let newOwners = [...safeOwners];
                newOwners.splice(index, 1);
                setSafeOwners(newOwners);
              }}
            />
          );
        })}
      </div>

      <Button
        border="divider"
        className="mt-3 font-medium"
        variant="base"
        size="small"
        height="medium"
        colorScheme="surface_secondary"
        onClick={() => {
          setSafeOwners([...safeOwners, ""]);
        }}
      >
        Add More
      </Button>
      {/**
       * xxx Safe Owners xxx
       */}

      {/**
       * === Safe Threshold ===
       */}
      <div className="mt-7">Sub Title 2: Safe Threshold</div>
      <div>
        Description: Number of confirmations required to execute a transaction
        from safe.
      </div>

      <Counter
        number={threshold}
        setNumber={(value) => {
          if (value < 1 || value > safeOwners.length) return;
          setThreshold(value);
        }}
        className="mt-3"
      />

      {/**
       * xxx Safe Threshold xxx
       */}
      <Button
        onClick={handleSafeCreation}
        colorScheme="highlight"
        className="mt-7 h-9 w-full rounded-none border-none disabled:opacity-100"
        disabled={!isValid}
      >
        Create
      </Button>
    </div>
  );
});
