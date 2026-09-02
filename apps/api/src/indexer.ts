import { createPublicClient, http, parseAbiItem } from "viem";
import { prisma } from "./db.js";

const rpc = process.env.RH_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";
const factory = process.env.FACTORY_ADDRESS as `0x${string}` | undefined;
const subscription = process.env.SUBSCRIPTION_ADDRESS as `0x${string}` | undefined;
const buyback = process.env.BUYBACK_ADDRESS as `0x${string}` | undefined;

const client = createPublicClient({ transport: http(rpc) });

const createdEvent = parseAbiItem(
  "event Created(address indexed creator, address indexed token, address indexed curve, string slug, string name, string symbol, uint256 supply, uint256 phantomQuote)",
);
const buyEvent = parseAbiItem(
  "event Buy(address indexed buyer, address indexed recipient, uint256 quoteIn, uint256 tokensOut)",
);
const sellEvent = parseAbiItem(
  "event Sell(address indexed seller, address indexed recipient, uint256 tokensIn, uint256 quoteOut)",
);
const subEvent = parseAbiItem(
  "event Subscribed(address indexed account, uint256 indexed planId, uint256 paid, uint256 expiresAt)",
);
const boughtEvent = parseAbiItem(
  "event Bought(address indexed payer, uint256 ethIn, uint256 tokensOut, address venue)",
);

export async function syncFrom(fromBlock: bigint) {
  const toBlock = await client.getBlockNumber();
  if (factory) {
    const logs = await client.getLogs({ address: factory, event: createdEvent, fromBlock, toBlock });
    for (const log of logs) {
      const { creator, token, curve, slug, name, symbol } = log.args;
      if (!creator || !token || !curve || !slug) continue;
      await prisma.site.upsert({
        where: { slug: slug.toLowerCase() },
        update: {},
        create: {
          slug: slug.toLowerCase(),
          token: token.toLowerCase(),
          curve: curve.toLowerCase(),
          creator: creator.toLowerCase(),
          name: name ?? slug,
          symbol: symbol ?? slug.toUpperCase(),
        },
      });
    }
  }

  if (subscription) {
    const logs = await client.getLogs({ address: subscription, event: subEvent, fromBlock, toBlock });
    for (const log of logs) {
      if (!log.transactionHash || !log.args.account) continue;
      await prisma.subscriptionEvent.upsert({
        where: { txHash: log.transactionHash.toLowerCase() },
        update: {},
        create: {
          account: log.args.account.toLowerCase(),
          planId: String(log.args.planId ?? 0n),
          paid: String(log.args.paid ?? 0n),
          expiresAt: String(log.args.expiresAt ?? 0n),
          txHash: log.transactionHash.toLowerCase(),
        },
      });
    }
  }

  if (buyback) {
    const logs = await client.getLogs({ address: buyback, event: boughtEvent, fromBlock, toBlock });
    for (const log of logs) {
      if (!log.transactionHash || !log.args.payer) continue;
      await prisma.buybackFill.upsert({
        where: { txHash: log.transactionHash.toLowerCase() },
        update: {},
        create: {
          payer: log.args.payer.toLowerCase(),
          ethIn: String(log.args.ethIn ?? 0n),
          tokensOut: String(log.args.tokensOut ?? 0n),
          venue: (log.args.venue ?? "0x0").toLowerCase(),
          txHash: log.transactionHash.toLowerCase(),
        },
      });
    }
  }

  const sites = await prisma.site.findMany();
  for (const site of sites) {
    const logs = await client.getLogs({
      address: site.curve as `0x${string}`,
      events: [buyEvent, sellEvent],
      fromBlock,
      toBlock,
    });
    for (const log of logs) {
      if (!log.transactionHash) continue;
      const side = log.eventName === "Buy" ? "buy" : "sell";
      const actor = (log.args as { buyer?: string; seller?: string }).buyer
        ?? (log.args as { seller?: string }).seller
        ?? "0x0";
      const quote = String((log.args as { quoteIn?: bigint; quoteOut?: bigint }).quoteIn
        ?? (log.args as { quoteOut?: bigint }).quoteOut
        ?? 0n);
      const tokens = String((log.args as { tokensOut?: bigint; tokensIn?: bigint }).tokensOut
        ?? (log.args as { tokensIn?: bigint }).tokensIn
        ?? 0n);
      await prisma.trade.upsert({
        where: { txHash: log.transactionHash.toLowerCase() },
        update: {},
        create: {
          siteId: site.id,
          side,
          actor: actor.toLowerCase(),
          quote,
          tokens,
          txHash: log.transactionHash.toLowerCase(),
        },
      });
    }
  }

  return { fromBlock: fromBlock.toString(), toBlock: toBlock.toString() };
}

if (process.argv[1]?.includes("indexer")) {
  const from = BigInt(process.env.INDEX_FROM_BLOCK ?? "0");
  syncFrom(from).then((r) => {
    console.log("indexed", r);
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
