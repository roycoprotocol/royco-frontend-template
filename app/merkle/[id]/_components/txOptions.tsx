import { EnrichedTxOption } from "royco/transaction";
import { UniversalRewardsDistributorAbi } from "./abi";
import { Address } from "abitype";

export const getMerkleClaimTxOptions = ({
  chainId,
  contractAddress,
  accountAddress,
  tokenAddress,
  tokenAmount,
  merkleProof,
}: {
  chainId: number;
  contractAddress: string;
  accountAddress: string;
  tokenAddress: string;
  tokenAmount: string;
  merkleProof: string[];
}): EnrichedTxOption => {
  return {
    id: `merkle-claim:${chainId}_${contractAddress}_${accountAddress}`,
    chainId,
    contractId: "UniversalRewardsDistributor",
    category: "claim",
    abi: UniversalRewardsDistributorAbi,
    label: "Claim Airdrop",
    address: contractAddress as Address,
    functionName: "claim",
    args: [
      accountAddress as Address,
      tokenAddress as Address,
      tokenAmount,
      merkleProof,
    ],
    txStatus: "pending",
  };
};
