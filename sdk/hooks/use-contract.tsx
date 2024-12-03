import { useQuery } from "@tanstack/react-query";
import { type RoycoClient, useRoycoClient } from "royco/client";
import { getContractsQueryOptions } from "royco/queries";

export const useContract = ({
  chain_id,
  contract_address,
}: {
  chain_id: number;
  contract_address: string;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery(
    getContractsQueryOptions(client, [{ chain_id, contract_address }])
  );
};
