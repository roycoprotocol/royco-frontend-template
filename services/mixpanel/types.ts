// Event Names
// example:
export const MixpanelEvent = {
  ExploreMarketViewed: "explore_market_viewed",
  ExploreInputAssetChanged: "explore_input_asset_changed",
  ExploreChainChanged: "explore_chain_changed",
  ExploreIncentiveAssetChanged: "explore_incentive_asset_changed",
  ExploreVisiblePropertiesChanged: "explore_visible_properties_changed",
  ExploreSearchChanged: "explore_search_changed",
  ExploreMarketSortChanged: "explore_market_sort_changed",

  MarketViewed: "market_viewed",
  MarketAdvancedModeToggled: "market_advanced_mode_toggled",
  MarketUserTypeToggled: "market_user_type_toggled",
  MarketFromActionChanged: "market_from_action_changed",
  MarketOfferTypeChanged: "market_offer_type_changed",

  WalletConnected: "wallet_connected",
  WalletChainSwitched: "wallet_chain_switched",

  TransactionStarted: "transaction_started",
  TransactionSucceeded: "transaction_succeeded",
  TransactionFailed: "transaction_failed",
};

export type MixpanelEventName =
  (typeof MixpanelEvent)[keyof typeof MixpanelEvent];

// Event Properties Types
export interface BaseEvent {
  timestamp?: number;
  page_url?: string;
}

export interface ExploreMarketViewed extends BaseEvent {
  page_index: number;
}

export interface ExploreInputAssetChanged extends BaseEvent {
  input_assets: string[];
}

export interface ExploreChainChanged extends BaseEvent {
  chains: number[];
}

export interface ExploreIncentiveAssetChanged extends BaseEvent {
  incentive_assets: string[];
}

export interface ExploreVisiblePropertiesChanged extends BaseEvent {
  visible_properties: string[];
}

export interface ExploreSearchChanged extends BaseEvent {
  search_query: string;
}

export interface ExploreMarketSortChanged extends BaseEvent {
  sort_id: string;
  order: "asc" | "desc";
}

export interface MarketViewed extends BaseEvent {
  market_id: string;
  market_type: string;
  chain_id: number;
}

export interface MarketAdvancedModeToggled extends BaseEvent {
  advanced_mode: boolean;
}

export interface MarketUserTypeToggled extends BaseEvent {
  user_type: string;
}

export interface MarketFromActionChanged extends BaseEvent {
  from_action: string;
}

export interface MarketOfferTypeChanged extends BaseEvent {
  offer_type: string;
}

export interface WalletConnected extends BaseEvent {
  address?: string;
  chain_id?: number;
}

export interface TransactionStarted extends BaseEvent {
  function_name: string;
  address?: string;
  chain_id?: number;
  success: boolean;
  error?: string;
  transaction_hash?: string;
}

export interface CustomEvent extends BaseEvent {
  [key: string]: any;
}

export type MixpanelEventProperties =
  | MarketViewed
  | MarketAdvancedModeToggled
  | WalletConnected
  | TransactionStarted
  | CustomEvent;

// User Profile
export interface UserProfile {
  [key: string]: any;
}
