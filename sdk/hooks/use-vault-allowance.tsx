import { useQuery } from "@tanstack/react-query";
import { getVaultAllowanceQueryOptions } from "@/sdk/queries";

export const useVaultAllowance = ({
  chain_id,
  account,
  vault_address,
  spender,
}: {
  chain_id: number;
  account: string;
  vault_address: string;
  spender: string;
}) => {
  return useQuery(
    getVaultAllowanceQueryOptions(chain_id, account, vault_address, spender)
  );
};
