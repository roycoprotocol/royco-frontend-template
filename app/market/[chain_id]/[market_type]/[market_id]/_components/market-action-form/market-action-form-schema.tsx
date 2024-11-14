import { z } from "zod";

export const MarketActionFormSchema = z.object({
  funding_vault: z.string().optional(),

  quantity: z
    .object({
      amount: z.string().optional(),
      raw_amount: z.string().optional(),
    })
    .optional(),

  incentive_tokens: z.array(
    z.object({
      id: z.string(),
      chain_id: z.number(),
      contract_address: z.string(),
      name: z.string(),
      symbol: z.string(),
      image: z.string(),
      decimals: z.number(),
      amount: z.string().optional(),
      raw_amount: z.string().optional(),
      price: z.number().optional(),

      start_timestamp: z.date().optional(),
      end_timestamp: z.date().optional(),

      fdv: z.string().optional(), // refers to market cap of token
      total_supply: z.string().optional(), // refers to total supply of token
      aip: z.string().optional(), // refers to yield of token
      distribution: z.string().optional(), // refers to distribution of token

      annual_incentive_rate: z.string().optional(),
    })
  ),

  incentive_assets: z
    .array(
      z.object({
        id: z.string(),
        chain_id: z.number(),
        contract_address: z.string(),
        name: z.string(),
        symbol: z.string(),
        image: z.string(),
        decimals: z.number(),
      })
    )
    .optional(),

  expiry: z.date().optional(),
  no_expiry: z.boolean().default(false),
});
