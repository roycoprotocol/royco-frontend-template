"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useAtom } from "jotai";
import {
  RecipeActionCallType,
  RecipeActionInput,
  RecipeActionStatus,
  RecipeActionValueType,
  recipeChainIdAtom,
  recipeContractAbiAtom,
  recipeContractAbiStatusAtom,
  recipeContractAddressAtom,
  recipeContractAddressStatusAtom,
  recipeContractFunctionsAtom,
  RecipeFunctionInput,
  RecipeFunctionType,
} from "@/store/recipe";
import { isAlphanumeric } from "validator";
import {
  AlertTriangleIcon,
  CheckCheckIcon,
  CheckIcon,
  CircleIcon,
  ListPlusIcon,
  SearchIcon,
  SquarePenIcon,
  XIcon,
} from "lucide-react";
import { toFunctionSignature, toFunctionSelector, isAddress } from "viem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { recipeActionsAtom } from "@/store/recipe";
import { api } from "@/app/api/royco";
import { toast } from "sonner";
import { getSupportedChain, shortAddress } from "royco/utils";
import { ActionInputStatus, ActionInputStatusMessage } from "../constants";
import { LoadingCircle } from "@/components/animations/loading-circle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArbitrumOne,
  EthereumMainnet,
  EthereumSepolia,
  Corn,
  Hyperevm,
  Plume,
  Sonic,
} from "royco/constants";
import { TokenDisplayer } from "@/app/_components/common/token-displayer";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import { v4 as uuidv4 } from "uuid";
import { RecipeFunction } from "@/store/recipe";
import { CommandFlags } from "@/weiroll/planner";
import { findBaseInputType } from "@/weiroll/utils";

export const RecipeChains = [
  EthereumSepolia,
  EthereumMainnet,
  ArbitrumOne,
  Sonic,
  Plume,
  Hyperevm,
  Corn,
];

export const getRecipeFunctionInput = (
  input: RecipeFunction["inputs"][number]
): RecipeActionInput => {
  const [baseType, isArray] = findBaseInputType(input.type);

  let staticValue:
    | string
    | string[]
    | RecipeActionInput[]
    | RecipeActionInput[][] = "";

  if (isArray) {
    if (baseType === "tuple") {
      staticValue = [
        (input.components ?? []).map((component) => {
          return getRecipeFunctionInput(component);
        }),
      ];
    } else {
      staticValue = [""];
    }
  } else {
    if (baseType === "tuple") {
      staticValue = (input.components ?? []).map((component) => {
        return getRecipeFunctionInput(component);
      });
    } else {
      staticValue = "";
    }
  }

  return {
    name: input.name,
    baseType,
    type: input.type,
    internalType: input.internalType,
    valueType: RecipeActionValueType.STATIC,
    staticValue,
    dynamicValue: -1,
    status: RecipeActionStatus.INVALID,
    isArray,
    isEmpty: false,
  };
};

export const ContractFunctionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    functionItem: RecipeFunction;
  }
