import { RoycoMarketType, RoycoMarketUserType } from "@/sdk/market";
import { isSolidityAddressValid, isSolidityIntValid } from "@/sdk/utils";
import { BigNumber, ethers } from "ethers";
import { EnrichedMarketDataType } from "@/sdk/queries";
import { useMarketOffers } from "../use-market-offers";
import { getTokenQuote, useTokenQuotes } from "../use-token-quotes";
import { getSupportedToken, NULL_ADDRESS } from "@/sdk/constants";
import { ContractMap } from "@/sdk/contracts";
import { TransactionOptionsType } from "@/sdk/types";
import { getApprovalContractOptions, refineTransactionOptions } from "./utils";
import { useTokenAllowance } from "../use-token-allowance";
import { Address } from "abitype";
import {
  TypedMarketActionIncentiveDataElement,
  TypedMarketActionInputTokenData,
} from "./types";
import { useDefaultMarketData } from "./use-default-market-data";
import { ReadMarketDataType } from "../use-read-market";
import { useReadVaultPreview } from "../use-read-vault-preview";

export const isVaultIPLimitOfferValid = ({
  baseMarket,
  enrichedMarket,
  token_ids,
  token_amounts,
  start_timestamps,
  end_timestamps,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  start_timestamps: string[] | undefined;
  end_timestamps: string[] | undefined;
}) => {
  try {
    // Check market
    if (!enrichedMarket || !baseMarket) {
      throw new Error("Market is missing");
    }

    // Check token IDs
    if (!token_ids) {
      throw new Error("Incentive IDs are missing");
    }

    // Check if at least one token ID is provided
    if (token_ids.length === 0) {
      throw new Error("No incentives added");
    }

    // Check token IDs for validity
    for (let i = 0; i < token_ids.length; i++) {
      const token_address = token_ids[i].split("-")[1];

      if (!isSolidityAddressValid("address", token_address)) {
        throw new Error("Incentive address is invalid");
      }
    }

    // Check token amounts
    if (!token_amounts) {
      throw new Error("Incentive amounts are missing");
    }

    // Check token rates for validity
    for (let i = 0; i < token_amounts.length; i++) {
      if (!isSolidityIntValid("uint256", token_amounts[i])) {
        throw new Error("Incentive amount is invalid");
      }

      if (BigNumber.from(token_amounts[i]).lte(0)) {
        throw new Error("Incentive amount must be greater than 0");
      }
    }

    // Check if lengths match
    if (token_ids.length !== token_amounts.length) {
      throw new Error("Incentive ids and amounts do not match");
    }

    // Check if incentive token is already added
    for (let i = 0; i < token_ids.length; i++) {
      const token_id = token_ids[i];
      const token_address = token_id.split("-")[1];

      // Handle if incentive token is already added
      if (enrichedMarket.incentive_ids?.includes(token_id)) {
        const existing_incentive_index =
          enrichedMarket.incentive_ids?.indexOf(token_id);

        // Check if end time of the new incentive is after the end time of the existing incentive
        if (
          BigNumber.from(end_timestamps?.[i] ?? 0).lt(
            BigNumber.from(start_timestamps?.[existing_incentive_index] ?? 0)
          )
        ) {
          throw new Error(
            "Incentive end time must be greater than the existing incentive end time"
          );
        }

        // Check if any interval is already in progress
        const current_time = Math.floor(Date.now() / 1000).toString();
        if (
          BigNumber.from(current_time).gte(
            BigNumber.from(start_timestamps?.[i] ?? 0)
          )
        ) {
          throw new Error("Incentive interval is already in progress");
        }

        // Get previous incentive rate
        const previous_rate = BigNumber.from(
          enrichedMarket.incentive_rates?.[existing_incentive_index] ?? 0
        );

        // Get new incentive amount
        const new_incentive_amount = BigNumber.from(token_amounts?.[i] ?? 0);

        // Get new incentive start and end timestamps, and interval in seconds
        const new_start = BigNumber.from(current_time).gt(
          BigNumber.from(
            enrichedMarket.start_timestamps?.[existing_incentive_index] ?? 0
          )
        )
          ? BigNumber.from(current_time)
          : BigNumber.from(current_time);
        const new_end = BigNumber.from(end_timestamps?.[i] ?? 0);
        const new_interval_seconds: BigNumber = new_end.sub(new_start);

        // Check if new incentive interval is at least 1 week
        if (new_interval_seconds.lt(BigNumber.from(7 * 24 * 60 * 60))) {
          throw new Error("Incentive must be at least 1 week long");
        }

        const new_rate: BigNumber =
          new_incentive_amount.div(new_interval_seconds);

        // Check if new incentive rate is not 0
        if (new_rate.lte(0)) {
          throw new Error("New incentive rate must be greater than 0");
        }

        // Check if new incentive rate is greater than the existing incentive rate
        if (new_rate.lte(previous_rate)) {
          throw new Error(
            "New incentive rate must be greater than the existing incentive rate"
          );
        }
      }
      // Handle if incentive token is not added
      else {
        // Check if vault has reached the maximum number of incentives
        if (enrichedMarket.incentive_ids?.length === 20) {
          throw new Error("Vault can only have 20 incentives");
        }

        // Check if start timestamps are provided
        if (!start_timestamps) {
          throw new Error("Start timestamps are missing");
        }

        // Check if end timestamps are provided
        if (!end_timestamps) {
          throw new Error("End timestamps are missing");
        }

        // Check if lengths match
        if (
          start_timestamps?.length !== end_timestamps?.length ||
          start_timestamps?.length !== token_ids.length
        ) {
          throw new Error("Start and end timestamps do not match");
        }

        // Check if end time is greater than start time
        if (
          BigNumber.from(end_timestamps?.[i] ?? 0).lt(
            BigNumber.from(start_timestamps?.[i] ?? 0)
          )
        ) {
          throw new Error("Incentive end time must be greater than start time");
        }

        // Check if end time is in the future
        const current_time = Math.floor(Date.now() / 1000).toString();
        if (BigNumber.from(current_time).gt(end_timestamps?.[i] ?? 0)) {
          throw new Error("Incentive end time must be in the future");
        }

        // Check if interval is greater than 1 week
        const interval_seconds: BigNumber = BigNumber.from(
          end_timestamps?.[i] ?? 0
        ).sub(BigNumber.from(start_timestamps?.[i] ?? 0));
        if (interval_seconds.lt(BigNumber.from(7 * 24 * 60 * 60))) {
          throw new Error("Incentive must be at least 1 week long");
        }

        // Check if rate is not 0
        const reward_amount: BigNumber = BigNumber.from(
          token_amounts?.[i] ?? 0
        );
        const protocol_fee: BigNumber = reward_amount
          .mul(BigNumber.from(baseMarket?.protocol_fee ?? 0))
          .div(BigNumber.from(10).pow(18));
        const frontend_fee: BigNumber = reward_amount
          .mul(BigNumber.from(baseMarket?.frontend_fee ?? 0))
          .div(BigNumber.from(10).pow(18));

        const actual_reward_amount: BigNumber = reward_amount
          .add(protocol_fee)
          .add(frontend_fee);
        const rate: BigNumber = actual_reward_amount.div(interval_seconds);

        if (rate.lte(0)) {
          throw new Error("Incentive rate must be greater than 0");
        }
      }
    }

    return {
      status: true,
      message: "Valid market action",
    };
  } catch (error: any) {
    return {
      status: false,
      message: error.message
        ? (error.message as string)
        : "Invalid market action",
    };
  }
};

