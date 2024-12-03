"use client";

import { z, ZodString } from "zod";
import {
  isAbiValid,
  // isSolidityAddressValid,
  isSolidityAddressValid,
  isERC4626VaultAddressValid,
} from "royco/utils";
import {
  AbiParameter as ZodAbiParameter,
  AbiFunction as ZodAbiFunction,
} from "abitype/zod";

import { AbiFunction, AbiParameter, SolidityAddress, IsAbi } from "abitype";
import { UseFormReturn } from "react-hook-form";
import {
  isFixedValueValid,
  isMarketActionScriptValid,
  isMarketActionValid,
} from "royco/market";
import { arbitrum, base, mainnet, sepolia } from "viem/chains";
import {
  SupportedChainMap,
  TokenMap1,
  TokenMap11155111,
  TokenMap42161,
  TokenMap8453,
} from "royco/constants";
import { isSolidityStringValid } from "royco/utils";

export const TypedZodAbiFunction = z.object({
  type: z.literal("function"),
  name: z.string().regex(/[a-zA-Z$_][a-zA-Z0-9$_]*/),
  inputs: z.array(ZodAbiParameter).readonly(),
  outputs: z.array(ZodAbiParameter).readonly(),
  constant: z.any().optional(),
});

export function secondsToDuration(seconds: any) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds %= 30 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

export const LockupTimeMap: Record<
  string,
  {
    offer: number;
    notation: string;
    label: string;
    multiplier: number;
  }
> = {
  minutes: {
    offer: 1,
    notation: "min",
    label: "Minutes",
    multiplier: 60,
  },
  hours: {
    offer: 2,
    notation: "hr",
    label: "Hours",
    multiplier: 3600,
  },
  days: {
    offer: 3,
    notation: "d",
    label: "Days",
    multiplier: 86400,
  },
  weeks: {
    offer: 4,
    notation: "wk",
    label: "Weeks",
    multiplier: 604800,
  },
  months: {
    offer: 5,
    notation: "mo",
    label: "Months",
    multiplier: 2592000,
  },
  years: {
    offer: 6,
    notation: "yr",
    label: "Years",
    multiplier: 31536000,
  },
};

