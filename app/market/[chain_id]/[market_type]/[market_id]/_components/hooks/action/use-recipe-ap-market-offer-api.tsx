import { api } from "@/app/api/royco";
import { useQuery } from "@tanstack/react-query";
import { enrichTxOptions } from "royco/transaction";
import { TypedMarketActionInputTokenData } from "./types";

export const useRecipeAPMarketOffer = ({
  accountAddress,
  enrichedMarketId,
  quantity,
  fundingVault,
  enabled,
}: {
  accountAddress: string | undefined;
  enrichedMarketId: string | undefined;
  quantity: string | undefined;
  fundingVault: string | undefined;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [
      "recipe-ap-market-offer",
      {
        enrichedMarketId,
        quantity,
        accountAddress,
        fundingVault,
      },
    ],
    queryFn: async () => {
      if (!enrichedMarketId || !quantity) {
        throw new Error("Required inputs are missing");
      }

      const body = {
        id: enrichedMarketId,
        quantity,
        accountAddress,
        fundingVault,
      };

      const response = await api.actionControllerRecipeApMarketAction(body);

      return response.data;
    },
    enabled: Boolean(enrichedMarketId && quantity && accountAddress),
  });

  const isValid = {
    status: isError ? false : true,
    message: isError ? error?.message : "Valid",
  };

  const canBePerformedCompletely = data?.fillStatus === "full" ? true : false;
  const canBePerformedPartially =
    data?.fillStatus === "partial" || data?.fillStatus === "full"
      ? true
      : false;

  const inputTokenData: TypedMarketActionInputTokenData | undefined =
    data?.inputToken
      ? {
          ...data.inputToken,
          chain_id: data.inputToken.chainId,
          contract_address: data.inputToken.contractAddress,
          search_id: data.inputToken.id,
          raw_amount: data.inputToken.rawAmount,
          token_amount: data.inputToken.tokenAmount,
          token_amount_usd: data.inputToken.tokenAmountUsd,
          total_supply: data.inputToken.totalSupply,
        }
      : undefined;

  return {
    isValid,
    isLoading,
    canBePerformedCompletely,
    canBePerformedPartially,
    inputTokenData,
  };
};
