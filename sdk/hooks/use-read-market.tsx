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

export const useReadMarket = ({
  chain_id,
  market_type,
  market_id,
}: {
  chain_id: number;
  market_type: TypedRoycoMarketType;
  market_id: string;
}) => {
  const recipeContracts = [
    {
      chainId: chain_id,
      address: ContractMap[chain_id as keyof typeof ContractMap][
        "RecipeMarketHub"
      ].address as Address,
      abi: ContractMap[chain_id as keyof typeof ContractMap]["RecipeMarketHub"]
        .abi as Abi,
      functionName: "marketHashToWeirollMarket",
      args: [market_id],
    },
    {
      chainId: chain_id,
      address: ContractMap[chain_id as keyof typeof ContractMap][
        "RecipeMarketHub"
      ].address as Address,
      abi: ContractMap[chain_id as keyof typeof ContractMap]["RecipeMarketHub"]
        .abi as Abi,
      functionName: "protocolFee",
    },
  ];

  const vaultContracts = [
    {
      chainId: chain_id,
      address: market_id as Address,
      abi: ContractMap[chain_id as keyof typeof ContractMap]["WrappedVault"]
        .abi as Abi,
      functionName: "frontendFee",
    },
    {
      chainId: chain_id,
      address:
        ContractMap[chain_id as keyof typeof ContractMap]["WrappedVaultFactory"]
          .address,
      abi: ContractMap[chain_id as keyof typeof ContractMap]["WrappedVaultFactory"]
        .abi,
      functionName: "protocolFee",
    },
  ];

  const contractsToRead =
    market_type === RoycoMarketType.recipe.id
      ? recipeContracts
      : market_type === RoycoMarketType.vault.id
        ? vaultContracts
        : [];

  let data = null;

  const propsReadContracts = useReadContracts({
    // @ts-ignore
    contracts: contractsToRead,
  });

  if (!propsReadContracts.isLoading) {
    try {
      if (market_type === RoycoMarketType.recipe.id) {
        // Read Recipe Market

        const [
          marketID,
          inputToken,
          lockupTime,
          frontendFee,
          enterMarket,
          exitMarket,
          rewardStyle,
        ] =
          // @ts-ignore
          propsReadContracts.data[0].result as [
            BigNumber,
            string,
            BigNumber,
            BigNumber,
            object,
            object,
            number,
          ];

        // @ts-ignore
        const protocolFee = propsReadContracts.data[1].result as BigNumber;

        data = {
          input_token_id: `${chain_id}-${inputToken.toLowerCase()}`,
          protocol_fee: BigNumber.from(protocolFee).toString(),
          frontend_fee: BigNumber.from(frontendFee).toString(),
          enter_market_script:
            enterMarket !== null
              ? {
                  // @ts-ignore
                  commands: enterMarket.weirollCommands as string[],
                  // @ts-ignore
                  state: enterMarket.weirollState as string[],
                }
              : {
                  commands: [],
                  state: [],
                },
          exit_market_script:
            exitMarket !== null
              ? {
                  // @ts-ignore
                  commands: exitMarket.weirollCommands as string[],
                  // @ts-ignore
                  state: exitMarket.weirollState as string[],
                }
              : {
                  commands: [],
                  state: [],
                },
          reward_style:
            rewardStyle === 0
              ? RoycoMarketRewardStyle.upfront.id
              : rewardStyle === 1
                ? RoycoMarketRewardStyle.arrear.id
                : RoycoMarketRewardStyle.forfeitable.id,
          lockup_time: BigNumber.from(lockupTime).toString(),
        };
      } else {
        // Read Vault Market

        // @ts-ignore
        const frontendFee = propsReadContracts.data[0].result as BigNumber;
        // @ts-ignore
        const protocolFee = propsReadContracts.data[1].result as BigNumber;

        data = {
          protocol_fee: BigNumber.from(protocolFee).toString(),
          frontend_fee: BigNumber.from(frontendFee).toString(),
        };
      }
    } catch (error) {
      console.log("useReadMarket error", error);
    }
  }

  return {
    ...propsReadContracts,
    data,
  };
};
