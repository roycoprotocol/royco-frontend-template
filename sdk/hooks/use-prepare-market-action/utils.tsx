import { TypedRoycoMarketType } from "../../market";
import { getSupportedToken } from "../../constants";
import { BigNumber, ethers } from "ethers";
import { erc20Abi } from "viem";
import { TransactionOptionsType } from "../../types";
import { useTokenAllowance } from "../use-token-allowance";

export const getApprovalContractOptions = ({
  market_type,
  token_ids,
  required_approval_amounts,
  spender,
}: {
  market_type: TypedRoycoMarketType;
  token_ids: string[];
  required_approval_amounts: string[];
  spender: string;
}) => {
  const txOptions: TransactionOptionsType[] = [];

  token_ids.forEach((token_id, token_index) => {
    const token = getSupportedToken(token_id);

    if (token && token.type !== "point") {
      const newTxOptions: TransactionOptionsType = {
        contractId: "Erc20",
        chainId: token.chain_id,
        id: `approve_token_${token.id}`,
        label: `Approve ${token.symbol.toUpperCase()}`,
        address: token.contract_address,
        abi: erc20Abi,
        functionName: "approve",
        marketType: market_type,
        args: [spender, ethers.constants.MaxUint256.toString()],
        txStatus: "idle",
        txHash: null,
        requiredApprovalAmount: required_approval_amounts[token_index],
      };

      txOptions.push(newTxOptions);
    }
  });

  return txOptions;
};

export const refineTransactionOptions = ({
  propsTokenAllowance,
  preContractOptions,
  postContractOptions,
}: {
  propsTokenAllowance: ReturnType<typeof useTokenAllowance>;
  preContractOptions: TransactionOptionsType[];
  postContractOptions: TransactionOptionsType[];
}) => {
  let writeContractOptions: TransactionOptionsType[] = [];

  if (!propsTokenAllowance.isLoading && !!propsTokenAllowance.data) {
    const refinedPreContractOptions = preContractOptions.map(
      (option, optionIndex) => {
        const allowanceRequired: BigNumber = BigNumber.from(
          option.requiredApprovalAmount ?? "0"
        );
        const allowanceGiven: BigNumber = BigNumber.from(
          propsTokenAllowance.data[optionIndex]?.result ?? "0"
        );

        if (allowanceGiven.gte(allowanceRequired)) {
          return {
            ...option,
            txStatus: "success",
          };
        } else {
          return option;
        }
      }
    );

    // Set write contract options
    writeContractOptions = [
      ...refinedPreContractOptions,
      ...postContractOptions,
    ];
  }

  return writeContractOptions;
};
