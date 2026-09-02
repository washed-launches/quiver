# Subscription vs take-rate

Default plans (owner-settable on-chain):

| Plan | Price | Duration |
| --- | --- | --- |
| Monthly | 0.05 ETH | 30 days |
| Yearly | 0.45 ETH | 365 days |

Paying extends `expiresAt` from `max(now, current expiry)`. The factory will not deploy a site unless `isActive(msg.sender)` is true.

## Where the ETH goes

`QuiverSubscription.subscribe` forwards 100% of `msg.value` to `QuiverBuyback.onPayment`. The buyback spends it on `$QUIVER` via the live PONS venue and sends tokens to `QuiverTreasury`.

Nothing is taken from creator-token buys or sells. `BondingCurve.PROTOCOL_FEE_BPS` is hardcoded to `0`.
