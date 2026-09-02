export type SiteRecord = {
  id: string;
  slug: string;
  token: string;
  curve: string;
  creator: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  twitter: string;
  telegram: string;
  website: string;
  theme: string;
  hostname: string;
  hostnameVerified: boolean;
  trades?: {
    id: string;
    side: string;
    actor: string;
    quote: string;
    tokens: string;
    txHash: string;
    createdAt: string;
  }[];
};
