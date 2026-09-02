export const ROBINHOOD_CHAIN_ID = 4663;
export const ROBINHOOD_TESTNET_CHAIN_ID = 46630;

export const robinhood = {
  id: ROBINHOOD_CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
} as const;

export const robinhoodTestnet = {
  id: ROBINHOOD_TESTNET_CHAIN_ID,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://explorer.testnet.chain.robinhood.com" },
  },
} as const;

export const PONS_FACTORY = "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e" as const;
export const PONS_MEME_HOOK = "0xE5e702641Ea86F4ae6cC3cDaeD2B886f976Be044" as const;
export const PONS_APP = "https://pons.family";

export const DEFAULT_SUPPLY = 1_000_000_000n * 10n ** 18n;
export const DEFAULT_PHANTOM = 10n ** 18n;
export const MONTHLY_PRICE = 5n * 10n ** 16n;
export const YEARLY_PRICE = 45n * 10n ** 16n;
