import { RoycoMarketType } from "../../market";
import { ContractMap } from "../../contracts";
import { shortAddress } from "../../utils";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { TransactionOptionsType } from "../../types";
import { getSupportedToken } from "@/sdk/constants";

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
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

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

export const getIPMarketOfferVaultTransactionOptions = ({
  chainId,
  offers,
  fillAmounts,
}: {
  chainId: number;
  offers: Array<{
    offerID: string;
    targetVault: string;
    ap: string;
    fundingVault: string;
    expiry: string;
    incentivesRequested: string[];
    incentivesRatesRequested: string[];
  }>;
  fillAmounts: string[];
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["VaultMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["VaultMarketHub"].abi;

  const txOptions: TransactionOptionsType = {
    contractId: "VaultMarketHub",
    chainId,
    id: "fill_ap_offers",
    label: "Fill AP Offers",
    address,
    abi,
    functionName: "allocateOffers",
    marketType: RoycoMarketType.vault.id,
    args: [offers, fillAmounts],
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};

export const getAPLimitOfferVaultTransactionOptions = ({
  chainId,
  targetMarketId,
  fundingVault,
  quantity,
  expiry,
  tokenAddresses,
  tokenRates,
}: {
  chainId: number;
  targetMarketId: string;
  fundingVault: string;
  quantity: string;
  expiry: string;
  tokenAddresses: string[];
  tokenRates: string[];
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["VaultMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["VaultMarketHub"].abi;

  // Sort the tokens based on the address in ascending order
  const sortedTokens = (tokenAddresses as string[]).map((id, index) => {
    const address = tokenAddresses[index];
    const amount = tokenRates[index];

    return {
      address,
      amount,
    };
  });

  // Sort the tokens based on the address in ascending order
  sortedTokens.sort((a, b) => (a.address > b.address ? 1 : -1));

  // Extract the sorted addresses and amounts
  const sortedTokenAddresses = sortedTokens.map((token) => token.address);
  const sortedTokenAmounts = sortedTokens.map((token) => token.amount);

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
      sortedTokenAddresses,
      sortedTokenAmounts,
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
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

  let txOptions: TransactionOptionsType[] = [];

  const tokenAddresses = (tokenIds || []).map((id) => {
    return id.split("-")[1];
  });

  for (let i = 0; i < tokenAddresses.length; i++) {
    if (existingTokenIds.includes(tokenIds[i])) {
      continue;
    }

    // get incentive token data
    let incentiveTokenData = getSupportedToken(
      `${chainId}-${tokenAddresses[i]}`
    );

    let newTxOptions: TransactionOptionsType = {
      contractId: "WrappedVault",
      chainId,
      id: `add_reward_${tokenAddresses[i]}`,
      label: `Add Reward ${incentiveTokenData?.symbol.toUpperCase()} ${incentiveTokenData?.symbol === "N/D" && `(${shortAddress(tokenAddresses[i])})`}`,
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
  existingTokenAmounts,
  frontendFeeRecipient,
}: {
  chainId: number;
  address: string;
  tokenIds: string[];
  tokenAmounts: string[];
  startTimestamps: string[];
  endTimestamps: string[];
  existingTokenIds: string[];
  existingTokenAmounts: string[];
  frontendFeeRecipient: string;
}) => {
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["WrappedVault"].abi;

  let txOptions: TransactionOptionsType[] = [];

  const tokenAddresses = (tokenIds || []).map((id) => {
    return id.split("-")[1];
  });

  for (let i = 0; i < tokenAddresses.length; i++) {
    let isExistingTokenIndex = existingTokenIds.indexOf(tokenIds[i]);
    let isExistingTokenAmount = "0";

    if (isExistingTokenIndex !== -1) {
      isExistingTokenAmount = existingTokenAmounts[isExistingTokenIndex];
    }

    if (isExistingTokenAmount !== "0") {
      // get incentive token data
      let incentiveTokenData = getSupportedToken(
        `${chainId}-${tokenAddresses[i]}`
      );

      // update reward
      let newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId,
        id: `update_reward_${tokenAddresses[i]}`,
        label: `Update Reward ${incentiveTokenData?.symbol.toUpperCase()} (${shortAddress(tokenAddresses[i])})`,
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
      // get incentive token data
      let incentiveTokenData = getSupportedToken(
        `${chainId}-${tokenAddresses[i]}`
      );

      // set new reward
      let newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId,
        id: `set_reward_${tokenAddresses[i]}`,
        label: `Set Reward ${incentiveTokenData?.symbol.toUpperCase()} (${shortAddress(tokenAddresses[i])})`,
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
