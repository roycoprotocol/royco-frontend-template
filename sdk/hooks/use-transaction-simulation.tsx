import { getTransactionSimulationQueryOptions } from "royco/queries";
import { useQuery } from "@tanstack/react-query";
import { TransactionOptionsType } from "../types";

export const useTransactionSimulation = ({
  chainId,
  writeContractOptions,
  simulationUrl,
  account,
  enabled = true,
}: {
  chainId: number;
  writeContractOptions: TransactionOptionsType[];
  simulationUrl: string;
  account: string;
  enabled?: boolean;
}) => {
  return useQuery({
    ...getTransactionSimulationQueryOptions({
      chainId,
      enabled,
      writeContractOptions: writeContractOptions.map((option) => ({
        contractId: option.contractId,
        chainId: option.chainId,
        address: option.address,
        functionName: option.functionName,
        args: option.args,
      })),
      simulationUrl,
      account,
    }),
    enabled,
  });
};
