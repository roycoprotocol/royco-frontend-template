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

export interface CustomTokenDataElement {
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price?: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv?: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply?: number;
}

export interface TokenQuoteRequestBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface TokenQuote {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
}

export interface TokenQuoteResponse {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
}

export interface Filter {
  /**
   * Filter ID
   * Column ID to apply the filter on
   * @example "chainId"
   */
  id: string;
  /**
   * Filter Value
   * Value to filter by
   * @example "146"
   */
  value: string | number | boolean | string[] | number[];
  /**
   * Filter Condition
   * Condition to apply the filter on -- if not provided, defaults to "eq"
   * @default "eq"
   * @example "gte"
   */
  condition?: string;
  /**
   * Filter Join
   * Join to union the filters on -- if not provided, defaults to "and"
   * @default "and"
   * @example "or"
   */
  join?: string;
}

export interface Sorting {
  /**
   * Sorting ID
   * Column ID to sort by
   * @example "tvlUsd"
   */
  id: string;
  /**
   * Sorting Order
   * Sorting order -- if not provided, defaults to "desc"
   * @default false
   * @example true
   */
  desc?: boolean;
}

export interface RequestPage {
  /**
   * Page Index
   * Page index
   * @example 1
   */
  index?: number;
  /**
   * Page Size
   * Page size
   * @example 3
   */
  size?: number;
}

export interface TokenDirectoryRequestBody {
  /**
   * Filters Array
   * Array of filter objects to apply to the results
   * @example [{"id":"chainId","value":1},{"id":"tvlUsd","value":1000000,"condition":"gte"}]
   */
  filters?: Filter[];
  /**
   * Sorting Object
   * Object type to sort results with
   * @example {"id":"tvlUsd","desc":true}
   */
  sorting?: Sorting[];
  /**
   * Request Page Object
   * Object type to request a page of results
   * @default {"index":1,"size":10}
   * @example {"index":1,"size":3}
   */
  page?: RequestPage;
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export type TokenDirectoryResponse = object;

export interface InfoMarketBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface BaseEnrichedTokenData {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
}

export interface MarketActiveIncentiveDetailed {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
  /**
   * Remaining Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  remainingRawAmount: string;
  /**
   * Remaining Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  remainingTokenAmount: number;
  /**
   * Remaining Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  remainingTokenAmountUsd: number;
  /**
   * Per Input Token
   * The ratio of incentive token to input token
   */
  perInputToken: number;
  /**
   * Annual Token Rate
   * The annual rate of the incentive token
   */
  annualTokenRate: number;
  /**
   * Incentive Start Timestamp
   * The start timestamp for the incentive token. Note: this is only applicable to vault markets.
   */
  startTimestamp?: string;
  /**
   * Incentive End Timestamp
   * The end timestamp for the incentive token. Note: this is only applicable to vault markets.
   */
  endTimestamp?: string;
}

export interface MarketUnderlyingIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Incentive Label
   * The custom label for the incentive token
   */
  label?: string;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
}

export interface MarketNativeIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Incentive Label
   * The custom label for the incentive token
   */
  label?: string;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
}

export interface MarketExternalIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Incentive Label
   * The custom label for the incentive token
   */
  label?: string;
  /**
   * Yield Text
   * Yield rate in string format to represent any arbitrary yields
   */
  yieldText: string;
}

export interface MarketRecipeData {
  /**
   * Recipe Commands Array
   * The weiroll commands for the recipe
   */
  commands: string[];
  /**
   * Recipe State Array
   * The weiroll state for the recipe
   */
  state: string[];
}

export interface MarketRecipeMetadata {
  /**
   * Deposit Recipe
   * The deposit recipe for the market
   */
  depositRecipe: MarketRecipeData;
  /**
   * Withdraw Recipe
   * The withdraw recipe for the market
   */
  withdrawRecipe: MarketRecipeData;
}

export interface MarketVaultMetadata {
  /**
   * Base Incentives
   * The base incentives for the market. Note: this is only applicable to vault markets.
   */
  baseIncentives: any[][];
}

export type MarketMetadata = object;

