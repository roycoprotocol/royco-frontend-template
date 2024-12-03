import { useRoycoClient, type RoycoClient } from "royco/client";
import { getRoycoStatsQueryOptions } from "royco/queries";
import { useQuery } from "@tanstack/react-query";

export const useRoycoStats = () => {
  const client: RoycoClient = useRoycoClient();

  return useQuery(getRoycoStatsQueryOptions(client));
};
