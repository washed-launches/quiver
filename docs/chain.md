# Robinhood Chain

QUIVER ships on Robinhood Chain **mainnet** (4663), an Arbitrum Orbit L2. Gas is ETH. There is no chain token.

| | Mainnet (live) | Testnet |
| --- | --- | --- |
| Chain id | 4663 | 46630 |
| RPC | `https://rpc.mainnet.chain.robinhood.com` | `https://rpc.testnet.chain.robinhood.com` |
| Explorer | [Blockscout](https://robinhoodchain.blockscout.com) | [testnet](https://explorer.testnet.chain.robinhood.com) |

Add the network in any EVM wallet. Official notes live at [docs.robinhood.com/chain](https://docs.robinhood.com/chain/).

Assumptions we inherit: a centralized sequencer, ~100ms blocks, optimistic finality that is not L1 settlement. Soft confirms are fast; treat them as sequencer promises.
