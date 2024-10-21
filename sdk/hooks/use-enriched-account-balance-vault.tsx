import { EnrichedMarketDataType } from "../queries";
import { useTokenQuotes } from "./use-token-quotes";
import { ContractMap } from "../contracts";
import { Abi, Address } from "abitype";
import { useReadContracts } from "wagmi";
import { getSupportedToken, SupportedToken } from "../constants";
import { BigNumber, ethers } from "ethers";

export const useEnrichedAccountBalanceVault = ({
  account_address,
  market,
  enabled = true,
}: {
  account_address: string;
  market: EnrichedMarketDataType;
  enabled?: boolean;
}) => {
  let data = {
    deposit_token_data: {
      ...getSupportedToken(""),
      raw_amount: "",
      token_amount: 0,
      token_amount_usd: 0,
    },
    incentive_token_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
      }
    >(),
    total_balance_usd: 0,
  };

  const token_ids = !!market
    ? [
        market.input_token_id ?? "",
        ...market.incentive_tokens_data.map((incentive) => incentive.id),
      ]
    : [];

  const propsTokenQuotes = useTokenQuotes({
    token_ids,
  });

  const vaultContracts = !!market
    ? [
        {
          chainId: market.chain_id,
          address: market.market_id as Address,
          abi: ContractMap[market.chain_id as keyof typeof ContractMap][
            "WrappedVault"
          ].abi as Abi,
          functionName: "balanceOf",
          args: [account_address],
        },
        ...market.incentive_tokens_data.map((incentive) => {
          return {
            chainId: market.chain_id,
            address: market.market_id as Address,
            abi: ContractMap[market.chain_id as keyof typeof ContractMap][
              "WrappedVault"
            ].abi as Abi,
            functionName: "currentUserRewards",
            args: [incentive.contract_address, account_address],
          };
        }),
      ]
    : [];

  const contractsToRead = vaultContracts;

  const propsReadContracts = useReadContracts({
    // @ts-ignore
    contracts: contractsToRead,
  });

  if (!propsReadContracts.isLoading && propsReadContracts.data && !!market) {
    try {
      const input_token_data = getSupportedToken(market.input_token_id);

      let deposit_token_data: SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
      } = {
        ...input_token_data,
        raw_amount: "0",
        token_amount: 0,
        token_amount_usd: 0,
      };

      let incentive_token_data: Array<
        SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        }
      > = [];

      let curr_total_balance_usd = 0;

      for (let i = 0; i < propsReadContracts.data.length; i++) {
        const token_quote = propsTokenQuotes.data?.find(
          (token) => token.id === token_ids[i]
        );

        if (!!token_quote) {
          const result = propsReadContracts.data[i].result as BigNumber;

          const token_id = token_ids[i];

          const token_data = getSupportedToken(token_id);

          const raw_amount = result.toString();

          const token_amount = parseFloat(
            ethers.utils.formatUnits(raw_amount, token_data.decimals)
          );

          const token_amount_usd = token_amount * token_quote.price;

          curr_total_balance_usd += token_amount_usd;

          if (token_id === market.input_token_id) {
            deposit_token_data = {
              ...token_data,
              raw_amount,
              token_amount,
              token_amount_usd,
            };
          } else {
            incentive_token_data.push({
              ...token_data,
              raw_amount,
              token_amount,
              token_amount_usd,
            });
          }
        }
      }

      data = {
        deposit_token_data: deposit_token_data,
        incentive_token_data: incentive_token_data,
        total_balance_usd: curr_total_balance_usd,
      };
    } catch (error) {
      console.log("useReadMarket error", error);
    }
  }

  const isLoading = propsTokenQuotes.isLoading || propsReadContracts.isLoading;

  return {
    data,
    isLoading,
  };
};