export const calculateVaultIPLimitOfferTokenData = ({
  baseMarket,
  enrichedMarket,
  propsTokenQuotes,
  tokenIds,
  tokenAmounts,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  tokenIds: string[];
  tokenAmounts: string[];
}) => {
  let incentiveData: Array<TypedMarketActionIncentiveDataElement> = [];

  // Get the unique token IDs
  const action_incentive_token_ids: string[] = tokenIds;

  // Get action incentive token amounts
  // here, amount is calculated as incentives over the time duration of 1 year
  const action_incentive_token_amounts: string[] = tokenAmounts.map(
    (amount) => {
      return BigNumber.from(amount).toString();
    }
  );

  // Get input token quote
  const input_token_quote = getTokenQuote({
    token_id: enrichedMarket?.input_token_id ?? "",
    token_quotes: propsTokenQuotes,
  });

  // Get input token data
  const input_token_data: TypedMarketActionInputTokenData = {
    ...input_token_quote,
    raw_amount: "0",
    token_amount: 0,
    token_amount_usd: 0,
  };

  if (!!enrichedMarket) {
    // Calculate incentive data
    incentiveData = action_incentive_token_ids.map(
      (incentive_token_id, index) => {
        // Get incentive token quote
        const incentive_token_quote = getTokenQuote({
          token_id: incentive_token_id,
          token_quotes: propsTokenQuotes,
        });

        // Get incentive token raw amount
        const incentive_token_raw_amount =
          action_incentive_token_amounts[index];

        // Get incentive token amount
        const incentive_token_amount = parseFloat(
          ethers.utils.formatUnits(
            incentive_token_raw_amount || "0",
            incentive_token_quote.decimals
          )
        );

        // Get incentive token amount in USD
        const incentive_token_amount_usd =
          incentive_token_quote.price * incentive_token_amount;

        // Get per input token
        const per_input_token = 0;

        // Get annual change ratio
        let annual_change_ratio = Math.pow(10, 18); // 10^18 refers to N/D

        // Get incentive token data
        const incentive_token_data = {
          ...incentive_token_quote,
          raw_amount: incentive_token_raw_amount,
          token_amount: incentive_token_amount,
          token_amount_usd: incentive_token_amount_usd,
          per_input_token,
          annual_change_ratio,
        };

        return incentive_token_data;
      }
    );
  }

  return {
    incentiveData,
    inputTokenData: input_token_data,
  };
};

