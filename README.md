# QUIVER

White-label forever bonding curves on Robinhood Chain. Subscription for the tooling. Nothing on the volume.

## Stack

- `contracts/` — Foundry (Solidity 0.8.24)
- `apps/api` — Hono + Prisma/SQLite
- `apps/web` — Next.js 15, wagmi, pixel-forest UI
- `packages/sdk` — ABIs, curve math, PONS helpers
- `docs/` — product docs (served at `/docs`)
- `whitepaper/` — LaTeX source; PDF at `apps/web/public/quiver.pdf`

## Run locally

```bash
corepack enable
pnpm install
cd apps/api && pnpm exec prisma generate && pnpm exec prisma db push && cd ../..
pnpm dev
```

Web: http://localhost:3000  
API: http://localhost:4001/health

## Contracts

```bash
cd contracts
forge test -vv
forge script script/Deploy.s.sol:Deploy --rpc-url $RH_TESTNET_RPC_URL --broadcast
```

## Whitepaper

```bash
pdflatex -interaction=nonstopmode -output-directory whitepaper whitepaper/main.tex
copy whitepaper\main.pdf apps\web\public\quiver.pdf
```
