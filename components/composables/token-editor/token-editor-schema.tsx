import { z } from "zod";

import { SupportedToken } from "@/sdk/constants";

export const TokenEditorSchema = z.object({
  id: z.string(),
  token_id: z.string(),
  chain_id: z.number(),
  contract_address: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
  decimals: z.number(),
  type: z.string().optional(),
  price: z.string().optional(),
  fdv: z.string().optional(),
  total_supply: z.string().optional(),
});
