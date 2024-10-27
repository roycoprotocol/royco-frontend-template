import { Address } from "abitype";

export const ContractAddresses = {
  WrappedVault: "0x0000000000000000000000000000000000000000",
  WrappedVaultFactory: "0xded25e49bb9ef6172c73c2d50667779eef503937",
  PointsFactory: "0xeaa168a383105ee15edd1d3816f88f9289710079",
  RecipeMarketHub: "0xbf29db24d0b513deecf3915720abda5b94c46739",
  VaultMarketHub: "0xfc94ce989c77c6b388e302cd4ff31ca1faae8783",
  WeirollWallet: "0x593f45d6de842ad9ebaf2de4fd6e00aa2a41f436",
  WeirollWalletHelper: "0x07899ac8be7462151d6515fcd4773dd9267c9911",
} as Record<string, Address>;
