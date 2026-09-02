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

Deploy (testnet first):

```
cd contracts
forge script script/Deploy.s.sol:Deploy --rpc-url $RH_TESTNET_RPC_URL --broadcast
forge verify-contract <addr> src/QuiverFactory.sol:QuiverFactory --verifier blockscout --verifier-url https://explorer.testnet.chain.robinhood.com/api --chain-id 46630
```
