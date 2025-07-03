import { useCallback } from "react";
import Mixpanel from "./mixpanel";
import {
  MarketViewed,
  WalletConnected,
  TransactionStarted,
  MarketAdvancedModeToggled,
  MarketUserTypeToggled,
  MarketFromActionChanged,
  MarketOfferTypeChanged,
  ExploreMarketViewed,
  ExploreInputAssetChanged,
  ExploreChainChanged,
  ExploreIncentiveAssetChanged,
  ExploreVisiblePropertiesChanged,
  ExploreSearchChanged,
  ExploreMarketSortChanged,
} from "./types";

export function useMixpanel() {
  const mixpanel = Mixpanel.getInstance();

  // Explore Market Events
  const trackExploreMarketViewed = useCallback(
    (properties: ExploreMarketViewed) => {
      mixpanel.exploreMarketViewed(properties);
    },
    [mixpanel]
  );

  const trackExploreInputAssetChanged = useCallback(
    (properties: ExploreInputAssetChanged) => {
      mixpanel.exploreInputAssetChanged(properties);
    },
    [mixpanel]
  );

  const trackExploreChainChanged = useCallback(
    (properties: ExploreChainChanged) => {
      mixpanel.exploreChainChanged(properties);
    },
    [mixpanel]
  );

  const trackExploreIncentiveAssetChanged = useCallback(
    (properties: ExploreIncentiveAssetChanged) => {
      mixpanel.exploreIncentiveAssetChanged(properties);
    },
    [mixpanel]
  );

  const trackExploreVisiblePropertiesChanged = useCallback(
    (properties: ExploreVisiblePropertiesChanged) => {
      mixpanel.exploreVisiblePropertiesChanged(properties);
    },
    [mixpanel]
  );

  const trackExploreSearchChanged = useCallback(
    (properties: ExploreSearchChanged) => {
      mixpanel.exploreSearchChanged(properties);
    },
    [mixpanel]
  );

  const trackExploreMarketSortChanged = useCallback(
    (properties: ExploreMarketSortChanged) => {
      mixpanel.exploreMarketSortChanged(properties);
    },
    [mixpanel]
  );

  // Market Events
  const trackMarketViewed = useCallback(
    (properties: MarketViewed) => {
      mixpanel.marketViewed(properties);
    },
    [mixpanel]
  );

  const trackMarketAdvancedModeToggled = useCallback(
    (properties: MarketAdvancedModeToggled) => {
      mixpanel.marketAdvancedModeToggled(properties);
    },
    [mixpanel]
  );

  const trackMarketUserTypeToggled = useCallback(
    (properties: MarketUserTypeToggled) => {
      mixpanel.marketUserTypeToggled(properties);
    },
    [mixpanel]
  );

  const trackMarketFromActionChanged = useCallback(
    (properties: MarketFromActionChanged) => {
      mixpanel.marketFromActionChanged(properties);
    },
    [mixpanel]
  );

  const trackMarketOfferTypeChanged = useCallback(
    (properties: MarketOfferTypeChanged) => {
      mixpanel.marketOfferTypeChanged(properties);
    },
    [mixpanel]
  );

  // Wallet Events
  const trackWalletConnected = useCallback(
    (properties: WalletConnected) => {
      mixpanel.walletConnected(properties);
    },
    [mixpanel]
  );

  const trackWalletChainSwitched = useCallback(
    (properties: WalletConnected) => {
      mixpanel.walletChainSwitched(properties);
    },
    [mixpanel]
  );

  // Transaction Events
  const trackTransactionStarted = useCallback(
    (properties: TransactionStarted) => {
      mixpanel.transactionStarted(properties);
    },
    [mixpanel]
  );

  // const trackTransactionSucceeded = useCallback(
  //   (properties: TransactionStarted) => {
  //     mixpanel.transactionSucceeded(properties);
  //   },
  //   [mixpanel]
  // );

  // const trackTransactionFailed = useCallback(
  //   (properties: TransactionStarted) => {
  //     mixpanel.transactionFailed(properties);
  //   },
  //   [mixpanel]
  // );

  // Custom Events
  const trackCustomEvent = useCallback(
    (eventName: string, properties: Partial<CustomEvent> = {}) => {
      mixpanel.customEvent(eventName, properties);
    },
    [mixpanel]
  );

  // User identification
  const identify = useCallback(
    (distinctId: string) => {
      mixpanel.identify(distinctId);
    },
    [mixpanel]
  );

  const reset = useCallback(() => {
    mixpanel.reset();
  }, [mixpanel]);

  return {
    trackExploreMarketViewed,
    trackExploreInputAssetChanged,
    trackExploreChainChanged,
    trackExploreIncentiveAssetChanged,
    trackExploreVisiblePropertiesChanged,
    trackExploreSearchChanged,
    trackExploreMarketSortChanged,
    trackMarketViewed,
    trackMarketAdvancedModeToggled,
    trackMarketUserTypeToggled,
    trackMarketFromActionChanged,
    trackMarketOfferTypeChanged,
    trackWalletConnected,
    trackWalletChainSwitched,
    trackTransactionStarted,
    trackCustomEvent,
    identify,
    reset,
  };
}
