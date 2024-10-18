import { ContractMap } from "@/sdk/contracts";
import { TypedRoycoMarketType } from "@/sdk/market";
import { Abi, Address } from "abitype";

export const useVaultActionDetails = ({
  chain_id,
  market_type,
  market_id,
}: {
  chain_id: number;
  market_type: TypedRoycoMarketType;
  market_id: string;
}) => {
  const contractCalls = [
    {
      chainId: chain_id,
      address: market_id as Address,
      abi: ContractMap[chain_id as keyof typeof ContractMap]["WrappedVault"]
        .abi as Abi,
      functionName: "frontendFee",
    },
  ];
};
