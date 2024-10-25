import { create } from "zustand";
import {
  RoycoMarketActionType,
  RoycoMarketIncentiveType,
  RoycoMarketOfferType,
  RoycoMarketRewardStyle,
  RoycoMarketRewardStyleRecordType,
  RoycoMarketScriptType,
  RoycoMarketType,
  RoycoMarketUserType,
  RoycoTransactionType,
  TypedRoycoMarketActionType,
  TypedRoycoMarketIncentiveType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoMarketScriptType,
  TypedRoycoMarketUserType,
} from "@/sdk/market";
import { ScrollTextIcon, VaultIcon } from "lucide-react";

/**
 * @info Market View Type
 */
export type TypedMarketViewType = "simple" | "advanced" | "overview";
export const MarketViewType: Record<
  TypedMarketViewType,
  { id: TypedMarketViewType }
> = {
  simple: {
    id: "simple",
  },
  advanced: {
    id: "advanced",
  },
  overview: {
    id: "overview",
  },
};

/**
 * @info Market Type
 */
export const MarketType = {
  [RoycoMarketType.recipe.id]: {
    ...RoycoMarketType.recipe,
    label: "Recipe",
    tag: "",
    description:
      'Offer incentives to perform any onchain transaction or series of transactions-aka a "recipe."',
    icon: ScrollTextIcon,
  },
  [RoycoMarketType.vault.id]: {
    ...RoycoMarketType.vault,
    label: "Vault",
    tag: "",
    description:
      "Offer incentives to deposit into an underlying ERC4626 Vault.",
    icon: VaultIcon,
  },
};

/**
 * @info Market Action Type
 */
export const MarketActionType = {
  [RoycoMarketActionType.supply.id]: {
    ...RoycoMarketActionType.supply,
    label: "Supply",
  },
  [RoycoMarketActionType.withdraw.id]: {
    ...RoycoMarketActionType.withdraw,
    label: "Withdraw",
  },
};

/**
 * @info Market User Type
 */
export const MarketUserType = {
  [RoycoMarketUserType.ap.id]: {
    ...RoycoMarketUserType.ap,
    label: "AP",
  },
  [RoycoMarketUserType.ip.id]: {
    ...RoycoMarketUserType.ip,
    label: "IP",
  },
};

/**
 * @info Market Offer Type
 */
export const MarketOfferType = {
  [RoycoMarketOfferType.market.id]: {
    ...RoycoMarketOfferType.market,
    label: "Market Offer",
  },
  [RoycoMarketOfferType.limit.id]: {
    ...RoycoMarketOfferType.limit,
    label: "Limit Offer",
  },
};

/**
 * @info Market Incentive Type
 */
export const MarketIncentiveType = {
  [RoycoMarketIncentiveType.ap.id]: {
    ...RoycoMarketIncentiveType.ap,
    label: "Asked",
  },
  [RoycoMarketIncentiveType.ip.id]: {
    ...RoycoMarketIncentiveType.ip,
    label: "Offered",
  },
};

/**
 * @info Market Script Type
 */
export const MarketScriptType = {
  [RoycoMarketScriptType.enter_actions.id]: {
    ...RoycoMarketScriptType.enter_actions,
    label: "Enter Market",
  },
  [RoycoMarketScriptType.exit_actions.id]: {
    ...RoycoMarketScriptType.exit_actions,
    label: "Exit Market",
  },
};

export const MarketTransactionType = {
  [RoycoTransactionType.approve_tokens.id]: {
    ...RoycoTransactionType.approve_tokens,
    title: "Approve Tokens for Offer",
    label: "Approve Tokens",
  },
  [RoycoTransactionType.fill_ip_offers.id]: {
    ...RoycoTransactionType.fill_ip_offers,
    title: "Fill IP Offers",
    label: "Fill Offers",
  },
  [RoycoTransactionType.fill_ap_offers.id]: {
    ...RoycoTransactionType.fill_ap_offers,
    title: "Fill AP Offers",
    label: "Fill Offers",
  },
  [RoycoTransactionType.create_ap_offer.id]: {
    ...RoycoTransactionType.create_ap_offer,
    title: "Create AP Offer",
    label: "Create Offer",
  },
  [RoycoTransactionType.create_ip_offer.id]: {
    ...RoycoTransactionType.create_ip_offer,
    title: "Create IP Offer",
    label: "Create Offer",
  },
};

export const MarketRewardStyle: Record<
  TypedRoycoMarketRewardStyle,
  RoycoMarketRewardStyleRecordType & {
    label: string;
    tag: string;
    description: string;
  }
> = {
  upfront: {
    ...RoycoMarketRewardStyle.upfront,
    label: "Upfront",
    tag: "$10/month",
    description:
      "Includes up to 10 users, 20GB individual data and access to all features.",
  },
  arrear: {
    ...RoycoMarketRewardStyle.arrear,
    label: "Arrear",
    tag: "$10/month",
    description:
      "Includes up to 10 users, 20GB individual data and access to all features.",
  },
  forfeitable: {
    ...RoycoMarketRewardStyle.forfeitable,
    label: "Forfeitable",
    tag: "$10/month",
    description:
      "Includes up to 10 users, 20GB individual data and access to all features.",
  },
};

