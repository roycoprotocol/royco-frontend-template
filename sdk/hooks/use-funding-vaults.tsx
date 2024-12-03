import { useQuery } from "@tanstack/react-query";
import { type RoycoClient, useRoycoClient } from "royco/client";
import { getContractsQueryOptions } from "royco/queries";

export const BaseFundingVault = {
  address: "0x0000000000000000000000000000000000000000",
  label: "Wallet",
};

export const useFundingVaults = () => {
  const client: RoycoClient = useRoycoClient();

  const isLoading = false;

  const data = [BaseFundingVault];

  return {
    isLoading,
    data,
  };
};
