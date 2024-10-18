/**
 * @notice will be updated
 */

import { useRoycoClient, type RoycoClient } from "@/sdk/client";
import { getEnrichedRoycoStatsQueryOptions } from "@/sdk/queries";
import { useQuery } from "@tanstack/react-query";

export const useEnrichedRoycoStats = ({
  testnet = false,
}: {
  testnet?: boolean;
} = {}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedRoycoStatsQueryOptions(client, testnet),
  });
};
