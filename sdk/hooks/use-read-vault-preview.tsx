/**
 * @TODO Fix it
 */

import { useReadContract, useReadContracts } from "wagmi";
import { ContractMap } from "../contracts";
import { BigNumber, ethers } from "ethers";
import { NULL_ADDRESS } from "../constants";
import {
  RoycoMarketRewardStyle,
  RoycoMarketType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoMarketType,
} from "../market";
import { Abi, Address } from "abitype";
import { EnrichedMarketDataType } from "../queries";

export const useReadVaultPreview = ({
  market,
  quantity,
  enabled,
}: {
  market: EnrichedMarketDataType;
  quantity: string;
  enabled: boolean;
}) => {
  let incentive_token_ids: string[] = [];
  let incentive_token_amounts: string[] = [];

  const vaultContracts = market.incentive_tokens_data.map((incentive) => {
    return {
      chainId: market.chain_id,
      address: market.market_id as Address,
      abi: ContractMap[market.chain_id as keyof typeof ContractMap][
        "WrappedVault"
      ].abi as Abi,
      functionName: "previewRateAfterDeposit",
      args: [incentive.contract_address, quantity],
    };
  });

  const contractsToRead = vaultContracts;

  const propsReadContracts = useReadContracts({
    // @ts-ignore
    contracts: contractsToRead,
    enabled,
  });

  if (!propsReadContracts.isLoading && propsReadContracts.data) {
    try {
      for (let i = 0; i < propsReadContracts.data.length; i++) {
        const result = propsReadContracts.data[i].result as BigNumber;

        const incentive_token_id = market.incentive_tokens_data[i].id;
        const incentive_token_amount = result.toString();

        incentive_token_ids.push(incentive_token_id);
        incentive_token_amounts.push(incentive_token_amount);
      }
    } catch (error) {
      // console.log("useReadVaultPreview error", error);
    }
  }

  // console.log("incentive_token_ids", incentive_token_ids);
  // console.log("incentive_token_amounts", incentive_token_amounts);

  return {
    ...propsReadContracts,
    incentive_token_ids,
    incentive_token_amounts,
  };
};
