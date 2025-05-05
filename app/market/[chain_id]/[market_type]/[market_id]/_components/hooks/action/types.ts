import type { SupportedToken } from "royco/constants";

export type TypedMarketActionInputTokenData = SupportedToken & {
  raw_amount: string;
  token_amount: number;
  token_amount_usd: number;
  price: number;
  fdv: number;
  total_supply: number;
};

export type TypedMarketActionIncentiveDataElement = SupportedToken & {
  raw_amount: string;
  token_amount: number;
  token_amount_usd: number;
  per_input_token: number;
  annual_change_ratio: number;
  token_rate?: number;
  price: number;
  fdv: number;
  total_supply: number;
};
