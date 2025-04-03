/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  BaseRequestBody,
  InfoMarketBody,
  RecipePositionResponse,
  RewardsRequest,
  RewardsResponse,
  TokenQuoteBody,
  TokenQuoteResponse,
  VaultInfoRequestBody,
  VaultInfoResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Health
   * @name HealthControllerCheck
   * @request GET:/api/health
   * @secure
   */
  healthControllerCheck = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example "ok" */
        status?: string;
        /** @example {"database":{"status":"up"}} */
        info?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
        /** @example {} */
        error?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
        /** @example {"database":{"status":"up"}} */
        details?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
      },
      {
        /** @example "error" */
        status?: string;
        /** @example {"database":{"status":"up"}} */
        info?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
        /** @example {"redis":{"status":"down","message":"Could not connect"}} */
        error?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
        /** @example {"database":{"status":"up"},"redis":{"status":"down","message":"Could not connect"}} */
        details?: Record<
          string,
          {
            status: string;
            [key: string]: any;
          }
        >;
      }
    >({
      path: `/api/health`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get token quote for a given token based on the chain id and contract address
   *
   * @tags Token
   * @name TokenControllerGetTokenQuote
   * @summary Get token quote
   * @request POST:/api/v1/token/quote/{chainId}/{contractAddress}
   * @secure
   */
  tokenControllerGetTokenQuote = (
    chainId: number,
    contractAddress: string,
    data: TokenQuoteBody,
    params: RequestParams = {}
  ) =>
    this.request<TokenQuoteResponse, any>({
      path: `/api/v1/token/quote/${chainId}/${contractAddress}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Addons
   * @name AddonsControllerGetIncentives
   * @request GET:/api/v1/addons/test/{id}
   */
  addonsControllerGetIncentives = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/addons/test/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Addons
   * @name AddonsControllerRefreshIncentives
   * @request GET:/api/v1/addons/refresh/{id}
   */
  addonsControllerRefreshIncentives = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/addons/refresh/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Market
   * @name MarketControllerGetMarket
   * @request POST:/api/v1/market/info/{id}
   */
  marketControllerGetMarket = (id: string, data: InfoMarketBody, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/market/info/${id}`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Market
   * @name MarketControllerGetMarkets
   * @request POST:/api/v1/market/explore
   */
  marketControllerGetMarkets = (data: BaseRequestBody, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/market/explore`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get info for a vault
   *
   * @tags Vault
   * @name VaultControllerGetVaultInfo
   * @summary Get vault info
   * @request POST:/api/v1/vault/info/{id}
   * @secure
   */
  vaultControllerGetVaultInfo = (id: string, data?: VaultInfoRequestBody, params: RequestParams = {}) =>
    this.request<VaultInfoResponse, any>({
      path: `/api/v1/vault/info/${id}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get positions for all recipe markets
   *
   * @tags Position
   * @name PositionControllerGetRecipePositions
   * @summary Get recipe positions
   * @request POST:/api/v1/position/recipe
   * @secure
   */
  positionControllerGetRecipePositions = (data?: BaseRequestBody, params: RequestParams = {}) =>
    this.request<RecipePositionResponse, any>({
      path: `/api/v1/position/recipe`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Position
   * @name PositionControllerGetVaultPositions
   * @request POST:/api/v1/position/vault
   * @secure
   */
  positionControllerGetVaultPositions = (data: BaseRequestBody, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/position/vault`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Position
   * @name PositionControllerGetBoringPositions
   * @request POST:/api/v1/position/boring
   * @secure
   */
  positionControllerGetBoringPositions = (data: BaseRequestBody, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/position/boring`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get paginated rewards with filters and sorting. Requires accountAddress filter. Supports additional filtering by chainId, vaultAddress, and blockTimestamp. Supports sorting by any of these fields.
   *
   * @tags Rewards
   * @name RewardsControllerGetRewards
   * @summary Get rewards
   * @request POST:/api/v1/rewards
   */
  rewardsControllerGetRewards = (data: RewardsRequest, params: RequestParams = {}) =>
    this.request<RewardsResponse, void>({
      path: `/api/v1/rewards`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
