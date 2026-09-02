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

Robinhood Chain **mainnet**, chain id `4663`.

```bash
cd contracts
forge test -vv
```

Deploy (do not paste the key into chat):

```powershell
$env:PRIVATE_KEY="0x..."
node scripts/deploy-robinhood.mjs
```

The script checks you are on mainnet, deploys the five contracts, writes `contracts/deployments/robinhood.json`, and fills `NEXT_PUBLIC_*` in the web env files. Fund the deployer with a little ETH on Robinhood mainnet first (~0.01 ETH is enough).

## Whitepaper

```bash
pdflatex -interaction=nonstopmode -output-directory whitepaper whitepaper/main.tex
copy whitepaper\main.pdf apps\web\public\quiver.pdf
```