export interface InfoMarketResponse {
  /**
   * ID
   * The global unique identifier of the market: chainId_marketType_marketId
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Name
   * The name of the market
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  name: string;
  /**
   * Description
   * Swap USDC for GHO on Balancer V2, receiving a minimum of .999 GHO per USDC, then stake the GHO for stkGHO and lock for 1 month.
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  description: string;
  /**
   * Category
   * The category of the market
   * @example "default"
   */
  category: string;
  /**
   * Underlying Vault Address
   * The address of the underlying vault -- only vault markets have an underlying vault, while recipe markets don't
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  underlyingVaultAddress?: string;
  /**
   * Lockup Time
   * The lockup time for the market in seconds. Note: vault markets always have a lockup time of "0"
   * @example "31536000"
   */
  lockupTime: string;
  /**
   * Frontend Fee
   * The frontend fee for the market in basis points in wei: 10^18 = 100%
   * @example "10000000000000000"
   */
  frontendFee: string;
  /**
   * Reward Style
   * The reward distribution style for the market: 0 = Upfront, 1 = Arrear, 2 = Forfeitable
   * @example 0
   */
  rewardStyle: 0 | 1 | 2;
  /**
   * TVL USD
   * The total value locked in the market in USD
   * @example 1456234.98
   */
  tvlUsd: number;
  /**
   * Fillable USD
   * The fillable USD for the market
   * @example 1456234.98
   */
  fillableUsd: number;
  /**
   * Capacity Ratio
   * The remaining capacity ratio for the market
   * @example 0.5
   */
  capacityRatio: number;
  /**
   * Incentives USD
   * The total value of incentives in the market in USD
   * @example 15689.23
   */
  incentivesUsd: number;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
  /**
   * Input Token ID
   * The ID of the input token for the market
   */
  inputTokenId: string;
  /**
   * Incentive Token IDs
   * The IDs of the incentive tokens for the market
   */
  incentiveTokenIds: string[];
  /**
   * Input Token Data
   * Token data for the market input token
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Incentive Tokens
   * Incentive tokens
   */
  incentiveTokens: TokenQuote[];
  /**
   * Active Incentives
   * Active incentive tokens
   */
  activeIncentives: MarketActiveIncentiveDetailed[];
  /**
   * Underlying Incentives
   * Underlying incentive tokens
   */
  underlyingIncentives?: MarketUnderlyingIncentive[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives?: MarketNativeIncentive[];
  /**
   * External Incentives
   * External incentive tokens
   */
  externalIncentives?: MarketExternalIncentive[];
  /**
   * Recipe Metadata
   * The metadata for the recipe
   */
  recipeMetadata?: MarketRecipeMetadata;
  /**
   * Vault Metadata
   * The metadata for the vault
   */
  vaultMetadata?: MarketVaultMetadata;
  /**
   * Market Metadata
   * The metadata for the market
   */
  marketMetadata?: MarketMetadata;
  /**
   * Is Verified
   * Whether the market is verified
   */
  isVerified: boolean;
  /**
   * Is Active
   * Whether the market is active
   */
  isActive: boolean;
  /**
   * Block Number
   * Block number associated with the entity
   * @example "21910786"
   */
  blockNumber: string;
  /**
   * Block Timestamp
   * Block timestamp associated with the entity
   * @example "1743357424"
   */
  blockTimestamp: string;
  /**
   * Transaction Hash
   * Transaction hash associated with the entity
   * @example "0xbd48c4956ca72ebca29e517f556676170f78914b786518854c3c57be933af461"
   */
  transactionHash: string;
  /**
   * Log Index
   * Log index associated with the entity
   * @example "12"
   */
  logIndex: string;
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
}

export interface ExploreMarketBody {
  /**
   * Filters Array
   * Array of filter objects to apply to the results
   * @example [{"id":"chainId","value":1},{"id":"tvlUsd","value":1000000,"condition":"gte"}]
   */
  filters?: Filter[];
  /**
   * Sorting Object
   * Object type to sort results with
   * @example {"id":"tvlUsd","desc":true}
   */
  sorting?: Sorting[];
  /**
   * Request Page Object
   * Object type to request a page of results
   * @default {"index":1,"size":10}
   * @example {"index":1,"size":3}
   */
  page?: RequestPage;
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface ExploreMarketResponseDataElement {
  /**
   * ID
   * The global unique identifier of the market: chainId_marketType_marketId
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  id: string;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
}

export interface ExploreMarketResponse {
  /** data */
  data: ExploreMarketResponseDataElement[];
}

export interface ExploreSettingsMarketBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export type ExploreSettingsMarketResponse = object;

export interface CreateMarketBody {
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Name
   * The name of the market
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  name: string;
  /**
   * Description
   * Swap USDC for GHO on Balancer V2, receiving a minimum of .999 GHO per USDC, then stake the GHO for stkGHO and lock for 1 month.
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  description: string;
  /**
   * Transaction Hash
   * Transaction hash associated with the entity
   * @example "0xbd48c4956ca72ebca29e517f556676170f78914b786518854c3c57be933af461"
   */
  transactionHash: string;
}

export interface CreateMarketResponse {
  /**
   * Status
   * The status of the created market
   * @example true
   */
  status: boolean;
  /**
   * Message
   * The message for the created market
   * @example "success"
   */
  message: string;
}

export interface VaultInfoRequestBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface VaultCapacity {
  /**
   * Currently filled capacity in USD
   * The maximum amount of USD that can be filled in the vault
   * @example 20000000
   */
  currentUsd: number;
  /**
   * Ratio of capacity filled
   * The ratio of capacity filled in the vault
   * @example 0.5
   */
  ratio: number;
}

export interface VaultManager {
  /**
   * Manager ID
   * The ID of the manager
   * @example "veda"
   */
  id: string;
  /**
   * Manager Name
   * The name of the manager
   * @example "VEDA"
   */
  name: string;
  /**
   * Manager Symbol
   * The symbol of the manager
   * @example "VEDA"
   */
  symbol: string;
  /**
   * Manager Image
   * The image of the manager
   * @example "https://pbs.twimg.com/profile_images/1790405638847135744/mx3dr412_400x400.png"
   */
  image?: string;
  /**
   * Manager Link
   * The link of the manager
   * @example "https://veda.tech/"
   */
  link?: string;
}

export interface VaultDepositToken {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
}

export interface VaultIncentiveToken {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Category
   * The category of the reward token
   * @example "active"
   */
  category: "active" | "native" | "external";
  /**
   * Label
   * The label of the reward token
   * @example "Staked GHO Points"
   */
  label?: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount?: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount?: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd?: number;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate?: number;
  /**
   * Yield Text
   * Yield rate in string format to represent any arbitrary yields
   */
  yieldText?: string;
  /**
   * Scale Ratio
   * The ratio to scale by for the incentive token to get user's rate
   */
  scaleRatio: number;
  /**
   * Unlock Timestamp
   * The timestamp when the incentive token is unlocked
   */
  unlockTimestamp: string;
}

export interface VaultAllocationDepositToken {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Allocation Ratio
   * The ratio of the input token to TVL of the vault
   * @example 1
   */
  allocationRatio: number;
}

export interface VaultAllocation {
  /**
   * Allocation ID
   * The ID of the allocation
   * @example "1_0_0x9a117f13c7d5d2b4b18e444f72e6e77c010a1fd90cf21135be75669d66ad9428"
   */
  id: string;
  /**
   * Allocation Market Name
   * The name of the allocated market
   * @example "VEDA"
   */
  name: string;
  /**
   * Allocation Market Link
   * The link of the allocated market
   * @example "/market/1/0/0x9a117f13c7d5d2b4b18e444f72e6e77c010a1fd90cf21135be75669d66ad9428"
   */
  link?: string;
  /**
   * Input Token
   * The input token of the allocation
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  inputToken: VaultAllocationDepositToken;
  /**
   * Incentive Tokens
   * The incentive tokens of the allocation
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  incentiveTokens: VaultIncentiveToken[];
  /**
   * Unlock Timestamp
   * The timestamp when the allocation is unlocked
   * @example "1714531200"
   */
  unlockTimestamp?: string;
}

export interface VaultInfoResponse {
  /**
   * ID
   * The global unique identifier of the vault: chainId_vaultAddress
   * @example "146_0x45088fb2ffebfdcf4dff7b7201bfa4cd2077c30e"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Vault Address
   * The address of the vault
   * @example "0x45088fb2ffebfdcf4dff7b7201bfa4cd2077c30e"
   */
  vaultAddress: string;
  /**
   * Vault Name
   * Roy Sonic USDC
   * @example "Roy Sonic USDC"
   */
  name: string;
  /**
   * Vault Description
   * The description of the vault
   * @example "Deposit assets to earn highest yields."
   */
  description: string;
  /**
   * Chain IDs
   * The chain IDs of the vault
   * @example [1,146]
   */
  chainIds: number[];
  /**
   * Capacity
   * The capacity of the vault
   * @example {"currentUsd":1000000,"maxUsd":20000000,"ratio":0.5}
   */
  capacity: VaultCapacity;
  /**
   * Max Lockup
   * The max lockup of the vault
   * @example "2592000"
   */
  maxLockup: string;
  /**
   * Managers
   * The managers of the vault
   * @example [{"id":"veda","name":"VEDA","symbol":"VEDA","image":"https://pbs.twimg.com/profile_images/1790405638847135744/mx3dr412_400x400.png","link":"https://veda.tech/"}]
   */
  managers: VaultManager[];
  /**
   * Deposit Token IDs
   * The deposit token IDs of the vault
   * @example ["146-0x29219dd400f2bf60e5a23d13be72b486d4038894"]
   */
  depositTokenIds: string[];
  /**
   * Incentive Token IDs
   * The incentive token IDs of the vault
   * @example ["146-0x29219dd400f2bf60e5a23d13be72b486d4038894"]
   */
  incentiveTokenIds: string[];
  /**
   * Deposit Tokens
   * The deposit tokens of the vault
   */
  depositTokens: VaultDepositToken[];
  /**
   * Incentive Tokens
   * The incentive tokens of the vault
   */
  incentiveTokens: VaultIncentiveToken[];
  /**
   * Allocations
   * The allocations of the vault
   */
  allocations: VaultAllocation[];
  /**
   * Is Verified
   * Whether the vault is verified
   */
  isVerified: boolean;
  /**
   * TVL USD
   * The TVL of the vault in USD
   */
  tvlUsd: number;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
}

export interface BaseRequestBody {
  /**
   * Filters Array
   * Array of filter objects to apply to the results
   * @example [{"id":"chainId","value":1},{"id":"tvlUsd","value":1000000,"condition":"gte"}]
   */
  filters?: Filter[];
  /**
   * Sorting Object
   * Object type to sort results with
   * @example {"id":"tvlUsd","desc":true}
   */
  sorting?: Sorting[];
  /**
   * Request Page Object
   * Object type to request a page of results
   * @default {"index":1,"size":10}
   * @example {"index":1,"size":3}
   */
  page?: RequestPage;
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface ResponsePage {
  /**
   * Filters Array
   * Array of filter objects to apply to the results
   * @example [{"id":"chainId","value":1},{"id":"tvlUsd","value":1000000,"condition":"gte"}]
   */
  filters?: Filter[];
  /**
   * Sorting Object
   * Object type to sort results with
   * @example {"id":"tvlUsd","desc":true}
   */
  sorting?: Sorting[];
  /**
   * Request Page Object
   * Object type to request a page of results
   * @default {"index":1,"size":10}
   * @example {"index":1,"size":3}
   */
  page?: RequestPage;
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface BaseEnrichedTokenDataWithWithdrawStatus {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Is Withdrawn
   * Whether the token has been withdrawn
   */
  isWithdrawn: boolean;
}

export interface MarketActiveIncentiveWithClaimStatus {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
  /**
   * Is Claimed
   * Whether the incentive token has been claimed
   */
  isClaimed: boolean;
}

export interface RecipePosition {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_weirollWalletAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Weiroll Wallet Address
   * Address of the weiroll wallet for this position
   */
  weirollWallet: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Reward Style
   * The reward distribution style for the market: 0 = Upfront, 1 = Arrear, 2 = Forfeitable
   * @example 0
   */
  rewardStyle: 0 | 1 | 2;
  /**
   * Is Forfeited
   * Whether the position has been forfeited
   * @example false
   */
  isForfeited: boolean;
  /**
   * Unlock Timestamp
   * Block timestamp when the position will be unlocked
   */
  unlockTimestamp: string;
  /**
   * Block Number
   * Block number associated with the entity
   * @example "21910786"
   */
  blockNumber: string;
  /**
   * Block Timestamp
   * Block timestamp associated with the entity
   * @example "1743357424"
   */
  blockTimestamp: string;
  /**
   * Transaction Hash
   * Transaction hash associated with the entity
   * @example "0xbd48c4956ca72ebca29e517f556676170f78914b786518854c3c57be933af461"
   */
  transactionHash: string;
  /**
   * Log Index
   * Log index associated with the entity
   * @example "12"
   */
  logIndex: string;
  /**
   * Name
   * The name of the market
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  name: string;
  /**
   * Lockup Time
   * The lockup time for the market in seconds. Note: vault markets always have a lockup time of "0"
   * @example "31536000"
   */
  lockupTime: string;
  /**
   * Input Token
   * The input token for the position with withdraw status
   */
  inputToken: BaseEnrichedTokenDataWithWithdrawStatus;
  /**
   * Incentive Tokens
   * The incentive tokens for the position with claim status
   */
  incentiveTokens: MarketActiveIncentiveWithClaimStatus[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives?: MarketNativeIncentive[];
  /**
   * External Incentives
   * External incentive tokens
   */
  externalIncentives?: MarketExternalIncentive[];
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
}

export interface RecipePositionResponse {
  /**
   * Response Page Object
   * Object type to respond with a page of results
   * @example {"index":1,"size":3,"total":10}
   */
  page: ResponsePage;
  /**
   * Row Count
   * Total number of rows in the results
   * @example 234
   */
  count: number;
  /**
   * Recipe positions
   * Recipe positions
   */
  data: RecipePosition[];
}

export interface SpecificRecipePositionRequest {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface LockedInputTokenSpecificRecipePosition {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Weiroll Wallet Address
   * Address of the weiroll wallet for this position
   */
  weirollWallet: string;
  /**
   * Unlock Timestamp
   * Block timestamp when the weiroll wallet will be unlocked
   */
  unlockTimestamp: string;
  /**
   * Is Unlocked
   * Whether the weiroll wallet is unlocked
   */
  isUnlocked: boolean;
  /**
   * Reward Style
   * The reward distribution style for the market: 0 = Upfront, 1 = Arrear, 2 = Forfeitable
   * @example 0
   */
  rewardStyle: 0 | 1 | 2;
}

export interface UnclaimedIncentiveTokenSpecificRecipePosition {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Weiroll Wallet Address
   * Address of the weiroll wallet for this position
   */
  weirollWallet: string;
  /**
   * Unlock Timestamp
   * Block timestamp when the weiroll wallet will be unlocked
   */
  unlockTimestamp: string;
  /**
   * Is Unlocked
   * Whether the weiroll wallet is unlocked
   */
  isUnlocked: boolean;
  /**
   * Reward Style
   * The reward distribution style for the market: 0 = Upfront, 1 = Arrear, 2 = Forfeitable
   * @example 0
   */
  rewardStyle: 0 | 1 | 2;
}

export interface ClaimedIncentiveTokenSpecificRecipePosition {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
}

export interface SpecificRecipePositionResponse {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_weirollWalletAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Input Token
   * The input token data for the position
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Incentive Tokens
   * The incentive tokens for the position
   */
  incentiveTokens: BaseEnrichedTokenData[];
  /**
   * Locked Input Token
   * The locked input token for the position
   */
  lockedInputToken: LockedInputTokenSpecificRecipePosition[];
  /**
   * Unclaimed Incentive Tokens
   * The unclaimed incentive tokens for the position
   */
  unclaimedIncentiveTokens: UnclaimedIncentiveTokenSpecificRecipePosition[];
  /**
   * Claimed Incentive Tokens
   * The claimed incentive tokens for the position
   */
  claimedIncentiveTokens: ClaimedIncentiveTokenSpecificRecipePosition[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives?: MarketNativeIncentive[];
  /**
   * External Incentives
   * External incentive tokens
   */
  externalIncentives?: MarketExternalIncentive[];
  /**
   * Balance USD
   * The balance of the entity in USD
   */
  balanceUsd: number;
}

export interface VaultPosition {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_accountAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Vault Shares
   * Raw amount of vault shares in wei
   * @example "1000000000000000000"
   */
  shares: string;
  /**
   * Name
   * The name of the market
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  name: string;
  /**
   * Input Token
   * The input token for the position with withdraw status
   */
  inputToken: BaseEnrichedTokenDataWithWithdrawStatus;
  /**
   * Incentive Tokens
   * The incentive tokens for the position with claim status
   */
  incentiveTokens: MarketActiveIncentiveWithClaimStatus[];
  /**
   * Claimed Incentive Tokens
   * Claimed incentive tokens
   */
  claimedIncentiveTokens: BaseEnrichedTokenData[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives?: MarketNativeIncentive[];
  /**
   * External Incentives
   * External incentive tokens
   */
  externalIncentives?: MarketExternalIncentive[];
  /**
   * Yield Rate
   * Yield rate as a ratio: 0.1 = 10%, 1 = 100%, etc.
   * @example "0.1"
   */
  yieldRate: number;
  /**
   * Block Number
   * Block number associated with the entity
   * @example "21910786"
   */
  blockNumber: string;
  /**
   * Block Timestamp
   * Block timestamp associated with the entity
   * @example "1743357424"
   */
  blockTimestamp: string;
  /**
   * Transaction Hash
   * Transaction hash associated with the entity
   * @example "0xbd48c4956ca72ebca29e517f556676170f78914b786518854c3c57be933af461"
   */
  transactionHash: string;
  /**
   * Log Index
   * Log index associated with the entity
   * @example "12"
   */
  logIndex: string;
}

export interface VaultPositionResponse {
  /**
   * Response Page Object
   * Object type to respond with a page of results
   * @example {"index":1,"size":3,"total":10}
   */
  page: ResponsePage;
  /**
   * Row Count
   * Total number of rows in the results
   * @example 234
   */
  count: number;
  /**
   * Vault positions
   * Vault positions
   */
  data: VaultPosition[];
}

export interface SpecificVaultPositionRequest {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface LockedInputTokenSpecificVaultPosition {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Shares
   * Raw amount of vault shares in wei
   * @example "1000000000000000000"
   */
  shares: string;
}

export interface UnclaimedIncentiveTokenSpecificVaultPosition {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
}

export interface SpecificVaultPositionResponse {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_accountAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Vault Shares
   * Raw amount of vault shares in wei
   * @example "1000000000000000000"
   */
  shares: string;
  /**
   * Input Token
   * The input token for the position
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Incentive Tokens
   * The incentive tokens for the position
   */
  incentiveTokens: BaseEnrichedTokenData[];
  /**
   * Locked Input Token
   * The locked input token for the position
   */
  lockedInputToken: LockedInputTokenSpecificVaultPosition[];
  /**
   * Unclaimed Incentive Tokens
   * The unclaimed incentive tokens for the position
   */
  unclaimedIncentiveTokens: UnclaimedIncentiveTokenSpecificVaultPosition[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives?: MarketNativeIncentive[];
  /**
   * External Incentives
   * External incentive tokens
   */
  externalIncentives?: MarketExternalIncentive[];
  /**
   * Balance USD
   * The balance of the entity in USD
   */
  balanceUsd: number;
}

export interface BoycoReceiptTokenData {
  /**
   * Breakdown
   * Breakdown of receipt tokens
   */
  breakdown: BaseEnrichedTokenData[];
  /**
   * Is Withdrawn
   * Whether the receipt tokens have been withdrawn
   */
  isWithdrawn: boolean;
  /**
   * Merkle Deposit Nonce
   * Merkle deposit nonce
   */
  merkleDepositNonce: string;
  /**
   * Amount Deposited
   * Amount deposited on source chain
   */
  amountDeposited: string;
  /**
   * Merkle Proof
   * Merkle proof to claim deposit
   */
  merkleProof: string[];
  /**
   * Is Unlocked
   * Is unlocked
   */
  isUnlocked: boolean;
}

export interface BoycoUnderlyingIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Incentive Link
   * Incentive link
   */
  incentiveLink?: string;
  /**
   * Is Unlocked
   * Is unlocked
   */
  isUnlocked: boolean;
}

export interface BoycoNativeIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Incentive Link
   * Incentive link
   */
  incentiveLink?: string;
  /**
   * Is Unlocked
   * Is unlocked
   */
  isUnlocked: boolean;
}

export interface BoycoPosition {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_weirollWalletAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Destination Chain ID
   * Network ID of the destination blockchain
   * @example 1
   */
  destinationChainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Weiroll Wallet Address
   * Address of the weiroll wallet for this position
   */
  weirollWallet: string;
  /**
   * Is Withdrawn
   * Whether the receipt tokens have been withdrawn
   */
  isWithdrawn: boolean;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Unlock Timestamp
   * Block timestamp when the position will be unlocked
   */
  unlockTimestamp: string;
  /**
   * Name
   * The name of the market
   * @example "Swap USDC to stkGHO for 1 mo"
   */
  name: string;
  /**
   * Lockup Time
   * The lockup time for the market in seconds. Note: vault markets always have a lockup time of "0"
   * @example "31536000"
   */
  lockupTime: string;
  /**
   * Input Token
   * Input token data
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Receipt Tokens
   * Tokens received on the destination chain, includes dust as well
   */
  receiptTokens: BoycoReceiptTokenData;
  /**
   * Incentive Tokens
   * Incentive tokens
   */
  incentiveTokens: BaseEnrichedTokenData[];
  /**
   * Underlying Incentives
   * Underlying incentive tokens
   */
  underlyingIncentives: BoycoUnderlyingIncentive[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives: BoycoNativeIncentive[];
  /**
   * Dapp Link
   * Link to the Dapp
   */
  dappLink?: string;
  /**
   * Merkle Link
   * Link to the merkle tree to claim tokens
   */
  merkleLink?: string;
  /**
   * Deposit Transaction Hash
   * Transaction hash of the deposit on the source chain
   * @example "0x0782e8b770bcf64a25998c191d5f63fce7645fc537698cdad8eec8b8d5b7f786"
   */
  depositTransactionHash: string;
  /**
   * Bridge Transaction Hash
   * Transaction hash of the bridge on the source chain
   * @example "0x8f768aa09904ee4f8c8a114d54f9f772aefe29a28c336f111693e1a6a92bf771"
   */
  bridgeTransactionHash: string;
  /**
   * Process Transaction Hash
   * Transaction hash of the processed bridge on the destination chain
   * @example "0x6ca4e1f0c042c468b349c5674c6b6e2b330102b6bc064a74590e94659f39ae61"
   */
  processTransactionHash: string;
  /**
   * Execute Transaction Hash
   * Transaction hash of the execution into the Dapp on the destination chain
   * @example "0x50b709ed7d0f3b5d4693548cd76e40ed1cffc8314253927391f7a655244e0832"
   */
  executeTransactionHash: string;
}

export interface BoycoPositionResponse {
  /**
   * Response Page Object
   * Object type to respond with a page of results
   * @example {"index":1,"size":3,"total":10}
   */
  page: ResponsePage;
  /**
   * Row Count
   * Total number of rows in the results
   * @example 234
   */
  count: number;
  /**
   * Boyco positions
   * Boyco positions
   */
  data: BoycoPosition[];
}

export interface SpecificBoycoPositionRequest {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface SpecificBoycoPositionResponse {
  /**
   * ID
   * The global unique identifier of the position: chainId_marketType_marketId_weirollWalletAddress
   */
  id: string;
  /**
   * Raw Market Ref ID
   * The raw market reference ID
   * @example "1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  rawMarketRefId: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Destination Chain ID
   * Network ID of the destination blockchain
   * @example 1
   */
  destinationChainId: number;
  /**
   * Market Type
   * The type of market: 0 = Recipe, 1 = Vault
   * @example 0
   */
  marketType: 0 | 1;
  /**
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Input Token
   * Input token data
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Receipt Tokens Breakdown
   * Breakdown of the receipt tokens
   */
  receiptTokensBreakdown: BaseEnrichedTokenData[];
  /**
   * Specific Locked Input Token
   * Specific locked input token
   */
  specificLockedInputToken: BoycoReceiptTokenData[];
  /**
   * Incentive Tokens
   * Incentive tokens
   */
  incentiveTokens: BaseEnrichedTokenData[];
  /**
   * Underlying Incentives
   * Underlying incentive tokens
   */
  underlyingIncentives: BoycoUnderlyingIncentive[];
  /**
   * Native Incentives
   * Native incentive tokens
   */
  nativeIncentives: BoycoNativeIncentive[];
  /**
   * Balance USD
   * The balance of the entity in USD
   */
  balanceUsd: number;
}

export interface VaultPositionUnclaimedRewardToken {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Reward IDs
   * The IDs of the reward tokens
   * @example ["1","2","3"]
   */
  rewardIds: string[];
}

export interface VaultPositionClaimedRewardToken {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: chainId-contractAddress
   * @example "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Contract Address
   * Deployment address of the contract
   * @example "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
   */
  contractAddress: string;
  /**
   * Name
   * The name of the token
   * @example "USDC"
   */
  name: string;
  /**
   * Symbol
   * The symbol of the token
   * @example "USDC"
   */
  symbol: string;
  /**
   * Image
   * The logo of the token
   * @example "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
   */
  image: string;
  /**
   * Decimals
   * The number of decimals of the token
   * @example 6
   */
  decimals: number;
  /**
   * Source
   * The source for the price feed of the token
   * @example "coinmarketcap"
   */
  source:
    | "coinmarketcap"
    | "coingecko"
    | "lp"
    | "enso"
    | "pendle"
    | "plume"
    | "external";
  /**
   * Search ID
   * The search id for the token on the source price feed: for CoinmarketCap, it's UCID (found under metadata section of the token page) -- for Coingecko, it's token slug (found in the URL of the token page) -- for all other sources, we have a custom search id according to their price feed API schema
   * @example "3408"
   */
  searchId: string;
  /**
   * Type
   * The type of the token
   * @example "token"
   */
  type: "token" | "point" | "lp";
  /**
   * Price
   * The price of the token
   * @example 0.99999999
   */
  price: number;
  /**
   * FDV
   * The fully diluted valuation of the token
   * @example 59689964490.12
   */
  fdv: number;
  /**
   * Total Supply
   * The total supply of the token
   * @example 59689963893.2
   */
  totalSupply: number;
  /**
   * Owner
   * The owner of the point program token
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  owner?: string;
  /**
   * Issuers
   * Authorized issuers of the point program token
   */
  issuers?: string[];
  /**
   * Sub Tokens
   * Array of sub tokens
   */
  subTokens?: TokenQuote[];
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  /**
   * Last Updated
   * The last updated timestamp of the data in YYYY-MM-DD HH:MM:SS format
   * @example "2025-03-17 17:52:10"
   */
  lastUpdated: string;
  /**
   * Raw Amount
   * Amount in wei
   * @example "10000000000"
   */
  rawAmount: string;
  /**
   * Token Amount
   * Normalized raw amount in token decimals
   * @example 1000
   */
  tokenAmount: number;
  /**
   * Token Amount USD
   * Normalized raw amount in USD
   * @example 999.99
   */
  tokenAmountUsd: number;
  /**
   * Reward IDs
   * The IDs of the reward tokens
   * @example ["1","2","3"]
   */
  rewardIds: string[];
}

export interface BoringPosition {
  /**
   * ID
   * The global unique identifier of the position: chainId_vaultAddress_accountAddress
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Vault Address
   * The address of the vault
   * @example "0x45088fb2ffebfdcf4dff7b7201bfa4cd2077c30e"
   */
  vaultAddress: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Unclaimed Reward Tokens
   * The unclaimed reward tokens for the position
   */
  unclaimedRewardTokens: VaultPositionUnclaimedRewardToken[];
  /**
   * Claimed Reward Tokens
   * The claimed reward tokens for the position
   */
  claimedRewardTokens: VaultPositionClaimedRewardToken[];
}

export interface BoringPositionResponse {
  /**
   * Response Page Object
   * Object type to respond with a page of results
   * @example {"index":1,"size":3,"total":10}
   */
  page: ResponsePage;
  /**
   * Row Count
   * Total number of rows in the results
   * @example 234
   */
  count: number;
  /**
   * Boring positions
   * Boring positions
   */
  data: BoringPosition[];
}

export interface SpecificBoringPositionRequest {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface SpecificBoringPositionResponse {
  /**
   * ID
   * The global unique identifier of the position: chainId_vaultAddress_accountAddress
   */
  id: string;
  /**
   * Chain ID
   * Network ID of the blockchain
   * @example 1
   */
  chainId: number;
  /**
   * Vault Address
   * The address of the vault
   * @example "0x45088fb2ffebfdcf4dff7b7201bfa4cd2077c30e"
   */
  vaultAddress: string;
  /**
   * Account Address
   * Wallet address of the account
   * @example "0x77777cc68b333a2256b436d675e8d257699aa667"
   */
  accountAddress: string;
  /**
   * Unclaimed Reward Tokens
   * The unclaimed reward tokens for the position
   */
  unclaimedRewardTokens: VaultPositionUnclaimedRewardToken[];
  /**
   * Claimed Reward Tokens
   * The claimed reward tokens for the position
   */
  claimedRewardTokens: VaultPositionClaimedRewardToken[];
}

export type ContractResponse = object;

export interface ChartRequestBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export type ChartResponse = object;

export interface StatsRequestBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export type ValidAssetPosition = object;

export interface StatsFinalResponse {
  /**
   * Input Tokens
   * Array of input tokens
   */
  inputTokens: ValidAssetPosition[];
  /**
   * Incentive Tokens
   * Array of incentive tokens
   */
  incentiveTokens: number;
  /**
   * Balance USD
   * Balance in USD
   * @example 1000.5
   */
  balanceUsd: number;
}

export interface RecipeAPMarketActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  quantity: string;
  accountAddress?: string;
  fundingVault?: string;
}

export type RawTxOption = object;

export interface RecipeAPMarketActionResponse {
  fillStatus: string;
  inputToken: BaseEnrichedTokenData;
  rewardStyle: number;
  yieldRate: number;
  incentiveTokens: BaseEnrichedTokenData[];
  underlyingIncentives: MarketUnderlyingIncentive[];
  nativeIncentives: MarketNativeIncentive[];
  externalIncentives: MarketExternalIncentive[];
  rawTxOptions: RawTxOption[];
}

export interface RecipeIPMarketActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  quantity: string;
  accountAddress?: string;
}

export interface RecipeIPMarketActionResponse {
  fillStatus: string;
  inputToken: BaseEnrichedTokenData;
  rewardStyle: number;
  yieldRate: number;
  incentiveTokens: BaseEnrichedTokenData[];
  underlyingIncentives: MarketUnderlyingIncentive[];
  nativeIncentives: MarketNativeIncentive[];
  externalIncentives: MarketExternalIncentive[];
  rawTxOptions: RawTxOption[];
  totalFeeRatio: number;
}

export interface RecipeIPLimitActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  accountAddress?: string;
  quantity: string;
  tokenIds: string[];
  tokenAmounts: string[];
  expiry?: string;
}

export interface RecipeIPLimitActionResponse {
  inputToken: BaseEnrichedTokenData;
  rewardStyle: number;
  yieldRate: number;
  incentiveTokens: BaseEnrichedTokenData[];
  underlyingIncentives: MarketUnderlyingIncentive[];
  nativeIncentives: MarketNativeIncentive[];
  externalIncentives: MarketExternalIncentive[];
  rawTxOptions: RawTxOption[];
  totalFeeRatio: number;
}

export interface RecipeAPLimitActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  accountAddress?: string;
  fundingVault?: string;
  quantity: string;
  tokenIds: string[];
  tokenAmounts: string[];
  expiry?: string;
}

export interface RecipeAPLimitActionResponse {
  inputToken: BaseEnrichedTokenData;
  rewardStyle: number;
  yieldRate: number;
  incentiveTokens: BaseEnrichedTokenData[];
  underlyingIncentives: MarketUnderlyingIncentive[];
  nativeIncentives: MarketNativeIncentive[];
  externalIncentives: MarketExternalIncentive[];
  rawTxOptions: RawTxOption[];
}

export interface VaultAPMarketActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  quantity: string;
  accountAddress?: string;
}

export interface VaultAPMarketActionResponse {
  inputToken: BaseEnrichedTokenData;
  yieldRate: number;
  incentiveTokens: BaseEnrichedTokenData[];
  nativeIncentives: MarketNativeIncentive[];
  externalIncentives: MarketExternalIncentive[];
  rawTxOptions: RawTxOption[];
}

export interface VaultAPLimitActionBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
  id: string;
  quantity: string;
  accountAddress?: string;
  fundingVault?: string;
  tokenIds: string[];
  tokenRates: string[];
  expiry?: string;
}

export type VaultAPLimitActionResponse = object;
