"use client";

import { z } from "zod";
import {
  Abi as ZodAbi,
  Address as ZodAddress,
  AbiFunction as ZodAbiFunction,
  SolidityAddress as ZodSolidityAddress,
} from "abitype/zod";

import { isAbiValid, isSolidityAddressValid } from "royco/utils";

export const FunctionFormSchema = z.object({
  chain_id: z.number(),
  contract_address: z.string().refine(
    (value) => {
      return isSolidityAddressValid("address", value);
    },
    {
      message: "Invalid address",
    }
  ),
  placeholder_contract_address: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined) return true;
        return isSolidityAddressValid("address", value);
      },
      {
        message: "Invalid address",
      }
    ),
  contract_abi: z.string().refine(
    (value) => {
      return isAbiValid(value);
    },
    {
      message: "Invalid ABI format",
    }
  ),
  contract_function: ZodAbiFunction,
  contract_name: z.string().optional(),
  contract_image: z.string().optional(),

  // contract_function: ZodAbiFunction,
  // proxy_type: z.string().optional(),
  // proxy_address: ZodSolidityAddress.optional(),
  // proxy_abi: ZodAbi.optional(),
});
