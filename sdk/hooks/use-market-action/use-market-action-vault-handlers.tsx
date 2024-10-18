import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketRewardStyle,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoTransactionType,
  RoycoTransactionType,
  TypedRoycoMarketType,
} from "../../market";
import {
  getSupportedToken,
  NULL_ADDRESS,
  SupportedToken,
} from "../../constants";
import { ContractMap, MulticallAbi } from "../../contracts";
import {
  getSupportedChain,
  isSolidityAddressArrayValid,
  isSolidityAddressValid,
  isSolidityIntArrayValid,
  isSolidityIntValid,
  shortAddress,
} from "../../utils";
import { Address } from "abitype";
import { useTokenAllowance } from ".././use-token-allowance";
import { BigNumber, ethers } from "ethers";
import { erc20Abi, multicall3Abi } from "viem";
import { useTokenQuotes } from ".././use-token-quotes";
import { useEnrichedMarket } from ".././use-enriched-market";
import { useMarketOffersRecipe } from ".././use-market-offers-recipe";
import { useReadRecipeMarket } from ".././use-read-recipe-market";
import { useReadProtocolFeeRecipe } from ".././use-read-protocol-fee-recipe";
import { TransactionOptionsType } from "../../types";
import { MarketTransactionType } from "@/store";
import { isMarketActionValid } from "./use-market-action-validator";
import { useEnrichedMarkets } from ".././use-enriched-markets";

const erc20Interface = new ethers.utils.Interface(erc20Abi);

export const getAPMarketOfferVaultTransactionOptions = ({
  chainId,
  address,
  quantity,
  account,
}: {
  chainId: number;
  address: string;
  account: string;
  quantity: string;
}): TransactionOptionsType => {
  const abi = ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

  const txOptions: TransactionOptionsType = {
    contractId: "WrappedVault",
    chainId,
    id: "deposit",
    label: "Deposit into Vault",
    address,
    abi,
    functionName: "deposit",
    marketType: RoycoMarketType.vault.id,
    args: [quantity, account],
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};

export const getAPLimitOfferVaultTransactionOptions = ({
  chainId,
  address,
  targetMarketId,
  fundingVault,
  quantity,
  expiry,
  tokenAddresses,
  tokenRates,
}: {
  chainId: number;
  address: string;
  targetMarketId: string;
  fundingVault: string;
  quantity: string;
  expiry: string;
  tokenAddresses: string[];
  tokenRates: string[];
}) => {
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["VaultMarketHub"].abi;

  const txOptions: TransactionOptionsType = {
    contractId: "VaultMarketHub",
    chainId,
    id: "create_ap_offer",
    label: "Create AP Offer",
    address,
    abi,
    functionName: "createAPOffer",
    marketType: RoycoMarketType.vault.id,
    args: [
      targetMarketId,
      fundingVault,
      quantity,
      expiry,
      tokenAddresses,
      tokenRates,
    ],
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};

export const getIPLimitOfferVaultAddRewardTransactionOptions = ({
  chainId,
  address,
  tokenIds,
  existingTokenIds,
}: {
  chainId: number;
  address: string;
  tokenIds: string[];
  existingTokenIds: string[];
}) => {
  const abi = ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

  let txOptions: TransactionOptionsType[] = [];

  const tokenAddresses = (tokenIds || []).map((id) => {
    return id.split("-")[1];
  });

  for (let i = 0; i < tokenAddresses.length; i++) {
    if (existingTokenIds.includes(tokenIds[i])) {
      continue;
    }

    let newTxOptions: TransactionOptionsType = {
      contractId: "WrappedVault",
      chainId,
      id: `add_reward_${tokenAddresses[i]}`,
      label: `Add Reward (${shortAddress(tokenAddresses[i])})`,
      address,
      abi,
      functionName: "addRewardsToken",
      marketType: RoycoMarketType.vault.id,
      args: [tokenAddresses[i]],
      txStatus: "idle",
      txHash: null,
    };

    txOptions.push(newTxOptions);
  }

  return txOptions;
};

export const getIPLimitOfferVaultSetRewardTransactionOptions = ({
  chainId,
  address,
  tokenIds,
  tokenAmounts,
  startTimestamps,
  endTimestamps,
  existingTokenIds,
  frontendFeeRecipient,
}: {
  chainId: number;
  address: string;
  tokenIds: string[];
  tokenAmounts: string[];
  startTimestamps: string[];
  endTimestamps: string[];
  existingTokenIds: string[];
  frontendFeeRecipient: string;
}) => {
  const abi = ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

  let txOptions: TransactionOptionsType[] = [];

  const tokenAddresses = (tokenIds || []).map((id) => {
    return id.split("-")[1];
  });

  for (let i = 0; i < tokenAddresses.length; i++) {
    if (existingTokenIds.includes(tokenIds[i])) {
      // update reward
      let newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId,
        id: `update_reward_${tokenAddresses[i]}`,
        label: `Update Reward (${shortAddress(tokenAddresses[i])})`,
        address,
        abi,
        functionName: "extendRewardsInterval",
        marketType: RoycoMarketType.vault.id,
        args: [
          tokenAddresses[i],
          tokenAmounts[i],
          endTimestamps[i],
          frontendFeeRecipient,
        ],
        txStatus: "idle",
        txHash: null,
      };

      txOptions.push(newTxOptions);
    } else {
      // set new reward
      let newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId,
        id: `set_reward_${tokenAddresses[i]}`,
        label: `Set Reward (${shortAddress(tokenAddresses[i])})`,
        address,
        abi,
        functionName: "setRewardsInterval",
        marketType: RoycoMarketType.vault.id,
        args: [
          tokenAddresses[i],
          startTimestamps[i],
          endTimestamps[i],
          tokenAmounts[i],
          frontendFeeRecipient,
        ],
        txStatus: "idle",
        txHash: null,
      };

      txOptions.push(newTxOptions);
    }
  }

  return txOptions;
};
