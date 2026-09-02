import { defineChain } from "viem";
import { createConfig, http, injected } from "wagmi";
import { ROBINHOOD_CHAIN_ID } from "@quiver/sdk";

export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RH_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: process.env.NEXT_PUBLIC_RH_EXPLORER ?? "https://robinhoodchain.blockscout.com",
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  connectors: [injected()],
  transports: {
    [robinhoodChain.id]: http(robinhoodChain.rpcUrls.default.http[0]),
  },
  ssr: true,
});
