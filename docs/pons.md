# Why $QUIVER launched on PONS

`$QUIVER` is not traded on a QUIVER forever curve. It launched on [PONS v2](https://docs.ponsfamily.com/v2) on Robinhood Chain.

That is intentional.

PONS *is* the social moat: a feed, a network, a place people already look. The protocol token needs that once. Creator tokens do not, if the creator already has distribution.

Buybacks resolve the live PONS venue:

1. Read `getLaunchedToken(QUIVER)` on factory `0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e`.
2. If the launch is still on its curve, call `buy` and send tokens to the treasury.
3. If it has graduated to Uniswap v4 (hook `0xE5e702641Ea86F4ae6cC3cDaeD2B886f976Be044`), v1 holds ETH and emits `Held("graduated-hold")` until a v4 swap path is wired. `executeHeld()` retries.

Until the PONS launch address is set, buybacks hold ETH. There is no fake QUIVER curve on this site. Trade `$QUIVER` on PONS.
