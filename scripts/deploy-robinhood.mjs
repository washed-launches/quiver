#!/usr/bin/env node
/**
 * Deploy QUIVER to Robinhood Chain mainnet (4663).
 *
 * Do not paste the key into chat. Set it in this shell, then run:
 *
 *   $env:PRIVATE_KEY="0x..."
 *   node scripts/deploy-robinhood.mjs
 *
 * Optional:
 *   $env:QUIVER_TOKEN="0x..."          # after the PONS launch
 *   $env:RH_RPC_URL="https://rpc.mainnet.chain.robinhood.com"
 *   $env:SKIP_VERIFY="1"
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTRACTS = path.join(ROOT, "contracts");
const RPC = process.env.RH_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";
const CHAIN_ID = "4663";
const EXPLORER = "https://robinhoodchain.blockscout.com";
const VERIFY_API = "https://robinhoodchain.blockscout.com/api";
const PONS_FACTORY = "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e";

function which(bin) {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [bin], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: opts.silent ? ["ignore", "pipe", "pipe"] : "inherit",
    env: opts.env ?? process.env,
    cwd: opts.cwd ?? ROOT,
  });
}

function cast(args) {
  return run("cast", args, { silent: true, cwd: CONTRACTS }).trim();
}

if (!which("forge") || !which("cast")) {
  console.error("Foundry (forge + cast) is required. Install from https://getfoundry.sh then reopen this terminal.");
  process.exit(1);
}

const key = process.env.PRIVATE_KEY;
if (!key || !/^0x[0-9a-fA-F]{64}$/.test(key)) {
  console.error("Set PRIVATE_KEY in this shell to a 0x + 64 hex key. Do not paste it into chat.");
  process.exit(1);
}

const chainId = cast(["chain-id", "--rpc-url", RPC]);
if (chainId !== CHAIN_ID) {
  console.error(`RPC is chain ${chainId}, expected Robinhood mainnet ${CHAIN_ID}`);
  process.exit(1);
}

const deployer = cast(["wallet", "address", "--private-key", key]);
const balanceWei = BigInt(cast(["balance", deployer, "--rpc-url", RPC]));
const balanceEth = Number(balanceWei) / 1e18;

console.log("Robinhood Chain mainnet");
console.log("RPC       ", RPC);
console.log("deployer  ", deployer);
console.log("balance   ", balanceEth.toFixed(5), "ETH");
console.log("explorer  ", `${EXPLORER}/address/${deployer}`);
console.log("PONS      ", PONS_FACTORY);

if (balanceWei < 10n ** 16n) {
  console.error("Need at least ~0.01 ETH on Robinhood mainnet for gas. Fund this wallet, then rerun.");
  process.exit(1);
}

mkdirSync(path.join(CONTRACTS, "deployments"), { recursive: true });

console.log("\nBroadcasting Deploy.s.sol …\n");
run(
  "forge",
  ["script", "script/Deploy.s.sol:Deploy", "--rpc-url", RPC, "--broadcast", "--slow"],
  { cwd: CONTRACTS, env: { ...process.env, PRIVATE_KEY: key, PONS_FACTORY: process.env.PONS_FACTORY ?? PONS_FACTORY } },
);

const outPath = path.join(CONTRACTS, "deployments", "robinhood.json");
if (!existsSync(outPath)) {
  console.error("Deploy finished but contracts/deployments/robinhood.json is missing.");
  process.exit(1);
}

const deployed = JSON.parse(readFileSync(outPath, "utf8"));
console.log("\nDeployed");
for (const [k, v] of Object.entries(deployed)) {
  console.log(`  ${String(k).padEnd(14)} ${v}`);
}

function patchEnv(file, map) {
  const full = path.join(ROOT, file);
  const dir = path.dirname(full);
  if (!existsSync(dir)) return;
  let text = existsSync(full) ? readFileSync(full, "utf8") : "";
  for (const [name, value] of Object.entries(map)) {
    const line = `${name}=${value}`;
    const re = new RegExp(`^${name}=.*$`, "m");
    text = re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
  }
  writeFileSync(full, text.endsWith("\n") ? text : `${text}\n`);
}

const webEnv = {
  NEXT_PUBLIC_RH_CHAIN_ID: CHAIN_ID,
  NEXT_PUBLIC_RH_RPC_URL: RPC,
  NEXT_PUBLIC_RH_EXPLORER: EXPLORER,
  NEXT_PUBLIC_SITE_HOST: "quiver.diy",
  NEXT_PUBLIC_PONS_FACTORY: deployed.ponsFactory ?? PONS_FACTORY,
  NEXT_PUBLIC_TREASURY_ADDRESS: deployed.treasury,
  NEXT_PUBLIC_BUYBACK_ADDRESS: deployed.buyback,
  NEXT_PUBLIC_SUBSCRIPTION_ADDRESS: deployed.subscription,
  NEXT_PUBLIC_REGISTRY_ADDRESS: deployed.registry,
  NEXT_PUBLIC_FACTORY_ADDRESS: deployed.factory,
};

const apiEnv = {
  RH_RPC_URL: RPC,
  FACTORY_ADDRESS: deployed.factory,
  SUBSCRIPTION_ADDRESS: deployed.subscription,
  BUYBACK_ADDRESS: deployed.buyback,
  REGISTRY_ADDRESS: deployed.registry,
  TREASURY_ADDRESS: deployed.treasury,
};

patchEnv("apps/web/.env.local", webEnv);
patchEnv("apps/web/.env.production", webEnv);
patchEnv("apps/api/.env", apiEnv);
console.log("\nWrote addresses into apps/web/.env.local, apps/web/.env.production, apps/api/.env");

if (process.env.SKIP_VERIFY) {
  console.log("SKIP_VERIFY set — not verifying.");
} else {
  const verify = [
    ["QuiverTreasury", deployed.treasury, "src/QuiverTreasury.sol:QuiverTreasury", "constructor(address)", [deployed.deployer]],
    [
      "QuiverBuyback",
      deployed.buyback,
      "src/QuiverBuyback.sol:QuiverBuyback",
      "constructor(address,address)",
      [deployed.deployer, deployed.ponsFactory ?? PONS_FACTORY],
    ],
    [
      "QuiverSubscription",
      deployed.subscription,
      "src/QuiverSubscription.sol:QuiverSubscription",
      "constructor(address)",
      [deployed.deployer],
    ],
    ["SiteRegistry", deployed.registry, "src/SiteRegistry.sol:SiteRegistry", "constructor(address)", [deployed.deployer]],
    [
      "QuiverFactory",
      deployed.factory,
      "src/QuiverFactory.sol:QuiverFactory",
      "constructor(address,address,address)",
      [deployed.deployer, deployed.subscription, deployed.registry],
    ],
  ];

  console.log("\nVerifying on Blockscout …");
  for (const [name, address, fq, sig, args] of verify) {
    try {
      const encoded = cast(["abi-encode", sig, ...args]);
      run(
        "forge",
        [
          "verify-contract",
          address,
          fq,
          "--chain-id",
          CHAIN_ID,
          "--rpc-url",
          RPC,
          "--verifier",
          "blockscout",
          "--verifier-url",
          VERIFY_API,
          "--constructor-args",
          encoded,
        ],
        { cwd: CONTRACTS },
      );
      console.log("verified", name);
    } catch {
      console.warn("verify failed for", name, "— you can retry later");
    }
  }
}

console.log(`\nDone. Factory: ${EXPLORER}/address/${deployed.factory}`);
console.log("\nSet these on Railway (public addresses only), then redeploy:");
for (const [name, value] of Object.entries(webEnv)) {
  console.log(`${name}=${value}`);
}
for (const [name, value] of Object.entries(apiEnv)) {
  if (!(name in webEnv) && name !== "RH_RPC_URL") console.log(`${name}=${value}`);
}
console.log("RH_RPC_URL=" + RPC);
