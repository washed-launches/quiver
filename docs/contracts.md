# Contracts

Robinhood Chain, chain id `4663`. Verify on [Blockscout](https://robinhoodchain.blockscout.com).

| Contract | Role |
| --- | --- |
| `QuiverSubscription` | Plans, `subscribe`, `isActive` |
| `QuiverFactory` | `onlySubscribed` deploy of token + curve |
| `SiteToken` | Fixed-supply ERC-20, minted to the curve |
| `BondingCurve` | Forever CP curve, `PROTOCOL_FEE_BPS = 0` |
| `SiteRegistry` | Slug and hostname map |
| `QuiverBuyback` | Spends ETH on PONS `$QUIVER` |
| `QuiverTreasury` | Holds bought `$QUIVER` |

Addresses are filled after deploy via `NEXT_PUBLIC_*` env vars. Until then the UI still walks the three-click flow against the API.

PONS factory (external): `0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e`

Deploy on Robinhood **mainnet** (4663). Put the key in the environment — don’t paste it into chat.

```
$env:PRIVATE_KEY="0x..."
node scripts/deploy-robinhood.mjs
```

That writes `contracts/deployments/robinhood.json` and the `NEXT_PUBLIC_*` addresses. People then subscribe and deploy their own curves from their wallets. You only need the deployer once.
