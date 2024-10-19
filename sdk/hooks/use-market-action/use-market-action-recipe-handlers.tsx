import { RoycoMarketType } from "../../market";
import { ContractMap } from "../../contracts";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { TransactionOptionsType } from "../../types";

export const getAPMarketOfferRecipeTransactionOptions = ({
  chainId,
  offerIds,
  fillAmounts,
  fundingVault,
  frontendFeeRecipient,
}: {
  chainId: number;
  offerIds: string[];
  fillAmounts: string[];
  fundingVault: string;
  frontendFeeRecipient: string;
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].abi;

  const txOptions: TransactionOptionsType = {
    contractId: "RecipeMarketHub",
    chainId,
    id: "fill_ip_offers",
    label: "Fill IP Offers",
    address: address,
    abi: abi,
    functionName: "fillIPOffers",
    marketType: RoycoMarketType.recipe.id,
    args: [offerIds, fillAmounts, fundingVault, frontendFeeRecipient],
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};

export const getIPMarketOfferRecipeTransactionOptions = ({
  chainId,
  offers,
  fillAmounts,
  frontendFeeRecipient,
}: {
  chainId: number;
  offers: Array<{
    offerID: string;
    targetMarketHash: string;
    ap: string;
    fundingVault: string;
    quantity: string;
    expiry: string;
    incentivesRequested: string[];
    incentiveAmountsRequested: string[];
  }>;
  fillAmounts: string[];
  frontendFeeRecipient: string;
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].abi;

  const txOptions: TransactionOptionsType = {
    contractId: "RecipeMarketHub",
    chainId,
    id: "fill_ap_offers",
    label: "Fill AP Offers",
    address: address,
    abi: abi,
    functionName: "fillAPOffers",
    marketType: RoycoMarketType.recipe.id,
    args: [offers, fillAmounts, frontendFeeRecipient],
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};

export const getAPLimitOfferRecipeTransactionOptions = ({
  chainId,
  marketId,
  fundingVault,
  quantity,
  expiry,
  tokenAddresses,
  tokenAmounts,
}: {
  chainId: number;
  marketId: string;
  fundingVault: string;
  quantity: string;
  expiry: string;
  tokenAddresses: string[];
  tokenAmounts: string[];
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].abi;

  // Sort the tokens based on the address in ascending order
  const sortedTokens = (tokenAddresses as string[]).map((id, index) => {
    const address = tokenAddresses[index];
    const amount = tokenAmounts[index];

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
    contractId: "RecipeMarketHub",
    chainId,
    id: "create_ap_offer",
    label: "Create AP Offer",
    address,
    abi,
    functionName: "createAPOffer",
    marketType: RoycoMarketType.recipe.id,
    args: [
      marketId,
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

export const getIPLimitOfferRecipeTransactionOptions = ({
  chainId,
  marketId,
  quantity,
  expiry,
  tokenAddresses,
  tokenAmounts,
}: {
  chainId: number;
  marketId: string;
  quantity: string;
  expiry: string;
  tokenAddresses: string[];
  tokenAmounts: string[];
}) => {
  const address =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].address;
  const abi =
    ContractMap[chainId as keyof typeof ContractMap]["RecipeMarketHub"].abi;

  // Sort the tokens based on the address in ascending order
  const sortedTokens = (tokenAddresses as string[]).map((id, index) => {
    const address = tokenAddresses[index];
    const amount = tokenAmounts[index];

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
    contractId: "RecipeMarketHub",
    chainId,
    id: "create_ip_offer",
    label: "Create IP Offer",
    address,
    abi,
    functionName: "createIPOffer",
    marketType: RoycoMarketType.recipe.id,
    args: [
      marketId,
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