export type TypedMarketStep = "params" | "preview" | "transaction";

export const MarketSteps: Record<
  TypedMarketStep,
  {
    id: TypedMarketStep;
    label: string;
    description: string;
  }
> = {
  params: {
    id: "params",
    label: "TRANSACT",
    description: "Select the market you want to trade.",
  },
  preview: {
    id: "preview",
    label: "PREVIEW",
    description: "Select the action you want to perform.",
  },
  transaction: {
    id: "transaction",
    label: "Transaction",
    description: "Review and confirm your transaction.",
  },
};

export type MarketStatsViewType = "positions" | "offers";
export const MarketStatsView: Record<
  MarketStatsViewType,
  {
    id: MarketStatsViewType;
  }
> = {
  positions: {
    id: "positions",
  },
  offers: {
    id: "offers",
  },
};

export type TypedMarketWithdrawType = "input_token" | "incentives";
export const MarketWithdrawType: Record<
  TypedMarketWithdrawType,
  {
    id: TypedMarketWithdrawType;
    label: string;
  }
> = {
  input_token: {
    id: "input_token",
    label: "Input Token",
  },
  incentives: {
    id: "incentives",
    label: "Incentives",
  },
};

/**
 * @info Market Manager State
 */
export type MarketManagerState = {
  viewType: TypedMarketViewType;
  setViewType: (viewType: TypedMarketViewType) => void;

  actionType: TypedRoycoMarketActionType;
  setActionType: (actionType: TypedRoycoMarketActionType) => void;

  userType: TypedRoycoMarketUserType;
  setUserType: (userType: TypedRoycoMarketUserType) => void;

  intentType: TypedRoycoMarketOfferType;
  setIntentType: (intentType: TypedRoycoMarketOfferType) => void;

  incentiveType: TypedRoycoMarketIncentiveType;
  setIncentiveType: (incentiveType: TypedRoycoMarketIncentiveType) => void;

  scriptType: TypedRoycoMarketScriptType;
  setScriptType: (scriptType: TypedRoycoMarketScriptType) => void;

  marketStep: TypedMarketStep;
  setMarketStep: (marketStep: TypedMarketStep) => void;

  transactions: any[];
  setTransactions: (transactions: any[]) => void;

  balanceIncentiveType: TypedRoycoMarketIncentiveType;
  setBalanceIncentiveType: (
    balanceIncentiveType: TypedRoycoMarketIncentiveType
  ) => void;

  statsView: MarketStatsViewType;
  setStatsView: (statsView: MarketStatsViewType) => void;

  offerTablePage: number;
  setOfferTablePage: (offerTablePage: number) => void;

  positionsRecipeTablePage: number;
  setPositionsRecipeTablePage: (positionsRecipeTablePage: number) => void;

  withdrawType: TypedMarketWithdrawType;
  setWithdrawType: (withdrawType: TypedMarketWithdrawType) => void;

  withdrawSectionPage: number;
  setWithdrawSectionPage: (withdrawSectionPage: number) => void;
};

export const createMarketManagerStore = () => {
  return create<MarketManagerState>((set) => ({
    viewType: MarketViewType.simple.id,
    // viewType: MarketViewType.advanced.id,
    setViewType: (viewType: TypedMarketViewType) => set({ viewType }),

    actionType: MarketActionType.supply.id,
    setActionType: (actionType: TypedRoycoMarketActionType) =>
      set({ actionType }),

    userType: MarketUserType.ap.id,
    setUserType: (userType: TypedRoycoMarketUserType) => set({ userType }),

    incentiveType: MarketIncentiveType.ap.id,
    setIncentiveType: (incentiveType: TypedRoycoMarketIncentiveType) =>
      set({ incentiveType }),

    intentType: MarketOfferType.market.id,
    setIntentType: (intentType: TypedRoycoMarketOfferType) =>
      set({ intentType }),

    scriptType: MarketScriptType.enter_actions.id,
    setScriptType: (scriptType: TypedRoycoMarketScriptType) =>
      set({ scriptType }),

    marketStep: MarketSteps.params.id,
    setMarketStep: (marketStep: TypedMarketStep) => set({ marketStep }),

    transactions: [],
    setTransactions: (transactions: any[]) => set({ transactions }),

    balanceIncentiveType: MarketIncentiveType.ap.id,
    setBalanceIncentiveType: (
      balanceIncentiveType: TypedRoycoMarketIncentiveType
    ) => set({ balanceIncentiveType }),

    statsView: MarketStatsView.offers.id,
    setStatsView: (statsView: MarketStatsViewType) => set({ statsView }),

    offerTablePage: 0,
    setOfferTablePage: (offerTablePage: number) => set({ offerTablePage }),

    positionsRecipeTablePage: 0,
    setPositionsRecipeTablePage: (positionsRecipeTablePage: number) =>
      set({ positionsRecipeTablePage }),

    withdrawType: MarketWithdrawType.input_token.id,
    setWithdrawType: (withdrawType: TypedMarketWithdrawType) =>
      set({ withdrawType }),

    withdrawSectionPage: 0,
    setWithdrawSectionPage: (withdrawSectionPage: number) =>
      set({ withdrawSectionPage }),
  }));
};

export type MarketManagerStoreApi = ReturnType<typeof createMarketManagerStore>;