export const getVaultIPLimitOfferTransactionOptions = ({
  baseMarket,
  enrichedMarket,
  chain_id,
  token_ids,
  token_amounts,
  start_timestamps,
  end_timestamps,
  frontend_fee_recipient,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  chain_id: number;
  market_id: string;
  token_ids: string[];
  token_amounts: string[];
  start_timestamps: string[];
  end_timestamps: string[];
  frontend_fee_recipient?: string;
}) => {
  // Get contract address and ABI
  const address = enrichedMarket?.market_id ?? "";
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]["WrappedVault"].abi;

  // Get add reward transaction options
  let addRewardTxOptions: TransactionOptionsType[] = [];

  // Loop through the token IDs
  for (let i = 0; i < token_ids.length; i++) {
    const token_id = token_ids[i];
    const token_address = token_id.split("-")[1];
    const token_amount = token_amounts[i];
    const token_data = getSupportedToken(token_id);

    const existing_token_ids = enrichedMarket?.incentive_ids ?? [];

    if (existing_token_ids.includes(token_id)) {
      continue;
    } else {
      const newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId: chain_id,
        id: `add_reward_${token_address}`,
        label: `Add Reward ${token_data?.symbol.toUpperCase()}`,
        address,
        abi,
        functionName: "addRewardsToken",
        marketType: RoycoMarketType.vault.id,
        args: [token_address],
        txStatus: "idle",
        txHash: null,
      };

      addRewardTxOptions.push(newTxOptions);
    }
  }

  // Get set reward transaction options
  let setRewardTxOptions: TransactionOptionsType[] = [];

  // Set New Rewards
  for (let i = 0; i < token_ids.length; i++) {
    const token_id = token_ids[i];
    const token_address = token_id.split("-")[1];
    const token_data = getSupportedToken(token_id);

    const existing_token_ids = enrichedMarket?.incentive_ids ?? [];

    if (existing_token_ids.includes(token_id)) {
      continue;
    } else {
      const newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId: chain_id,
        id: `set_reward_${token_address}`,
        label: `Set Reward ${token_data?.symbol.toUpperCase()}`,
        address,
        abi,
        functionName: "setRewardsInterval",
        marketType: RoycoMarketType.vault.id,
        args: [
          token_address,
          start_timestamps[i],
          end_timestamps[i],
          token_amounts[i],
          frontend_fee_recipient
            ? frontend_fee_recipient
            : baseMarket?.protocol_fee_recipient,
        ],
        txStatus: "idle",
        txHash: null,
        tokensOut: [
          {
            ...token_data,
            raw_amount: token_amounts[i],
            token_amount: parseFloat(
              ethers.utils.formatUnits(
                token_amounts[i] || "0",
                token_data.decimals
              )
            ),
          },
        ],
      };

      setRewardTxOptions.push(newTxOptions);
    }
  }

  // Get extend reward transaction options
  let extendRewardTxOptions: TransactionOptionsType[] = [];

  // Extend Rewards
  for (let i = 0; i < token_ids.length; i++) {
    const token_id = token_ids[i];
    const token_address = token_id.split("-")[1];
    const token_data = getSupportedToken(token_id);

    const existing_token_ids = enrichedMarket?.incentive_ids ?? [];

    if (existing_token_ids.includes(token_id)) {
      const newTxOptions: TransactionOptionsType = {
        contractId: "WrappedVault",
        chainId: chain_id,
        id: `extend_reward_${token_address}`,
        label: `Extend Reward ${token_data?.symbol.toUpperCase()}`,
        address,
        abi,
        functionName: "extendRewardsInterval",
        marketType: RoycoMarketType.vault.id,
        args: [
          token_address,
          token_amounts[i],
          end_timestamps[i],
          frontend_fee_recipient
            ? frontend_fee_recipient
            : baseMarket?.protocol_fee_recipient,
        ],
        txStatus: "idle",
        txHash: null,
      };

      extendRewardTxOptions.push(newTxOptions);
    } else {
      continue;
    }
  }

  // Combine all transaction options
  const txOptions = [
    ...addRewardTxOptions,
    ...setRewardTxOptions,
    ...extendRewardTxOptions,
  ];

  return txOptions;
};

