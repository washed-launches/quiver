# Curve math

The forever curve is a constant-product book with a virtual ETH reserve.

Let

- `P` = phantom quote (default 1 ETH)
- `R` = real ETH reserve (starts at 0)
- `T` = token reserve (starts at total supply)
- `V = P + R` = virtual quote

Invariant: `V * T` is conserved across trades.

## Buy

Spend `q` ETH:

```
tokensOut = T * q / (V + q)
R' = R + q
T' = T - tokensOut
```

## Sell

Sell `t` tokens:

```
quoteOut = V * t / (T + t)
```

`quoteOut` cannot exceed `R`. Selling the exact inventory bought in a single prior buy returns that ETH (minus rounding toward zero).

## Spot

```
price = V / T
```

Reported on-chain as `spotPrice = V * 1e18 / T`.

There is no protocol fee term in either formula.
