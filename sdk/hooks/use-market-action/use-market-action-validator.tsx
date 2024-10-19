import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
} from "../../market";

import { isSolidityAddressValid, isSolidityIntValid } from "../../utils";
import { BigNumber } from "ethers";
import { EnrichedMarketDataType } from "../../queries";

export const isMarketActionValid = ({
  market,
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
}: {
  market: EnrichedMarketDataType | null;
  chain_id: number;
  market_type: TypedRoycoMarketType;
  market_id: string;
  quantity?: string;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;
  funding_vault?: string;
  expiry?: string;
  incentive_token_ids?: string[];
  incentive_token_amounts?: string[];
  incentive_rates?: string[];
  incentive_start_timestamps?: string[];
  incentive_end_timestamps?: string[];
  account?: string;
}): {
  status: boolean;
  message: string;
} => {
  try {
    // Check market exists
    if (!market) {
      throw new Error("Market not found");
    }

    // Check quantity for validity
    if (
      market_type === RoycoMarketType.vault.id &&
      user_type === RoycoMarketUserType.ip.id &&
      offer_type === RoycoMarketOfferType.limit.id
    ) {
      // quantity not required
    } else {
      if (!quantity) {
        throw new Error("Quantity is missing");
      }

      if (!isSolidityIntValid("uint256", quantity)) {
        throw new Error("Quantity is invalid");
      }

      if (BigNumber.from(quantity).lte(0)) {
        throw new Error("Quantity must be greater than 0");
      }
    }

    // Check funding vault for AP limit offers
    if (
      user_type === RoycoMarketUserType.ap.id &&
      offer_type === RoycoMarketOfferType.limit.id
    ) {
      if (!funding_vault) {
        throw new Error("Funding vault is missing");
      } else if (!isSolidityAddressValid("address", funding_vault)) {
        throw new Error("Funding vault is invalid");
      }
    }

    // Check address for validity for all offers
    if (!isSolidityAddressValid("address", account)) {
      throw new Error("Wallet not connected");
    }

    // Check expiry for limit offers for recipe markets, except vault ip offers
    if (
      offer_type === RoycoMarketOfferType.limit.id &&
      market_type === RoycoMarketType.vault.id &&
      user_type === RoycoMarketUserType.ip.id
    ) {
      // skip
    } else if (offer_type === RoycoMarketOfferType.limit.id) {
      if (!expiry) {
        throw new Error("Expiry time is missing");
      } else if (!isSolidityIntValid("uint256", expiry)) {
        throw new Error("Expiry time is invalid");
      } else if (
        expiry !== "0" &&
        parseInt(expiry) < Math.floor(Date.now() / 1000)
      ) {
        throw new Error("Expiry time must be in the future");
      }
    }

    // Check incentives for validity
    if (offer_type === RoycoMarketOfferType.limit.id) {
      // Check if incentive exists
      if (!incentive_token_ids || !incentive_token_amounts) {
        throw new Error("Incentives are missing");
      }

      // Incentives must be added
      if (incentive_token_ids.length === 0) {
        throw new Error("Incentives are missing");
      }

      // Check incentive lengths
      if (incentive_token_ids.length !== incentive_token_amounts.length) {
        throw new Error("Incentive token ids and amounts do not match");
      }

      // Check incentive values
      for (let i = 0; i < incentive_token_ids.length; i++) {
        if (!isSolidityIntValid("uint256", incentive_token_amounts[i])) {
          throw new Error("Incentive token amount is invalid");
        }
      }

      if (
        market_type === RoycoMarketType.vault.id &&
        user_type === RoycoMarketUserType.ap.id
      ) {
        // Check if incentive rates are provided
        if (!incentive_rates) {
          throw new Error("Incentive rates are missing");
        }

        // Check if incentive rates are valid
        for (let i = 0; i < incentive_rates.length; i++) {
          if (!isSolidityIntValid("uint256", incentive_rates[i])) {
            throw new Error("Incentive rate is invalid");
          }

          if (incentive_rates[i] === "0") {
            throw new Error("Incentive rate must be greater than 0");
          }
        }

        // Check if incentive rates match
        if (incentive_rates.length !== incentive_token_ids.length) {
          throw new Error("Incentive rates are invalid");
        }

        for (let i = 0; i < incentive_rates.length; i++) {
          if (!isSolidityIntValid("uint256", incentive_rates[i])) {
            throw new Error("Incentive rate is invalid");
          }
        }
      }

      // Extra conditions for vault markets
      if (
        market_type === RoycoMarketType.vault.id &&
        user_type === RoycoMarketUserType.ip.id
      ) {
        // Check if incentive amounts are provided
        if (!incentive_token_amounts) {
          throw new Error("Incentive amounts are missing");
        }

        // Check if incentive amounts are valid
        for (let i = 0; i < incentive_token_amounts.length; i++) {
          if (!isSolidityIntValid("uint256", incentive_token_amounts[i])) {
            throw new Error("Incentive amount is invalid");
          }
        }

        // Check if incentive timestamps are provided
        if (!incentive_start_timestamps || !incentive_end_timestamps) {
          throw new Error("Incentive timestamps are missing");
        }

        // Check if incentive timestamps match
        if (
          incentive_start_timestamps.length !== incentive_token_ids.length &&
          incentive_start_timestamps.length !== incentive_end_timestamps.length
        ) {
          throw new Error("Incentive timestamps are invalid");
        }

        // Check incentive timestamps validity
        for (let i = 0; i < incentive_start_timestamps.length; i++) {
          if (!isSolidityIntValid("uint256", incentive_start_timestamps[i])) {
            throw new Error("Incentive start timestamp is invalid");
          } else if (
            !isSolidityIntValid("uint256", incentive_end_timestamps[i])
          ) {
            throw new Error("Incentive end timestamp is invalid");
          } else if (
            parseInt(incentive_start_timestamps[i]) >=
            parseInt(incentive_end_timestamps[i])
          ) {
            throw new Error("Incentive start time must less than end time");
          } else if (
            parseInt(incentive_end_timestamps[i]) <=
            Math.floor(Date.now() / 1000)
          ) {
            throw new Error("Incentive end time must be in the future");
          }
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
      message: error.message ? error.message : "Invalid market action",
    };
  }
};