>(({ className, functionItem, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  const functionSignature = toFunctionSignature({
    ...functionItem,
    type: "function",
  });
  const hexSignature = toFunctionSelector(functionSignature);

  const [isAdded, setIsAdded] = useState(false);

  const addAction = () => {
    let defaultCallType: RecipeActionCallType = RecipeActionCallType.CALL;

    if (functionItem.stateMutability === "view") {
      defaultCallType = RecipeActionCallType.STATICCALL;
    }

    const newActions = [
      ...recipeActions,
      {
        ...functionItem,
        id: uuidv4(),
        chainId: functionItem.chainId,
        address: functionItem.address.toLowerCase(),
        callType: defaultCallType,
        callValue: "",
        inputs: functionItem.inputs.map((input) =>
          getRecipeFunctionInput(input)
        ),
      },
    ];

    setRecipeActions(newActions);

    setIsAdded(true);
  };

  useEffect(() => {
    if (isAdded) {
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
    }
  }, [isAdded]);

  return (
    <div
      onClick={addAction}
      ref={ref}
      {...props}
      key={functionItem.id}
      className="flex cursor-pointer flex-row items-center justify-between gap-3 px-2 py-2 hover:bg-focus"
    >
      <div className="flex flex-col">
        <div className="break-all font-normal text-_primary_">
          {functionSignature}
        </div>
        <div className="mt-[0.1rem] flex flex-row flex-wrap items-center gap-1 text-_secondary_">
          <div className="font-normal">{functionItem.stateMutability}</div>
          <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />
          <div className="italic">{hexSignature}</div>
          <CopyButton
            onClick={(e) => {
              navigator.clipboard.writeText(hexSignature);
              e.preventDefault();
              e.stopPropagation();
            }}
            className="-ml-1 -mr-1"
            variant="ghost"
            size="xs"
            content={hexSignature}
          />

          <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />
          <div>{shortAddress(functionItem.address)}</div>

          <CopyButton
            onClick={(e) => {
              navigator.clipboard.writeText(functionItem.address);
              e.preventDefault();
              e.stopPropagation();
            }}
            className="-ml-1 -mr-1"
            variant="ghost"
            size="xs"
            content={functionItem.address}
          />
        </div>
      </div>

      <div className="shrink-0 pr-2">
        {isAdded ? (
          <CheckCheckIcon strokeWidth={1.5} className="h-5 w-5 text-success" />
        ) : (
          <ListPlusIcon strokeWidth={1.5} className="h-5 w-5 text-_tertiary_" />
        )}
      </div>
    </div>
  );
});

export const FunctionSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isFetchingAbi, setIsFetchingAbi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const [chainId, setChainId] = useAtom(recipeChainIdAtom);

  // Filter functions based on search query
  const filteredFunctions = useMemo(() => {
    if (!searchQuery.trim()) {
      return contractFunctions;
    }

    const query = searchQuery.toLowerCase();
    return contractFunctions.filter((functionItem) => {
      const functionSignature = toFunctionSignature({
        ...functionItem,
        type: "function" as const,
        stateMutability: functionItem.stateMutability as
          | "pure"
          | "view"
          | "nonpayable"
          | "payable",
      });

      return (
        functionItem.name.toLowerCase().includes(query) ||
        functionSignature.toLowerCase().includes(query) ||
        functionItem.stateMutability.toLowerCase().includes(query) ||
        functionItem.inputs.some(
          (input) =>
            input.name.toLowerCase().includes(query) ||
            input.type.toLowerCase().includes(query)
        ) ||
        functionItem.outputs.some(
          (output) =>
            output.name.toLowerCase().includes(query) ||
            output.type.toLowerCase().includes(query)
        )
      );
    });
  }, [contractFunctions, searchQuery]);

  const fetchAndUpdateAbi = async () => {
    setContractAbi("");

    if (!isAddress(contractAddress)) {
      return;
    }

    try {
      setIsFetchingAbi(true);

      const fetchedAbi = await api
        .contractControllerGetContract(chainId, contractAddress)
        .then((res) => res.data);

      if (!fetchedAbi.abi) {
        throw new Error("ABI not found");
      }

      if (fetchedAbi.implementation) {
        const combinedAbi = [
          ...fetchedAbi.implementation.abi,
          ...fetchedAbi.abi,
        ];
        setContractAbi(JSON.stringify(combinedAbi, null, 2));
      } else {
        setContractAbi(JSON.stringify(fetchedAbi.abi, null, 2));
      }
    } catch (error) {
      toast.error(
        "ABI not found inside our database. Please enter a valid ABI manually."
      );
    } finally {
      setIsFetchingAbi(false);
    }
  };

  useEffect(() => {
    // fetchAndUpdateAbi();
  }, [contractAddress]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex grow flex-col gap-1 bg-_surface_tertiary p-2 text-xs",
        className
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Select
          value={chainId.toString()}
          onValueChange={(value) => {
            setChainId(Number(value));
            setContractAddress("");
            setContractAbi("");
          }}
        >
          <SelectTrigger className="flex h-8 flex-row items-center gap-1 rounded-none border border-_divider_ bg-white px-3">
            <SelectValue className="text-xs" placeholder="Select a chain" />
          </SelectTrigger>
          <SelectContent className="gap-0 rounded-none border border-_divider_ bg-white p-0">
            {RecipeChains.map((chain, chainIndex) => (
              <SelectItem
                key={`recipe::chainId:${chain.id}:${chainIndex}`}
                value={chain.id.toString()}
                className="flex flex-row items-center gap-1 rounded-none text-xs hover:bg-focus"
              >
                <div className="flex flex-row items-center gap-2">
                  <img
                    className="h-4 w-4 rounded-full"
                    src={chain?.image}
                    alt={chain?.symbol}
                  />

                  <div className="">{chain.name}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <div className="flex h-[20vh] flex-col overflow-y-scroll">
        {isFetchingAbi ? (
          <div className="flex flex-1 flex-col items-center gap-2 border border-_divider_ bg-white p-5 text-center">
            <LoadingCircle size={16} />
          </div>
        ) : (
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
        )}

        <div
          className={cn(
            "w-full shrink-0 border border-t-0 border-_divider_ px-2 text-xs font-normal text-white",
            contractAbiStatus.status === "valid" && "bg-_brand_bronze_",
            contractAbiStatus.status === "invalid" && "bg-error",
            contractAbiStatus.status === "empty" && "bg-_tertiary_"
          )}
        >
          {isFetchingAbi ? "Trying to fetch ABI..." : contractAbiStatus.message}
        </div>
      </div>

      <div className="flex h-[40vh] w-full flex-col overflow-y-scroll border border-_divider_ bg-_surface_ text-xs">
        <div className="flex flex-row items-center gap-2 border-b border-_divider_ px-3 py-1">
          <SearchIcon strokeWidth={1.5} className="h-3 w-3 text-_tertiary_" />
          <Input
            placeholder="Search..."
            containerClassName="flex-1 bg-transparent border-none text-xs h-5 px-0 py-0 "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <XIcon strokeWidth={1.5} className="h-3 w-3 text-_tertiary_" />
            </Button>
          )}
        </div>
        <ScrollArea className="px-2">
          {isFetchingAbi ? (
            <div className="flex flex-col items-center gap-2 p-5 text-center">
              <LoadingCircle size={16} />
            </div>
          ) : filteredFunctions.length > 0 ? (
            <div className="flex flex-col divide-y divide-_divider_">
              {filteredFunctions.map((functionItem) => {
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

              {contractAddressStatus.status === "empty" ? (
                <div className="text-_secondary_">Missing contract address</div>
              ) : contractAbiStatus.status === "empty" ? (
                <div className="text-_secondary_">
                  Enter a verified contract address / valid ABI to see functions
                </div>
              ) : searchQuery ? (
                <div className="text-_secondary_">
                  No functions match "{searchQuery}"
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
          filteredFunctions.length === 0 && "bg-_tertiary_",
          filteredFunctions.length > 0 && "bg-_brand_bronze_"
        )}
      >
        {searchQuery
          ? `${filteredFunctions.length} of ${contractFunctions.length} Functions`
          : `${contractFunctions.length} Functions`}
      </div>
    </div>
  );
});

FunctionSelector.displayName = "FunctionSelector";
