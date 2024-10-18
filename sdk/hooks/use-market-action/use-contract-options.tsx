import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
} from "../../market";
import { getSupportedToken, SupportedToken } from "../../constants";
import { ContractMap } from "../../contracts";
import { BigNumber, ethers } from "ethers";
import { TransactionOptionsType } from "../../types";
import {
  getAPLimitOfferVaultTransactionOptions,
  getAPMarketOfferVaultTransactionOptions,
  getIPLimitOfferVaultAddRewardTransactionOptions,
  getIPLimitOfferVaultSetRewardTransactionOptions,
} from "./use-market-action-vault-handlers";
import {
  getAPLimitOfferRecipeTransactionOptions,
  getAPMarketOfferRecipeTransactionOptions,
  getIPLimitOfferRecipeTransactionOptions,
  getIPMarketOfferRecipeTransactionOptions,
} from "./use-market-action-recipe-handlers";
import { getTokenApprovalContractOptions } from "./approval-handler";
import { useReadMarket } from "../use-read-market";
import { useMarketOffers } from "../use-market-offers";
import { EnrichedMarketDataType } from "@/sdk/queries";

export const useContractOptions = ({
  enabled,
  chain_id,
  market_type,
  market,
  user_type,
  offer_type,
  funding_vault,
  propsMarketOffers,
  propsReadMarket,
  incentive_token_ids,
  incentive_token_amounts,
  quantity,
  frontendFeeRecipient,
  incentivesData,
  action_incentive_token_ids,
  action_incentive_token_amounts,
  expiry,
  account,
  incentive_rates,
  incentive_start_timestamps,
  incentive_end_timestamps,
}: {
  enabled: boolean;
  chain_id: number;
  market_type: TypedRoycoMarketType;
  market: EnrichedMarketDataType | null;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;
  funding_vault?: string;
  propsMarketOffers: ReturnType<typeof useMarketOffers>;
  propsReadMarket: ReturnType<typeof useReadMarket>;
  incentive_token_ids?: string[];
  incentive_token_amounts?: string[];
  quantity?: string;
  frontendFeeRecipient: string;
  incentivesData: Array<
    SupportedToken & {
      raw_amount: string;
      token_amount: number;
      per_input_token: number;
      annual_change_ratio: number;
    }
  >;
  action_incentive_token_ids: string[];
  action_incentive_token_amounts: string[];
  expiry?: string;
  account?: string;
  incentive_rates?: string[];
  incentive_start_timestamps?: string[];
  incentive_end_timestamps?: string[];
}) => {
  // Tracker for whether the action can be performed completely or partially
  let canBePerformedCompletely = false;
  let canBePerformedPartially = false;

  let preContractOptions: TransactionOptionsType[] = [];
  let postContractOptions: TransactionOptionsType[] = [];

  if (enabled && !!market) {
    try {
      // handle recipe market
      if (market_type === RoycoMarketType.recipe.id) {
        // handle AP
        if (user_type === RoycoMarketUserType.ap.id) {
          // handle AP
          if (offer_type === RoycoMarketOfferType.market.id) {
            // handle AP market offer recipe market

            // Get Total Fill Quantity
            const total_fill_quantity: BigNumber =
              propsMarketOffers.data?.reduce((acc, offer) => {
                return acc.add(BigNumber.from(offer.quantity));
              }, BigNumber.from(0)) || BigNumber.from(0);

            // Check if the offer can be performed completely or partially
            if (total_fill_quantity === BigNumber.from(0)) {
              canBePerformedCompletely = false;
              canBePerformedPartially = false;
            } else if (total_fill_quantity.lt(BigNumber.from(quantity))) {
              canBePerformedCompletely = false;
              canBePerformedPartially = true;
            } else {
              canBePerformedCompletely = true;
              canBePerformedPartially = true;
            }

            const txOptions: TransactionOptionsType =
              getAPMarketOfferRecipeTransactionOptions({
                chainId: chain_id,
                offerIds: (propsMarketOffers.data || []).map(
                  (offer) => offer.offer_id
                ),
                fillAmounts: (propsMarketOffers.data || []).map(
                  (offer) => offer.fill_quantity
                ),
                fundingVault: funding_vault as string,
                frontendFeeRecipient,
              });

            // Offer options
            postContractOptions = [
              {
                ...txOptions,
                tokensOut: [
                  {
                    ...getSupportedToken(market.input_token_id as string),
                    raw_amount: quantity as string,
                    token_amount: parseFloat(
                      ethers.utils.formatUnits(
                        quantity as string,
                        getSupportedToken(market.input_token_id as string)
                          .decimals
                      )
                    ),
                  },
                ],
                tokensIn: incentivesData,
              },
            ];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: [market.input_token_id as string],
              spender:
                ContractMap[chain_id as keyof typeof ContractMap][
                  "RecipeMarketHub"
                ].address,
              requiredApprovalAmounts: [quantity as string],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          } else {
            // handle AP limit offer recipe market
            canBePerformedCompletely = true;
            canBePerformedPartially = true;

            const txOptions: TransactionOptionsType =
              getAPLimitOfferRecipeTransactionOptions({
                chainId: chain_id,
                marketId: market.market_id as string,
                fundingVault: funding_vault as string,
                quantity: quantity as string,
                expiry: expiry as string,
                tokenAddresses: (incentive_token_ids as string[]).map(
                  (id, index) => {
                    const contract_address = id.split("-")[1];
                    return contract_address;
                  }
                ),
                tokenAmounts: incentive_token_amounts as string[],
              });

            // Offer options
            postContractOptions = [txOptions];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: [market.input_token_id as string],
              spender:
                ContractMap[chain_id as keyof typeof ContractMap][
                  "RecipeMarketHub"
                ].address,
              requiredApprovalAmounts: [quantity as string],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          }
        } else {
          // handle IP
          if (offer_type === RoycoMarketOfferType.market.id) {
            // handle IP market offer recipe market

            // Get Total Fill Quantity
            const total_fill_quantity: BigNumber =
              propsMarketOffers.data?.reduce((acc, offer) => {
                return acc.add(BigNumber.from(offer.quantity));
              }, BigNumber.from(0)) || BigNumber.from(0);

            // Check if the offer can be performed completely or partially
            if (total_fill_quantity === BigNumber.from(0)) {
              canBePerformedCompletely = false;
              canBePerformedPartially = false;
            } else if (total_fill_quantity.lt(BigNumber.from(quantity))) {
              canBePerformedCompletely = false;
              canBePerformedPartially = true;
            } else {
              canBePerformedCompletely = true;
              canBePerformedPartially = true;
            }

            const txOptions: TransactionOptionsType =
              getIPMarketOfferRecipeTransactionOptions({
                chainId: chain_id,
                offers: (propsMarketOffers.data || []).map((offer) => {
                  const offerID = offer.offer_id;
                  const targetMarketID = offer.market_id;
                  const quantity = offer.quantity;
                  const ap = offer.creator;
                  const fundingVault = offer.funding_vault;
                  const expiry = offer.expiry;
                  const incentivesRequested = offer.token_ids;
                  const incentiveAmountsRequested = offer.token_amounts;

                  return {
                    offerID,
                    targetMarketID,
                    ap,
                    fundingVault,
                    quantity,
                    expiry,
                    incentivesRequested,
                    incentiveAmountsRequested,
                  };
                }),

                fillAmounts: (propsMarketOffers.data || []).map(
                  (offer) => offer.fill_quantity
                ),
                frontendFeeRecipient,
              });

            // Offer options
            postContractOptions = [
              {
                ...txOptions,
                tokensIn: [
                  {
                    ...getSupportedToken(market.input_token_id as string),
                    raw_amount: quantity as string,
                    token_amount: parseFloat(
                      ethers.utils.formatUnits(
                        quantity as string,
                        getSupportedToken(market.input_token_id as string)
                          .decimals
                      )
                    ),
                  },
                ],
                tokensOut: incentivesData.map((incentive, index) => {
                  const raw_amount_without_fees =
                    action_incentive_token_amounts[index];
                  const raw_amount_with_fees = BigNumber.from(
                    raw_amount_without_fees
                  )
                    .add(
                      BigNumber.from(raw_amount_without_fees).mul(
                        BigNumber.from(
                          propsReadMarket.data?.protocol_fee as string
                        ).div(BigNumber.from(10).pow(18))
                      )
                    )
                    .add(
                      BigNumber.from(raw_amount_without_fees).mul(
                        BigNumber.from(
                          propsReadMarket.data?.frontend_fee as string
                        ).div(BigNumber.from(10).pow(18))
                      )
                    );

                  const raw_amount = raw_amount_with_fees.toString();

                  const token_amount = parseFloat(
                    ethers.utils.formatUnits(
                      raw_amount_with_fees.toString(),
                      incentive.decimals
                    )
                  );

                  return {
                    ...incentive,
                    raw_amount,
                    token_amount,
                  };
                }),
              },
            ];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: [...action_incentive_token_ids],
              spender:
                ContractMap[chain_id as keyof typeof ContractMap][
                  "RecipeMarketHub"
                ].address,
              requiredApprovalAmounts: incentive_token_amounts || [],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          } else {
            // handle IP limit offer recipe market
            canBePerformedCompletely = true;
            canBePerformedPartially = true;

            const txOptions: TransactionOptionsType =
              getIPLimitOfferRecipeTransactionOptions({
                chainId: chain_id,
                marketId: market.market_id as string,
                quantity: quantity as string,
                expiry: expiry as string,
                tokenAddresses: (incentive_token_ids as string[]).map(
                  (id, index) => {
                    const contract_address = id.split("-")[1];
                    return contract_address;
                  }
                ),
                tokenAmounts: incentive_token_amounts as string[],
              });

            // Offer options
            postContractOptions = [
              {
                ...txOptions,
                tokensOut: incentivesData.map((incentive, index) => {
                  const raw_amount_without_fees =
                    action_incentive_token_amounts[index];
                  const raw_amount_with_fees = BigNumber.from(
                    raw_amount_without_fees
                  )
                    .add(
                      BigNumber.from(raw_amount_without_fees).mul(
                        BigNumber.from(
                          propsReadMarket.data?.protocol_fee as string
                        ).div(BigNumber.from(10).pow(18))
                      )
                    )
                    .add(
                      BigNumber.from(raw_amount_without_fees).mul(
                        BigNumber.from(
                          propsReadMarket.data?.frontend_fee as string
                        ).div(BigNumber.from(10).pow(18))
                      )
                    );

                  const raw_amount = raw_amount_with_fees.toString();

                  const token_amount = parseFloat(
                    ethers.utils.formatUnits(
                      raw_amount_with_fees.toString(),
                      incentive.decimals
                    )
                  );

                  return {
                    ...incentive,
                    raw_amount,
                    token_amount,
                  };
                }),
              },
            ];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: incentive_token_ids as string[],
              spender:
                ContractMap[chain_id as keyof typeof ContractMap][
                  "RecipeMarketHub"
                ].address,
              requiredApprovalAmounts: incentive_token_amounts || [],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          }
        }
      } else {
        // handle vault market
        if (user_type === RoycoMarketUserType.ap.id) {
          // handle AP
          if (offer_type === RoycoMarketOfferType.market.id) {
            // handle AP market offer vault market
            canBePerformedCompletely = true;
            canBePerformedPartially = true;

            const interactionContractAddress = market.market_id as string;

            const txOptions: TransactionOptionsType =
              getAPMarketOfferVaultTransactionOptions({
                chainId: chain_id,
                address: interactionContractAddress,
                quantity: quantity as string,
                account: account as string,
              });

            // Offer options
            postContractOptions = [txOptions];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: [market.input_token_id as string],
              spender: interactionContractAddress,
              requiredApprovalAmounts: [quantity as string],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          } else {
            // handle AP limit offer vault market
            canBePerformedCompletely = true;
            canBePerformedPartially = true;

            const interactionContractAddress =
              ContractMap[chain_id as keyof typeof ContractMap][
                "VaultMarketHub"
              ].address;

            const txOptions: TransactionOptionsType =
              getAPLimitOfferVaultTransactionOptions({
                chainId: chain_id,
                address: interactionContractAddress,
                targetMarketId: market.market_id as string,
                fundingVault: funding_vault as string,
                quantity: quantity as string,
                expiry: expiry as string,
                tokenAddresses: (incentive_token_ids as string[]).map(
                  (id, index) => {
                    const contract_address = id.split("-")[1];
                    return contract_address;
                  }
                ),
                tokenRates: incentive_rates as string[],
              });

            // Offer options
            postContractOptions = [txOptions];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: [market.input_token_id as string],
              spender: interactionContractAddress,
              requiredApprovalAmounts: [quantity as string],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          }
        } else {
          // handle IP

          if (offer_type === RoycoMarketOfferType.market.id) {
            // handle IP limit offer vault market
            const interactionContractAddress =
              ContractMap[chain_id as keyof typeof ContractMap][
                "VaultMarketHub"
              ].address;

            // handle IP limit offer vault market
            /**
             * @TODO Implement IP limit offer vault market (need to call allocate function on VaultMarketHub contract)
             */
          } else {
            // handle IP market offer vault market
            canBePerformedCompletely = true;
            canBePerformedPartially = true;

            const interactionContractAddress = market.market_id as string;

            const tokenIds = incentive_token_ids?.filter(
              (id) => !(market.incentive_ids || []).includes(id.toLowerCase())
            );

            const addRewardTxOptions: TransactionOptionsType[] =
              getIPLimitOfferVaultAddRewardTransactionOptions({
                chainId: chain_id,
                address: interactionContractAddress,
                tokenIds: tokenIds || [],
                existingTokenIds: market.incentive_ids || [],
              });

            const setRewardTxOptions: TransactionOptionsType[] =
              getIPLimitOfferVaultSetRewardTransactionOptions({
                chainId: chain_id,
                address: interactionContractAddress,
                tokenIds: incentive_token_ids as string[],
                tokenAmounts: incentive_token_amounts as string[],
                startTimestamps: incentive_start_timestamps as string[],
                endTimestamps: incentive_end_timestamps as string[],
                existingTokenIds: market.incentive_ids || [],
                frontendFeeRecipient,
              });

            // Offer options
            postContractOptions = [
              ...addRewardTxOptions,
              ...setRewardTxOptions,
            ];

            const approvalTxOptions = getTokenApprovalContractOptions({
              marketType: market_type,
              tokenIds: incentive_token_ids as string[],
              spender: interactionContractAddress,
              requiredApprovalAmounts: action_incentive_token_amounts || [],
            });

            // Approval options
            preContractOptions = [...approvalTxOptions];
          }
        }
      }
    } catch (error) {
      console.log("market action error", error);
    }
  }

  return {
    canBePerformedCompletely,
    canBePerformedPartially,
    preContractOptions,
    postContractOptions,
  };
};
