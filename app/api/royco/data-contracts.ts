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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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

export interface TokenQuoteBody {
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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

export interface InfoMarketBody {
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
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
  sorting?: Sorting;
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
  incentiveTokens: string[];
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
   * The global unique identifier of the vault: <CHAIN_ID>_<VAULT_ADDRESS>
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

export interface ResponsePage {
  /**
   * Page Index
   * Page index
   * @example 1
   */
  index: number;
  /**
   * Page Size
   * Page size
   * @example 3
   */
  size: number;
  /**
   * Page Total
   * Page total
   * @example 10
   */
  total: number;
}

export interface BaseEnrichedTokenData {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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

export interface MarketActiveIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
}

export interface MarketNativeIncentive {
  /**
   * Raw Metadata
   * Raw metadata
   */
  rawMetadata?: object;
  /**
   * Token ID
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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
   * Unique identifier for the token: <CHAIN_ID>-<CONTRACT_ADDRESS>
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
  source: "coinmarketcap" | "coingecko" | "lp" | "enso" | "pendle" | "plume" | "external";
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

export interface RecipePosition {
  /**
   * ID
   * The global unique identifier of the position: <CHAIN_ID>_<MARKET_TYPE>_<MARKET_ID>_<WEIROLL_WALLET_ADDRESS>
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
   * Market ID
   * The on-chain identifier of the market: For recipe market, it's market hash -- for vault market, it's wrapped vault address
   * @example "0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
   */
  marketId: string;
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
   * Is Withdrawn
   * Whether the input token has been withdrawn
   * @example false
   */
  isWithdrawn: boolean;
  /**
   * Is Claimed
   * Whether the incentive token has been claimed
   * @example [true,false,false]
   */
  isClaimed: boolean[];
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
   * Input Token Data
   * Token data for the market input token
   */
  inputToken: BaseEnrichedTokenData;
  /**
   * Incentive Tokens
   * Active incentive tokens
   */
  incentiveTokens: MarketActiveIncentive[];
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

export interface RewardsRequest {
  /**
   * Filters
   * The filters to apply to the rewards
   * @example []
   */
  filters?: string[];
  /**
   * Sorting
   * The sorting to apply to the rewards
   * @example []
   */
  sorting?: string[];
  /**
   * Page
   * The page number to return
   * @example {"index":1,"size":10,"total":100}
   */
  page?: object;
  /**
   * Custom Token Data
   * Array of custom token assumptions --  if not provided, the default quote data will be used.
   */
  customTokenData?: CustomTokenDataElement[];
}

export interface Reward {
  /**
   * ID
   * The globally unique identifier of the reward
   * @example "1_0x1234...5678"
   */
  id: string;
  /**
   * Account Address
   * The address of the account that owns the reward
   * @example "0x1234...5678"
   */
  accountAddress: string;
  /**
   * Token Amount
   * The amount of tokens in the reward
   * @example "1000000000000000000"
   */
  tokenAmount: string;
  /**
   * Reward Source
   * The source of the reward
   * @example "vault"
   */
  rewardSource: string;
  /**
   * Withdraw Reference ID
   * The reference ID of the withdrawal
   * @example "0x1234...5678"
   */
  withdrawRefId?: string;
  /**
   * Vault Address
   * The address of the vault
   * @example "0x1234...5678"
   */
  vaultAddress: string;
  /**
   * Chain ID
   * The chain ID of the network
   * @example "1"
   */
  chainId: string;
  /**
   * Last Updated
   * The timestamp of the last update
   * @example "2024-03-20T12:00:00Z"
   */
  lastUpdated: string;
  /**
   * Block Timestamp
   * The timestamp of the block
   * @example "2024-03-20T12:00:00Z"
   */
  blockTimestamp: string;
  /**
   * Is Claimed
   * Whether the reward has been claimed
   * @example false
   */
  isClaimed: boolean;
  /**
   * Token
   * The token information
   * @example {}
   */
  token: object;
  /**
   * Reward
   * The reward details
   * @example null
   */
  reward?: object;
}

export interface RewardsResponse {
  /** Array of rewards */
  data: Reward[];
  /**
   * Count
   * The total number of rewards
   * @example 100
   */
  count: number;
  /**
   * Page
   * The page number to return
   * @example {"index":1,"size":10,"total":100}
   */
  page?: object;
}