export const useVaultIPLimitOffer = ({
  account,
  chain_id,
  market_id,
  token_ids,
  token_amounts,
  start_timestamps,
  end_timestamps,
  custom_token_data,
  frontend_fee_recipient,
  enabled,
}: {
  account: string | undefined;
  chain_id: number;
  market_id: string;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  start_timestamps: string[] | undefined;
  end_timestamps: string[] | undefined;
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  frontend_fee_recipient?: string;
  enabled?: boolean;
}) => {
  let preContractOptions: TransactionOptionsType[] = [];
  let postContractOptions: TransactionOptionsType[] = [];
  let writeContractOptions: TransactionOptionsType[] = [];
  let canBePerformedCompletely: boolean = false;
  let canBePerformedPartially: boolean = false;

  const {
    baseMarket,
    enrichedMarket,
    isLoading: isLoadingDefaultMarketData,
  } = useDefaultMarketData({
    chain_id,
    market_id,
    market_type: RoycoMarketType.vault.id,
    enabled,
  });

  // Check if market action is valid
  const isValid = isVaultIPLimitOfferValid({
    baseMarket,
    enrichedMarket,
    token_ids,
    token_amounts,
    start_timestamps,
    end_timestamps,
  });

  // Get token quotes
  const propsTokenQuotes = useTokenQuotes({
    token_ids: Array.from(
      new Set([enrichedMarket?.input_token_id ?? "", ...(token_ids ?? [])])
    ),
    custom_token_data,
    enabled: isValid.status && enabled,
  });

  // Get incentive data
  const { incentiveData, inputTokenData } = calculateVaultIPLimitOfferTokenData(
    {
      baseMarket,
      enrichedMarket,
      propsTokenQuotes,
      tokenIds: token_ids ?? [],
      tokenAmounts: token_amounts ?? [],
    }
  );

  // Create transaction options
  if (
    isValid.status &&
    !!baseMarket &&
    !!enrichedMarket &&
    !!incentiveData &&
    !!inputTokenData
  ) {
    // Get offer transaction options
    const offerTxOptions: TransactionOptionsType[] =
      getVaultIPLimitOfferTransactionOptions({
        baseMarket,
        enrichedMarket,
        chain_id,
        market_id,
        token_ids: token_ids ?? [],
        token_amounts: token_amounts ?? [],
        start_timestamps: start_timestamps ?? [],
        end_timestamps: end_timestamps ?? [],

        frontend_fee_recipient:
          frontend_fee_recipient ?? baseMarket?.protocol_fee_recipient,
      });

    // Set offer transaction options
    postContractOptions = offerTxOptions;

    // Get approval transaction options
    const approvalTxOptions: TransactionOptionsType[] =
      getApprovalContractOptions({
        market_type: RoycoMarketType.vault.id,
        token_ids: token_ids ?? [],
        required_approval_amounts: token_amounts ?? [],
        spender: market_id,
      });

    // Set approval transaction options
    preContractOptions = approvalTxOptions;
  }

  // Get token allowance
  const propsTokenAllowance = useTokenAllowance({
    chain_id: chain_id,
    account: account ? (account as Address) : NULL_ADDRESS,
    spender: market_id as Address,
    tokens: preContractOptions.map((option) => {
      return option.address as Address;
    }),
  });

  if (!propsTokenAllowance.isLoading) {
    // Refine transaction options
    writeContractOptions = refineTransactionOptions({
      propsTokenAllowance,
      preContractOptions,
      postContractOptions,
    });
  }

  // Check if loading
  const isLoading =
    isLoadingDefaultMarketData ||
    propsTokenAllowance.isLoading ||
    propsTokenQuotes.isLoading;

  // Check if ready
  const isReady = writeContractOptions.length > 0;

  // Check if offer can be performed completely or partially
  if (isReady) {
    canBePerformedCompletely = true;
    canBePerformedPartially = true;
  }

  return {
    isValid,
    isLoading,
    isReady,
    incentiveData,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
  };
};
