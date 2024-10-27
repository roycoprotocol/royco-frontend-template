import { useRoycoClient, type RoycoClient } from "@/sdk/client";
import { getEnrichedRoycoStatsQueryOptions } from "@/sdk/queries";
import { useQuery } from "@tanstack/react-query";
import { CustomTokenData } from "../types";

export const useEnrichedRoycoStats = ({
  testnet = false,
  custom_token_data,
}: {
  testnet?: boolean;
  custom_token_data?: CustomTokenData;
} = {}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedRoycoStatsQueryOptions(client, custom_token_data, testnet),
  });
};
