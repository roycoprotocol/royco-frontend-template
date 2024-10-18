import { useQuery } from "@tanstack/react-query";
import { getTokenQuotesQueryOptions } from "../queries";
import { RoycoClient, useRoycoClient } from "../client";
import { getSupportedToken, SupportedToken } from "../constants";

export const useTokenQuotes = ({ token_ids }: { token_ids: string[] }) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery(getTokenQuotesQueryOptions(client, token_ids));
};
