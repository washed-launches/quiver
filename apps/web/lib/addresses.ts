export const ZERO = "0x0000000000000000000000000000000000000000" as const;

export const addresses = {
  subscription: (process.env.NEXT_PUBLIC_SUBSCRIPTION_ADDRESS ?? ZERO) as `0x${string}`,
  factory: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? ZERO) as `0x${string}`,
  registry: (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? ZERO) as `0x${string}`,
  buyback: (process.env.NEXT_PUBLIC_BUYBACK_ADDRESS ?? ZERO) as `0x${string}`,
  treasury: (process.env.NEXT_PUBLIC_TREASURY_ADDRESS ?? ZERO) as `0x${string}`,
  quiverToken: (process.env.NEXT_PUBLIC_QUIVER_TOKEN ?? ZERO) as `0x${string}`,
};

export const apiUrl =
  typeof window === "undefined"
    ? (process.env.API_UPSTREAM ?? "http://127.0.0.1:4001")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001");
export const explorer = process.env.NEXT_PUBLIC_RH_EXPLORER ?? "https://robinhoodchain.blockscout.com";
export const ponsApp = process.env.NEXT_PUBLIC_PONS_APP ?? "https://pons.family";

export function isDeployed(addr: string) {
  return addr !== ZERO;
}