const ZodChain = z.object({
  id: z.number(),
  name: z.string(),
  rpcUrls: z.object({
    default: z.object({
      http: z.array(z.string()),
    }),
  }),
  blockExplorers: z
    .object({
      default: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
    .optional(),
  testnet: z.boolean().optional(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  image: z.string(),
  symbol: z.string(),
});

export const ZodAction = z
  .object({
    id: z.string(),
    contract_address: z.string().refine(
      (value) => {
        return isSolidityAddressValid("address", value);
      },
      {
        message: "Invalid contract address",
      }
    ),
    contract_name: z.string().optional(),
    contract_image: z.string().optional(),
    contract_function: TypedZodAbiFunction,
    inputs: z.array(
      z.object({
        input_type: z.enum(["fixed", "dynamic"]),
        fixed_value: z.string().optional(),
        dynamic_value: z
          .object({
            action_id: z.string(),
            action_index: z.number(),
            output_index: z.number(),
          })
          .optional(),
      })
    ),
  })
  .refine(
    (schema) => {
      return schema.inputs.every((input, inputIndex) => {
        if (input.input_type === "fixed") {
          if (input.fixed_value === undefined) return false;

          const actual_input_type =
            schema.contract_function.inputs[inputIndex].type;

          const isValid = isFixedValueValid({
            type: actual_input_type,
            value: input.fixed_value,
          });

          return isValid.status;
        } else {
          return input.dynamic_value !== undefined;
        }
      });
    },
    {
      message: "Invalid input values",
      path: ["inputs"],
    }
  );

export const ZodActions = z.array(ZodAction).refine(
  (actions) => {
    const { status, message } = isMarketActionScriptValid({
      marketActions: actions,
    });

    return status;
  },
  {
    message: "Invalid Action",
  }
);

export const MarketBuilderFormSchema = z.object({
  chain: ZodChain,

  action_type: z.enum(["recipe", "vault"]),
  incentive_schedule: z.enum(["upfront", "arrear", "forfeitable", "streaming"]),

  vault_address: z
    .string()
    .optional()
    .refine(
      (value) => {
        return isSolidityAddressValid("address", value);
      },
      {
        message: "Invalid address value",
      }
    ),

  // @finalized
  market_name: z
    .string()
    .min(3, {
      message: "Market Name must be at least 3 characters long",
    })
    .max(100, {
      message: "Market Name must be at most 100 characters long",
    })
    .refine(
      (value) => {
        return isSolidityStringValid("string", value);
      },
      {
        message: "Market Name contains invalid characters",
      }
    ),

  // @finalized
  market_description: z
    .string()
    .min(10, {
      message: "Market Description must be at least 10 characters long",
    })
    .max(1000, {
      message: "Market Description must be at most 1000 characters long",
    }),

  asset: z.object(
    {
      id: z.string(),
      chain_id: z.number(),
      contract_address: z.string(),
      symbol: z.string(),
      image: z.string(),
      decimals: z.number(),
    },
    {
      message: "Asset must be selected",
    }
  ),

  enter_actions: ZodActions,
  exit_actions: ZodActions,

  expiry: z
    .date({
      message: "Expiration timestamp must be selected",
    })
    .refine(
      (value) => {
        return value > new Date();
      },
      {
        message: "Expiry must be a timestamp in the future",
      }
    ),

  no_expiry: z.boolean().default(false),

  lockup_time: z
    .object({
      duration: z.string().optional(),
      duration_type: z.enum(
        Object.keys(LockupTimeMap) as [keyof typeof LockupTimeMap]
      ),
    })
    .default({
      duration: "3",
      duration_type: "months",
    })
    .refine(
      (lockup_time) => {
        if (lockup_time.duration === undefined) {
          return false;
        } else {
          return true;
        }
      },
      {
        message: "Lockup time must be defined",
      }
    ),
});

export type PoolFormType = UseFormReturn<
  z.infer<typeof MarketBuilderFormSchema>
>;

export const PoolFormDefaults = {
  [sepolia.id]: {
    market_name: "",
    market_description: "",
    chain: SupportedChainMap[sepolia.id],
    asset:
      TokenMap11155111["11155111-0x3f85506f500cb02d141bafe467cc52ad5a9d7d5a"],
    enter_actions: [],
    exit_actions: [],
    action_type: "recipe",
    incentive_schedule: "upfront",
    lockup_time: {
      duration: "3",
      duration_type: "months",
    },
  },
  [mainnet.id]: {
    market_name: "",
    market_description: "",
    chain: SupportedChainMap[mainnet.id],
    asset: TokenMap1["1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
    enter_actions: [],
    exit_actions: [],
    action_type: "recipe",
    incentive_schedule: "upfront",
    lockup_time: {
      duration: "3",
      duration_type: "months",
    },
  },
  [arbitrum.id]: {
    market_name: "",
    market_description: "",
    chain: SupportedChainMap[arbitrum.id],
    asset: TokenMap42161["42161-0xa0b862f60edef4452f25b4160f177db44deb6cf1"],
    enter_actions: [],
    exit_actions: [],
    action_type: "recipe",
    incentive_schedule: "upfront",
    lockup_time: {
      duration: "3",
      duration_type: "months",
    },
  },
  [base.id]: {
    market_name: "",
    market_description: "",
    chain: SupportedChainMap[base.id],
    asset: TokenMap8453["8453-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"],
    enter_actions: [],
    exit_actions: [],
    action_type: "recipe",
    incentive_schedule: "upfront",
    lockup_time: {
      duration: "3",
      duration_type: "months",
    },
  },
};
