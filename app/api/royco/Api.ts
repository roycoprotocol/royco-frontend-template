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
  BoringPositionResponse,
  InfoMarketBody,
  RecipePositionResponse,
  SpecificBoringPositionRequest,
  SpecificBoringPositionResponse,
  TokenQuoteRequestBody,
  TokenQuoteResponse,
  VaultInfoRequestBody,
  VaultInfoResponse,
  VaultPositionResponse,
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
    data?: TokenQuoteRequestBody,
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
   * @description Get positions for all recipe markets. Use filters property in body to filter out by market id, chain id, etc. Since response is paginated, use pagination properties in body to get next page based on size property of page. Do note: max page size for response is 500.
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
   * @description Get positions for all vaults. Use filters property in body to filter out by vault id, chain id, etc. Since response is paginated, use pagination properties in body to get next page based on size property of page. Do note: max page size for response is 500.
   *
   * @tags Position
   * @name PositionControllerGetVaultPositions
   * @summary Get vault positions
   * @request POST:/api/v1/position/vault
   * @secure
   */
  positionControllerGetVaultPositions = (data?: BaseRequestBody, params: RequestParams = {}) =>
    this.request<VaultPositionResponse, any>({
      path: `/api/v1/position/vault`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get positions for all boring markets. Use filters property in body to filter out by vault id, chain id, etc. Since response is paginated, use pagination properties in body to get next page based on size property of page. Do note: max page size for response is 500.
   *
   * @tags Position
   * @name PositionControllerGetBoringPositions
   * @summary Get boring positions
   * @request POST:/api/v1/position/boring
   * @secure
   */
  positionControllerGetBoringPositions = (data?: BaseRequestBody, params: RequestParams = {}) =>
    this.request<BoringPositionResponse, any>({
      path: `/api/v1/position/boring`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get positions of an account address inside a vault.
   *
   * @tags Position
   * @name PositionControllerGetSpecificBoringPosition
   * @summary Get boring position of an account address inside a vault
   * @request POST:/api/v1/position/boring/{id}/{accountAddress}
   * @secure
   */
  positionControllerGetSpecificBoringPosition = (
    id: string,
    accountAddress: string,
    data?: SpecificBoringPositionRequest,
    params: RequestParams = {}
  ) =>
    this.request<SpecificBoringPositionResponse, any>({
      path: `/api/v1/position/boring/${id}/${accountAddress}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
