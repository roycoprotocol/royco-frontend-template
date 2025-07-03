import mixpanel from "mixpanel-browser";
import {
  MixpanelEventName,
  MixpanelEventProperties,
  MixpanelEvent,
  MarketViewed,
  WalletConnected,
  TransactionStarted,
  CustomEvent,
  UserProfile,
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

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

class Mixpanel {
  private static instance: Mixpanel;
  private initialized: boolean = false;

  public static getInstance(): Mixpanel {
    if (!Mixpanel.instance) {
      Mixpanel.instance = new Mixpanel();
    }
    return this.instance;
  }

  private constructor() {
    if (Mixpanel.instance) {
      console.warn("Error: mixpanel is a singleton.");
      return;
    }

    if (!MIXPANEL_TOKEN) {
      console.warn("Error: mixpanel token is missing.");
      return;
    }

    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        autocapture: true,
        debug: process.env.NODE_ENV === "development",
        record_sessions_percent: 1,
      });
      this.initialized = true;
    } catch (error) {
      console.warn("Error initializing mixpanel:", error);
    }
  }

  public track<T extends MixpanelEventProperties>(
    eventName: MixpanelEventName,
    properties?: T
  ): void {
    if (!this.initialized) return;

    if (!properties) {
      mixpanel.track(eventName);
      return;
    }
    mixpanel.track(eventName, sanitize(properties));
  }

  // Explore Market Events
  public exploreMarketViewed(properties: ExploreMarketViewed): void {
    this.track(MixpanelEvent.ExploreMarketViewed, properties);
  }

  public exploreInputAssetChanged(properties: ExploreInputAssetChanged): void {
    this.track(MixpanelEvent.ExploreInputAssetChanged, properties);
  }

  public exploreChainChanged(properties: ExploreChainChanged): void {
    this.track(MixpanelEvent.ExploreChainChanged, properties);
  }

  public exploreIncentiveAssetChanged(
    properties: ExploreIncentiveAssetChanged
  ): void {
    this.track(MixpanelEvent.ExploreIncentiveAssetChanged, properties);
  }

  public exploreVisiblePropertiesChanged(
    properties: ExploreVisiblePropertiesChanged
  ): void {
    this.track(MixpanelEvent.ExploreVisiblePropertiesChanged, properties);
  }

  public exploreSearchChanged(properties: ExploreSearchChanged): void {
    this.track(MixpanelEvent.ExploreSearchChanged, properties);
  }

  public exploreMarketSortChanged(properties: ExploreMarketSortChanged): void {
    this.track(MixpanelEvent.ExploreMarketSortChanged, properties);
  }

  // Market Events
  public marketViewed(properties: MarketViewed): void {
    this.track(MixpanelEvent.MarketViewed, properties);
  }

  public marketAdvancedModeToggled(
    properties: MarketAdvancedModeToggled
  ): void {
    this.track(MixpanelEvent.MarketAdvancedModeToggled, properties);
  }

  public marketUserTypeToggled(properties: MarketUserTypeToggled): void {
    this.track(MixpanelEvent.MarketUserTypeToggled, properties);
  }

  public marketFromActionChanged(properties: MarketFromActionChanged): void {
    this.track(MixpanelEvent.MarketFromActionChanged, properties);
  }

  public marketOfferTypeChanged(properties: MarketOfferTypeChanged): void {
    this.track(MixpanelEvent.MarketOfferTypeChanged, properties);
  }

  // Wallet Events
  public walletConnected(properties: WalletConnected): void {
    this.track(MixpanelEvent.WalletConnected, properties);
  }

  public walletChainSwitched(properties: WalletConnected): void {
    this.track(MixpanelEvent.WalletChainSwitched, properties);
  }

  // Transaction Events
  public transactionStarted(properties: TransactionStarted): void {
    this.track(MixpanelEvent.TransactionStarted, properties);
  }

  // public transactionSucceeded(properties: TransactionStarted): void {
  //   this.track(MixpanelEvent.TransactionSucceeded, properties);
  // }

  // public transactionFailed(properties: TransactionStarted): void {
  //   this.track(MixpanelEvent.TransactionFailed, properties);
  // }

  // Custom Events
  public customEvent(eventName: string, properties: CustomEvent): void {
    this.track(eventName, properties);
  }

  // User Events
  public identify(id: string): void {
    if (!this.initialized) return;
    mixpanel.identify(id);
  }

  public setUserProfile(properties: UserProfile): void {
    if (!this.initialized) return;
    mixpanel.people.set(properties);
  }

  public reset(): void {
    if (!this.initialized) return;
    mixpanel.reset();
  }
}

export function sanitize(properties: Record<string, any>): Record<string, any> {
  const sensitiveKeys = [
    "password",
    "private_key",
    "seed_phrase",
    "mnemonic",
    "token",
    "api_key",
  ];
  const sanitized = { ...properties };

  sensitiveKeys.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return {
    timestamp: Date.now(),
    page_url: typeof window !== "undefined" ? window.location.href : undefined,
    ...sanitized,
  };
}

export default Mixpanel;
