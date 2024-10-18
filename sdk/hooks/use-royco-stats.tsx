import { useRoycoClient, type RoycoClient } from "@/sdk/client";
import { getRoycoStatsQueryOptions } from "@/sdk/queries";
import { useQuery } from "@tanstack/react-query";

export const useRoycoStats = () => {
  const client: RoycoClient = useRoycoClient();

  return useQuery(getRoycoStatsQueryOptions(client));
};
