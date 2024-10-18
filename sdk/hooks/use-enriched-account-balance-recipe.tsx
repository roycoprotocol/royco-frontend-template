import { useQuery } from "@tanstack/react-query";
import { getEnrichedAccountBalanceRecipeQueryOptions } from "../queries";
import { RoycoClient, useRoycoClient } from "../client";

export const useEnrichedAccountBalanceRecipe = ({
  chain_id,
  market_id,
  account_address,
  enabled = true,
}: {
  chain_id: number;
  market_id: string;
  account_address: string;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedAccountBalanceRecipeQueryOptions(
      client,
      chain_id,
      market_id,
      account_address
    ),
    enabled,
  });
};
