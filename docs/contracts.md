# Contracts

Robinhood Chain **mainnet**, chain id `4663`. Deployer `0x85eD258929a3DE1709eA4a4CFFCDDAf735bcFaf8`.

| Contract | Address |
| --- | --- |
| `QuiverFactory` | [`0x39674D79FDe557f8483905094AF65f0ae43d2e99`](https://robinhoodchain.blockscout.com/address/0x39674D79FDe557f8483905094AF65f0ae43d2e99) |
| `QuiverSubscription` | [`0x8C6bcBf36747DAebBf732752c0EbCB37F53a77ca`](https://robinhoodchain.blockscout.com/address/0x8C6bcBf36747DAebBf732752c0EbCB37F53a77ca) |
| `SiteRegistry` | [`0x50Bcac45Bf8A29020016075E9981841BEd9B8F50`](https://robinhoodchain.blockscout.com/address/0x50Bcac45Bf8A29020016075E9981841BEd9B8F50) |
| `QuiverBuyback` | [`0x09E7198143C14d544cF9e75911Fa0212DdE464DB`](https://robinhoodchain.blockscout.com/address/0x09E7198143C14d544cF9e75911Fa0212DdE464DB) |
| `QuiverTreasury` | [`0xD9bafeA718417eE1153e31B8dB2B5D8Ee85F80A9`](https://robinhoodchain.blockscout.com/address/0xD9bafeA718417eE1153e31B8dB2B5D8Ee85F80A9) |
| PONS factory (external) | [`0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e`](https://robinhoodchain.blockscout.com/address/0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e) |

`$QUIVER` is unset until the PONS launch address is known. Buybacks hold ETH until then.

`SiteToken` and `BondingCurve` are created per site by the factory. Protocol fee on those curves is `0`.

Deploy on Robinhood **mainnet** (4663). Put the key in the environment — don’t paste it into chat.

```
$env:PRIVATE_KEY="0x..."
node scripts/deploy-robinhood.mjs
```

That writes `contracts/deployments/robinhood.json` and the `NEXT_PUBLIC_*` addresses. People then subscribe and deploy their own curves from their wallets. You only need the deployer once.
