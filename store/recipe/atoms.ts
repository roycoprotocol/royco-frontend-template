import { atom } from "jotai";
import { isAddress, toFunctionSignature } from "viem";
import { Abi } from "abitype/zod";
import { RecipeAction, RecipeFunction } from "./types";
import { testAbi } from "@/weiroll/test-abi";

export const recipeChainIdAtom = atom<number>(1);

export const recipeContractAddressAtom = atom<string>(
  "0x136205a9148F40F7D7D78f59B35560421b41277e"
);
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

export const recipeContractAbiAtom = atom<string>(JSON.stringify(testAbi));
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

export const recipeContractFunctionsAtom = atom<RecipeFunction[]>((get) => {
  const chainId = get(recipeChainIdAtom);

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

      const id = `${itemIndex}_${functionSignature}`;

      return {
        id,
        chainId,
        address: contractAddress,
        name: item.name,
        inputs: item.inputs.map((input) => ({
          name: input.name || "",
          type: input.type,
          internalType: input.internalType || "",
          components: (input as any)?.components,
        })),
        outputs:
          item.outputs?.map((output) => ({
            name: output.name || "",
            type: output.type,
            internalType: output.internalType || "",
            components: (output as any)?.components,
          })) || [],
        stateMutability: item.stateMutability,
        type: item.type,
      };
    });

  return functions;
});

export const recipeActionsAtom = atom<RecipeAction[]>([]);
