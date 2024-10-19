import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
} from "../../market";
import {
  getSupportedToken,
  NULL_ADDRESS,
  SupportedToken,
} from "../../constants";
import { BigNumber, ethers } from "ethers";
import { Address, erc20Abi } from "viem";
import { useTokenQuotes } from ".././use-token-quotes";
import { TransactionOptionsType } from "../../types";
import { isMarketActionValid } from "./use-market-action-validator";
import { useEnrichedMarkets } from ".././use-enriched-markets";
import { useQuery } from "@tanstack/react-query";
import { useReadMarket } from "../use-read-market";
import { useMarketOffers } from "../use-market-offers";
import { useTokenIds } from "./use-token-ids";
import { useIncentivesData } from "./use-incentive-data";
import { useContractOptions } from "./use-contract-options";
import { useTokenAllowance } from "../use-token-allowance";

export const useMarketAction = ({
  chain_id,
  market_type,
  market_id,
  quantity,
  user_type,
  offer_type,
  funding_vault,
  expiry,
  incentive_token_ids,
  incentive_token_amounts,
  incentive_rates,
  incentive_start_timestamps,
  incentive_end_timestamps,
  account,
  frontendFeeRecipient,
  enabled = true,
  simulation_url,
}: {
  chain_id: number;
  market_type: TypedRoycoMarketType;
  market_id: string;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;

  quantity?: string;
  funding_vault?: string;
  expiry?: string;

  incentive_token_ids?: string[];
  incentive_token_amounts?: string[]; // For vault markets, this represents rate
  incentive_rates?: string[]; // For vault markets, this represents rate

  incentive_start_timestamps?: string[];
  incentive_end_timestamps?: string[];
  account?: string;
  frontendFeeRecipient: string;
  enabled?: boolean;
  simulation_url?: string;
}) => {
  // Get Market Data from contract for protocol fee and frontend fee
  const propsReadMarket = useReadMarket({
    chain_id,
    market_type,
    market_id,
  });

  // Get Market Data
  const propsEnrichedMarket = useEnrichedMarkets({
    chain_id,
    market_type:
      market_type === RoycoMarketType.recipe.id
        ? RoycoMarketType.recipe.value
        : RoycoMarketType.vault.value,
    market_id,
  });

  // Load Market Data
  const market =
    !!propsEnrichedMarket.data && propsEnrichedMarket.data.length > 0
      ? propsEnrichedMarket.data[0]
      : null;

  // Check Market Action Validity
  const { status: isValid, message: isValidMessage } = isMarketActionValid({
    chain_id,
    market_type,
    market_id,
    quantity,
    user_type,
    offer_type,
    funding_vault,
    expiry,
    incentive_token_ids,
    incentive_token_amounts,
    incentive_rates,
    incentive_start_timestamps,
    incentive_end_timestamps,
    account,
    market,
  });

  // Hold all token quotes
  // let token_ids: string[] = [];
  // let action_incentive_token_ids: string[] = [];
  // let action_incentive_token_amounts: string[] = [];
  let writeContractOptions: TransactionOptionsType[] = [];

  /**
   * Fetch Market Offers
   *
   * For Recipe Market: Fetch if offer_type is market
   * For Vault Market: Fetch if user_type is IP and offer_type is market
   */
  const propsMarketOffers = useMarketOffers({
    chain_id,
    market_type: market_type === RoycoMarketType.recipe.id ? 0 : 1,
    market_id,
    offer_side: user_type === RoycoMarketUserType.ap.id ? 1 : 0, // AP fills IP offers and IP fills AP offers
    quantity: quantity ?? "0",
    enabled:
      (market_type === RoycoMarketType.recipe.id &&
        offer_type === RoycoMarketOfferType.market.id) ||
      (market_type === RoycoMarketType.vault.id &&
        user_type === RoycoMarketUserType.ip.id &&
        offer_type === RoycoMarketOfferType.market.id)
        ? true
        : false,
  });

  // Modify token_ids
  const {
    token_ids,
    action_incentive_token_ids,
    action_incentive_token_amounts,
  } = useTokenIds({
    enabled:
      enabled &&
      isValid &&
      !!market &&
      !propsReadMarket.isLoading &&
      !!propsReadMarket.data &&
      !propsMarketOffers.isLoading,
    market_type,
    market,
    user_type,
    offer_type,
    propsMarketOffers,
    propsReadMarket,
    incentive_token_ids,
    incentive_token_amounts,
  });

  // Get token quotes
  const propsTokenQuotes = useTokenQuotes({
    token_ids,
  });

  // Combine all incentives data
  const { incentivesData, incentivesDataCalculated } = useIncentivesData({
    enabled:
      enabled &&
      !!market &&
      action_incentive_token_ids.length > 0 &&
      action_incentive_token_amounts.length > 0 &&
      !propsTokenQuotes.isLoading &&
      !!propsTokenQuotes.data,
    market_type,
    market,
    propsTokenQuotes,
    action_incentive_token_ids,
    action_incentive_token_amounts,
    quantity,
  });

  // console.log("incentivesData", incentivesData);

  // const propsTokenAllowance = useTokenAllowance({
  //   chain_id: chain_id,
  //   account: account ? (account as Address) : NULL_ADDRESS,
  //   spender:
  //     market_type === RoycoMarketType.recipe.id
  //       ? (ContractMap[chain_id]["RecipeMarketHub"].contract_address as Address)
  //       : (user_type === RoycoMarketUserType.ip.id &&
  //             offer_type === RoycoMarketOfferType.market.id) ||
  //           (user_type === RoycoMarketUserType.ap.id &&
  //             offer_type === RoycoMarketOfferType.limit.id)
  //         ? (ContractMap[chain_id]["VaultMarketHub"]
  //             .contract_address as Address)
  //         : (market_id as Address),
  //   tokens: token_ids.map((token) => {
  //     const [chainId, contractAddress] = token.split("-");

  //     return contractAddress as Address;
  //   }),
  // });

  // Combine all contract options
  const {
    canBePerformedCompletely,
    canBePerformedPartially,
    preContractOptions,
    postContractOptions,
  } = useContractOptions({
    enabled:
      !!market &&
      token_ids.length !== 0 &&
      !propsTokenQuotes.isLoading &&
      incentivesDataCalculated,
    chain_id,
    market_type,
    user_type,
    offer_type,
    funding_vault,
    market,
    quantity,
    incentive_token_ids,
    incentive_token_amounts,
    propsMarketOffers,
    propsReadMarket,
    incentivesData,
    frontendFeeRecipient,
    action_incentive_token_ids,
    action_incentive_token_amounts,
    expiry,
    account,
    incentive_rates,
    incentive_start_timestamps,
    incentive_end_timestamps,
  });

  const propsTokenAllowance = useTokenAllowance({
    chain_id: chain_id,
    account: account ? (account as Address) : NULL_ADDRESS,
    spender:
      postContractOptions.length > 0
        ? (postContractOptions[0].address as Address)
        : (NULL_ADDRESS as Address),
    tokens: preContractOptions.map((option) => {
      return option.address as Address;
    }),
  });

  if (
    !propsTokenAllowance.isLoading &&
    !!propsTokenAllowance.data &&
    postContractOptions.length > 0 &&
    preContractOptions.length > 0
  ) {
    writeContractOptions = [
      ...preContractOptions.map((option, optionIndex) => {
        const allowanceRequired = BigNumber.from(
          option.requiredApprovalAmount ?? "0"
        );
        const allowanceGiven = BigNumber.from(
          propsTokenAllowance.data[optionIndex]?.result ?? "0"
        );

        if (allowanceGiven.gte(allowanceRequired)) {
          return {
            ...option,
            txStatus: "success",
          };
        } else {
          return {
            ...option,
          };
        }
      }),
      ...postContractOptions,
    ];
  }

  // Check if the action is ready
  const isReady = isValid && writeContractOptions.length > 0;

  // Simulate contract options via a post call to simulation_url, useQuery will be used for making the post call
  const simulationProps = useQuery({
    enabled: enabled && isReady && !!simulation_url,
    queryKey: [
      "simulate",
      ...writeContractOptions.map((option) => JSON.stringify(option)).join(""),
    ],
    queryFn: async () => {
      const response = await fetch(simulation_url ?? "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: chain_id,
          transactions: writeContractOptions.map((option) => {
            return {
              contractId: option.contractId,
              chainId: option.chainId,
              id: option.id,
              address: option.address,
              functionName: option.functionName,
              marketType: option.marketType,
              args: option.args,
            };
          }),
          account,
        }),
      });

      const res = await response.json();

      const data = res.data as Array<{
        asset_changes: Array<{
          raw_amount: string;
          amount: string | null;
          dollar_value: number | null;
          from: string;
          to: string;
          token_info: {
            standard: string;
            contract_address: string;
          };
          type: string;
        }> | null;
      }>;

      const asset_changes = data
        .map((d) => {
          if (!!d.asset_changes) {
            return d.asset_changes;
          }
        })
        .filter((d) => !!d)
        .flat();

      const tokens_out = asset_changes.filter(
        (d) =>
          d.from.toLowerCase() === account?.toLowerCase() &&
          d.to.toLowerCase() !== account?.toLowerCase()
      );

      const tokens_in = asset_changes.filter(
        (d) =>
          d.to.toLowerCase() === account?.toLowerCase() &&
          d.from.toLowerCase() !== account?.toLowerCase()
      );

      const tokens_in_data = tokens_in.reduce(
        (acc: { [key: string]: any }, d) => {
          const token_id = `${chain_id}-${d.token_info.contract_address.toLowerCase()}`;
          const existingToken = acc[token_id];

          const token_data = getSupportedToken(token_id);

          if (existingToken) {
            // If token already exists, add up the amounts
            existingToken.raw_amount = BigNumber.from(existingToken.raw_amount)
              .add(BigNumber.from(d.raw_amount ?? "0") ?? "0")
              .toString();

            existingToken.token_amount = (
              parseFloat(existingToken.token_amount) +
              parseFloat(
                ethers.utils.formatUnits(
                  d.raw_amount ?? "0",
                  token_data.decimals
                )
              )
            ).toString();

            existingToken.token_amount_usd += d.dollar_value ?? 0;
          } else {
            // If token doesn't exist, add it to the accumulator
            acc[token_id] = {
              ...token_data,
              raw_amount: d.raw_amount ?? "0",
              token_amount: d.amount ?? "0",
              token_amount_usd: d.dollar_value ?? 0,
              type: "in",
            };
          }

          return acc;
        },
        {}
      );

      const tokens_out_data = tokens_out.reduce(
        (acc: { [key: string]: any }, d) => {
          const token_id = `${chain_id}-${d.token_info.contract_address.toLowerCase()}`;
          const existingToken = acc[token_id];

          const token_data = getSupportedToken(token_id);

          if (existingToken) {
            // If token already exists, add up the amounts
            existingToken.raw_amount = BigNumber.from(existingToken.raw_amount)
              .add(BigNumber.from(d.raw_amount) ?? "0")
              .toString();
            existingToken.token_amount = (
              parseFloat(existingToken.token_amount) +
              parseFloat(d.amount ?? "0")
            ).toString();
            existingToken.token_amount_usd += d.dollar_value ?? 0;
          } else {
            // If token doesn't exist, add it to the accumulator
            acc[token_id] = {
              ...token_data,
              raw_amount: d.raw_amount ?? "0",
              token_amount: parseFloat(
                ethers.utils.formatUnits(
                  d.raw_amount ?? "0",
                  token_data.decimals
                )
              ),
              token_amount_usd: d.dollar_value ?? 0,
              type: "out",
            };
          }

          return acc;
        },
        {}
      );

      const combined_token_data = [
        ...Object.values(tokens_in_data),
        ...Object.values(tokens_out_data),
      ];

      return combined_token_data;
    },
  });

  const isLoading =
    propsEnrichedMarket.isLoading ||
    propsReadMarket.isLoading ||
    propsMarketOffers.isLoading ||
    propsTokenQuotes.isLoading ||
    simulationProps.isLoading ||
    propsTokenAllowance.isLoading;

  return {
    isLoading,
    isValid,
    isReady,
    isValidMessage,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentivesData,
    simulationData: simulationProps.data as
      | Array<
          SupportedToken & {
            raw_amount: string;
            token_amount: number;
            token_amount_usd: number;
            type: "in" | "out";
          }
        >
      | null
      | undefined,
  };
};
