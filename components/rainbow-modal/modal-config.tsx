import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { cookieStorage, createStorage, http } from "wagmi";
import { cookieStorage, createStorage, fallback, http } from "wagmi";
import { unstable_connector } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import Cookies from "js-cookie";

import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import {
  EthereumSepolia,
  EthereumMainnet,
  ArbitrumOne,
  Base,
  Corn,
  Plume,
  Sonic,
  BerachainMainnet,
  BerachainTestnet,
  Hyperevm,
} from "royco/constants";

export const metadata = {
  name: "Royco",
  description:
    "Royco is a marketplace for exclusive incentives from the best projects.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://app.royco.org", // Ensure url is always a string
  icons: ["/icon.png"],
};

const customCookieStorage = {
  getItem: (key: string) => {
    return Cookies.get(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    Cookies.set(key, value, {
      domain:
        process.env.NEXT_PUBLIC_API_ENV === "development"
          ? "localhost"
          : ".royco.org",
      path: "/",
      sameSite: "lax",
      secure: process.env.NEXT_PUBLIC_API_ENV !== "development",
    });
  },
  removeItem: (key: string) => {
    Cookies.remove(key, {
      domain:
        process.env.NEXT_PUBLIC_API_ENV === "development"
          ? "localhost"
          : ".royco.org",
      path: "/",
    });
  },
};

export const config = getDefaultConfig({
  appName: "Royco",
  chains: [
    EthereumMainnet,
    ArbitrumOne,
    Base,
    Corn,
    Plume,
    EthereumSepolia,
    Sonic,
    BerachainMainnet,
    BerachainTestnet,
    Hyperevm,
  ],
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  ssr: true,
  multiInjectedProviderDiscovery: false,
  transports: {
    [EthereumMainnet.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_1!),
      http(),
    ]),
    [ArbitrumOne.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_42161!),
      http(),
    ]),
    [Base.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_8453!),
      http(),
    ]),
    [Corn.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_21000000!),
      http(),
    ]),
    [Plume.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_98866!),
      http(),
    ]),
    [Hyperevm.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_999!),
      http(),
    ]),
    [EthereumSepolia.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!),
      http(),
    ]),
    [Sonic.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_146!),
      http(),
    ]),
    [BerachainMainnet.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_80094!),
      http(),
    ]),
    [BerachainTestnet.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_80095!),
      http(),
    ]),
  },
  batch: {
    multicall: true,
  },
  storage: createStorage({
    storage: customCookieStorage,
  }),
});
