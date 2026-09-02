# Creator guide

## Launch

1. Open [/launch](/launch) and connect a wallet on Robinhood Chain.
2. Pick monthly (0.05 ETH) or yearly (0.45 ETH) and subscribe. ETH is forwarded to the `$QUIVER` buyback.
3. Set name, ticker, slug (3–32 chars, lowercase letters, numbers, hyphens).
4. Deploy. One transaction creates the ERC-20 and the forever curve and registers the slug.

Default economics: 1,000,000,000 tokens, 18 decimals, 1 ETH phantom reserve, entire supply minted to the curve. No owner mint, pause, or blacklist.

## Branding

The dashboard stores description, links, and theme off-chain. On-chain state is the token, curve, creator, and slug.

## Custom domain

1. Add a CNAME from `trade.yourdomain.com` to `sites.quiver.app`.
2. Enter the hostname in the dashboard and click **Verify CNAME**.
3. Once DNS matches, QUIVER serves your white-label market on that host.

Wildcard TLS and a full CDN control plane are not part of v1. Path `/s/slug` always works.

## Trading

Anyone can buy and sell against the curve from the site. Protocol fee is 0. There is no graduation button.
