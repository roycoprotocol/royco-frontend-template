import {
  mainnet as ethereumMainnet,
  sepolia as ethereumSepolia,
  arbitrum as arbitrumOne,
  arbitrumSepolia,
} from "viem/chains";
import { type Chain } from "viem/chains";

export type SupportedChain = Chain & {
  image: string;
  symbol: string;
};

const EthereumMainnet = {
  ...ethereumMainnet,
  image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  symbol: "ETH",
};

const EthereumSepolia = {
  ...ethereumSepolia,
  image: "https://chainlist.org/unknown-logo.png",
  symbol: "SETH",
};

const ArbitrumOne = {
  ...arbitrumOne,
  image: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
  symbol: "ARB",
};

const ArbitrumSepolia = {
  ...arbitrumSepolia,
  image: "https://chainlist.org/unknown-logo.png",
  symbol: "ARBS",
};

export const SupportedChainMap: Record<number, SupportedChain> = {
  [ethereumMainnet.id]: EthereumMainnet,
  [ethereumSepolia.id]: EthereumSepolia,
  // [arbitrumOne.id]: ArbitrumOne,
  // [arbitrumSepolia.id]: ArbitrumSepolia,
};

export const SupportedChainlist = Object.values(SupportedChainMap);
