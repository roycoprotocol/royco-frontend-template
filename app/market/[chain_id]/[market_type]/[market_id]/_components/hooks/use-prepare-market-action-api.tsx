import { useQuery } from "@tanstack/react-query";
import {
  RoycoMarketOfferType,
  RoycoMarketType,
  RoycoMarketUserType,
  TypedRoycoMarketType,
  TypedRoycoMarketUserType,
} from "royco/market";
import { TypedRoycoMarketOfferType } from "royco/market";
import { TypedRoycoMarketVaultIncentiveAction } from "royco/market";
import { api } from "@/app/api/royco";
import { useAtomValue } from "jotai";
import { enrichedMarketIdAtom } from "@/store/market";
import { accountAddressAtom, lastRefreshTimestampAtom } from "@/store/global";
import { CustomTokenDataElement } from "royco/api";

export const PrepareMarketActionType = {
  RecipeAPMarketOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.market.id}`,
  RecipeIPMarketOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.market.id}`,

  RecipeAPLimitOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.limit.id}`,
  RecipeIPLimitOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.limit.id}`,

  VaultAPMarketOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.market.id}`,
  VaultIPMarketOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.market.id}`,

  VaultAPLimitOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.limit.id}`,
  VaultIPLimitOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.limit.id}`,
} as const;

export const usePrepareMarketActionApi = ({
  market_type,
  user_type,
  offer_type,
  quantity,
  funding_vault,
  token_ids,
  token_amounts,
  token_rates,
  expiry,
  start_timestamps,
  end_timestamps,
  customTokenData,
  vault_incentive_action,
  incentive_asset_ids,
}: {
  market_type: TypedRoycoMarketType;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;
  quantity: string | undefined;
  funding_vault: string | undefined;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  token_rates: string[] | undefined;
  expiry: string | undefined;
  start_timestamps: string[] | undefined;
  end_timestamps: string[] | undefined;
  customTokenData?: CustomTokenDataElement[];
  vault_incentive_action?: TypedRoycoMarketVaultIncentiveAction;
  incentive_asset_ids?: string[];
}) => {
  const action_type = `${market_type}-${user_type}-${offer_type}`;

  const enrichedMarketId = useAtomValue(enrichedMarketIdAtom);
  const accountAddress = useAtomValue(accountAddressAtom);

  const lastRefreshTimestamp = useAtomValue(lastRefreshTimestampAtom);

  return useQuery({
    queryKey: [
      action_type,
      {
        enrichedMarketId,
        quantity,
        accountAddress,
        tokenIds: token_ids,
        tokenAmounts: token_amounts,
        expiry,
        startTimestamps: start_timestamps,
        endTimestamps: end_timestamps,
        customTokenData,
        vaultIncentiveAction: vault_incentive_action,
        lastRefreshTimestamp,
      },
    ],
    queryFn: async () => {
      if (action_type === PrepareMarketActionType.RecipeIPLimitOffer) {
        const response = await api.actionControllerRecipeIpLimitAction({
          // @ts-ignore
          id: enrichedMarketId,
          accountAddress,
          // @ts-ignore
          quantity,
          // @ts-ignore
          tokenIds: token_ids,
          // @ts-ignore
          tokenAmounts: token_amounts,
          expiry,
          customTokenData,
        });

        return response.data;
      } else if (action_type === PrepareMarketActionType.RecipeAPLimitOffer) {
        const response = await api.actionControllerRecipeApLimitAction({
          // @ts-ignore
          id: enrichedMarketId,
          accountAddress,
          fundingVault: funding_vault,
          // @ts-ignore
          quantity,
          // @ts-ignore
          tokenIds: token_ids,
          // @ts-ignore
          tokenAmounts: token_amounts,
          expiry,
          customTokenData,
        });

        return response.data;
      } else if (action_type === PrepareMarketActionType.RecipeAPMarketOffer) {
        const response = await api.actionControllerRecipeApMarketAction({
          // @ts-ignore
          id: enrichedMarketId,
          accountAddress,
          fundingVault: funding_vault,
          // @ts-ignore
          quantity,
          customTokenData,
        });

        return response.data;
      } else if (action_type === PrepareMarketActionType.RecipeIPMarketOffer) {
        const response = await api.actionControllerRecipeIpMarketAction({
          // @ts-ignore
          id: enrichedMarketId,
          accountAddress,
          // @ts-ignore
          quantity,
          customTokenData,
        });

        return response.data;
      } else {
        throw new Error("Action not supported.");
      }
    },
    enabled: Boolean(enrichedMarketId),
  });
};
