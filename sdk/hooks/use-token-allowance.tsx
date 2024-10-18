import { useQuery } from "@tanstack/react-query";
import { getAccountAllowanceQueryOptions } from "@/sdk/queries";
import { type Address } from "viem";

export const useTokenAllowance = ({
  chain_id,
  account,
  spender,
  tokens,
}: {
  chain_id: number;
  account: Address;
  spender: Address;
  tokens: Address[];
}) => {
  const props = useQuery(
    getAccountAllowanceQueryOptions(chain_id, account, spender, tokens)
  );

  return props;
};
