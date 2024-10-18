import { useQuery } from "@tanstack/react-query";
import { getAccountBalanceQueryOptions } from "@/sdk/queries";
import { formatUnits, type Address } from "viem";
import {
  type SupportedTokenInfo,
  useSupportedTokensInfo,
} from "./use-supported-tokens-info";
import { BigNumber } from "ethers";
import { useTokenQuotes } from "./use-token-quotes";
import { getSupportedToken } from "../constants";

export type AccountBalance = SupportedTokenInfo & {
  raw_amount: String;
  token_amount: number;
  token_amount_usd: number;
};

export const useAccountBalance = ({
  chain_id,
  account,
  tokens,
}: {
  chain_id: number;
  account: string;
  tokens: string[];
}) => {
  let data = null;

  const token_ids = tokens.map((token) => `${chain_id}-${token.toLowerCase()}`);

  const propsAccountInfo = useQuery(
    getAccountBalanceQueryOptions(chain_id, account, tokens)
  );

  const propsTokenQuotes = useTokenQuotes({ token_ids });

  const isLoading = propsAccountInfo.isLoading || propsTokenQuotes.isLoading;
  const isError = propsAccountInfo.isError || propsTokenQuotes.isError;
  const isRefetching =
    propsAccountInfo.isRefetching || propsTokenQuotes.isRefetching;

  if (
    !(propsAccountInfo.data instanceof Error) &&
    !(propsTokenQuotes.data instanceof Error) &&
    !!propsTokenQuotes.data &&
    propsTokenQuotes.data !== null &&
    !!propsAccountInfo.data
  ) {
    data = propsAccountInfo.data.map((res, index) => {
      let token_data = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.token_id === token_ids[index]
      );

      if (!token_data) {
        token_data = {
          ...getSupportedToken(token_ids[index]),
          token_id: token_ids[index],
          price: 0,
          total_supply: 0,
          fdv: 1,
        };
      }

      const raw_amount = res.result
        ? BigNumber.from(res.result).toString()
        : BigNumber.from(0).toString();
      const token_amount = parseFloat(
        BigNumber.from(raw_amount)
          .div(BigNumber.from(10).pow(token_data.decimals))
          .toString()
      );

      const token_amount_usd = token_amount * token_data.price;

      return {
        ...token_data,
        raw_amount,
        token_amount,
        token_amount_usd,
      } as AccountBalance;
    });
  }

  return {
    data,
    isLoading,
    isRefetching,
    isError,
  };
};
