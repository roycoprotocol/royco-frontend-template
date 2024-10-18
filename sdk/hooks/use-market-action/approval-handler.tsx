import { TypedRoycoMarketType } from "../../market";
import { getSupportedToken } from "../../constants";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { TransactionOptionsType } from "../../types";

export const getTokenApprovalContractOptions = ({
  marketType,
  tokenIds,
  requiredApprovalAmounts,
  spender,
}: {
  marketType: TypedRoycoMarketType;
  tokenIds: string[];
  requiredApprovalAmounts: string[];
  spender: string;
}) => {
  const txOptions: TransactionOptionsType[] = [];

  tokenIds.forEach((tokenId, tokenIndex) => {
    const token = getSupportedToken(tokenId);

    if (token) {
      const newTxOptions: TransactionOptionsType = {
        contractId: "Erc20",
        chainId: token.chain_id,
        id: `approve_token_${token.id}`,
        label: `Approve ${token.symbol.toUpperCase()}`,
        address: token.contract_address,
        abi: erc20Abi,
        functionName: "approve",
        marketType,
        args: [spender, ethers.constants.MaxUint256.toString()],
        txStatus: "idle",
        txHash: null,
        requiredApprovalAmount: requiredApprovalAmounts[tokenIndex],
      };

      txOptions.push(newTxOptions);
    }
  });

  return txOptions;
};
