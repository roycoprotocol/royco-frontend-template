import { atom } from "jotai";
import { isAddress, toFunctionSignature } from "viem";
import { Abi } from "abitype/zod";

export const recipeContractAddressAtom = atom<string>("");
export const recipeContractAddressStatusAtom = atom<{
  status: "empty" | "valid" | "invalid";
  message: string;
}>((get) => {
  const contractAddress = get(recipeContractAddressAtom);
  if (contractAddress.length < 42)
    return {
      status: "empty",
      message: "Contract address is empty",
    };
  if (contractAddress.length === 42 && isAddress(contractAddress))
    return {
      status: "valid",
      message: "Contract address is valid",
    };

  return {
    status: "invalid",
    message: "Contract address is invalid",
  };
});

export const recipeContractAbiAtom = atom<string>("");
export const recipeContractAbiStatusAtom = atom<{
  status: "empty" | "valid" | "invalid";
  message: string;
}>((get) => {
  const contractAbi = get(recipeContractAbiAtom);

  if (contractAbi.length === 0)
    return {
      status: "empty",
      message: "Contract ABI will be auto-fetched for verified contract",
    };

  try {
    const parsedAbi = JSON.parse(contractAbi);
    Abi.parse(parsedAbi);
    return {
      status: "valid",
      message: "Contract ABI is valid",
    };
  } catch (error) {
    return {
      status: "invalid",
      message: "Contract ABI is invalid",
    };
  }
});

export const recipeContractFunctionsAtom = atom<
  {
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
  }[]
>((get) => {
  const contractAddressStatus = get(recipeContractAddressStatusAtom);
  if (contractAddressStatus.status !== "valid") return [];

  const contractAbiStatus = get(recipeContractAbiStatusAtom);
  if (contractAbiStatus.status !== "valid") return [];

  const contractAddress = get(recipeContractAddressAtom);
  const contractAbi = get(recipeContractAbiAtom);
  const parsedAbi = JSON.parse(contractAbi);
  const zodAbi = Abi.parse(parsedAbi);
  const functions = zodAbi
    .filter((item) => item.type === "function")
    .map((item, itemIndex) => {
      const functionSignature = toFunctionSignature(item);

      const id = `${functionSignature}_${itemIndex}`;

      return {
        id,
        address: contractAddress,
        name: item.name,
        inputs: item.inputs.map((input) => ({
          name: input.name || "",
          type: input.type,
        })),
        outputs:
          item.outputs?.map((output) => ({
            name: output.name || "",
            type: output.type,
          })) || [],
        stateMutability: item.stateMutability,
        type: item.type,
      };
    });

  return functions;
});

export const recipeActionsAtom = atom<
  {
    id: string;
    callType: 0 | 1 | 2; // 0: delegatecall, 1: call, 2: staticcall/callwithvalue
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
  }[]
>([]);
