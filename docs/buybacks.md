# Buybacks

Subscription ETH is the only protocol revenue.

```
Creator  --ETH-->  QuiverSubscription
                 --ETH-->  QuiverBuyback
                 --buy-->  PONS (QUIVER venue)
                 --QUIVER-->  QuiverTreasury
```

`QuiverTreasury` holds bought tokens. There are no silent withdrawals in v1.

If the `$QUIVER` address is unset, or PONS cannot be read, or the launch has graduated and the v4 path is not wired, ETH stays in the buyback contract. Anyone may call `executeHeld()` after the venue is ready.

Creator-token volume never enters this path.
