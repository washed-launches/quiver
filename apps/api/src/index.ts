import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./db.js";
import { verifyCname } from "./dns.js";

const app = new Hono();
const port = Number(process.env.API_PORT ?? 4001);
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return webOrigin;
      if (origin === webOrigin) return origin;
      if (origin.endsWith(".localhost") || origin.includes("127.0.0.1")) return origin;
      return origin;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, name: "quiver-api" }));

app.get("/sites/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const site = await prisma.site.findUnique({
    where: { slug },
    include: { trades: { orderBy: { createdAt: "asc" }, take: 200 } },
  });
  if (!site) return c.json({ error: "not_found" }, 404);
  return c.json(site);
});

app.get("/sites/by-host/:host", async (c) => {
  const host = c.req.param("host").toLowerCase();
  const site = await prisma.site.findFirst({
    where: { hostname: host, hostnameVerified: true },
    include: { trades: { orderBy: { createdAt: "asc" }, take: 200 } },
  });
  if (!site) return c.json({ error: "not_found" }, 404);
  return c.json(site);
});

app.get("/sites", async (c) => {
  const creator = c.req.query("creator");
  const sites = await prisma.site.findMany({
    where: creator ? { creator: creator.toLowerCase() } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return c.json(sites);
});

app.post("/sites", async (c) => {
  const body = await c.req.json<{
    slug: string;
    token: string;
    curve: string;
    creator: string;
    name: string;
    symbol: string;
    logo?: string;
    description?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    theme?: string;
  }>();

  if (!body.slug || !body.token || !body.curve || !body.creator) {
    return c.json({ error: "missing_fields" }, 400);
  }

  const site = await prisma.site.upsert({
    where: { slug: body.slug.toLowerCase() },
    update: {
      logo: body.logo ?? "",
      description: body.description ?? "",
      twitter: body.twitter ?? "",
      telegram: body.telegram ?? "",
      website: body.website ?? "",
      theme: body.theme ?? "forest",
    },
    create: {
      slug: body.slug.toLowerCase(),
      token: body.token.toLowerCase(),
      curve: body.curve.toLowerCase(),
      creator: body.creator.toLowerCase(),
      name: body.name,
      symbol: body.symbol,
      logo: body.logo ?? "",
      description: body.description ?? "",
      twitter: body.twitter ?? "",
      telegram: body.telegram ?? "",
      website: body.website ?? "",
      theme: body.theme ?? "forest",
    },
  });
  return c.json(site);
});

app.post("/domains/verify", async (c) => {
  const body = await c.req.json<{ slug: string; hostname: string }>();
  if (!body.slug || !body.hostname) return c.json({ error: "missing_fields" }, 400);
  const hostname = body.hostname.trim().toLowerCase();
  const result = await verifyCname(hostname);
  const site = await prisma.site.update({
    where: { slug: body.slug.toLowerCase() },
    data: { hostname, hostnameVerified: result.ok },
  });
  return c.json({ site, dns: result });
});

app.post("/index/trade", async (c) => {
  const body = await c.req.json<{
    slug: string;
    side: "buy" | "sell";
    actor: string;
    quote: string;
    tokens: string;
    txHash: string;
  }>();
  const site = await prisma.site.findUnique({ where: { slug: body.slug.toLowerCase() } });
  if (!site) return c.json({ error: "not_found" }, 404);
  const trade = await prisma.trade.upsert({
    where: { txHash: body.txHash.toLowerCase() },
    update: {},
    create: {
      siteId: site.id,
      side: body.side,
      actor: body.actor.toLowerCase(),
      quote: body.quote,
      tokens: body.tokens,
      txHash: body.txHash.toLowerCase(),
    },
  });
  return c.json(trade);
});

app.post("/index/subscription", async (c) => {
  const body = await c.req.json<{
    account: string;
    planId: string;
    paid: string;
    expiresAt: string;
    txHash: string;
  }>();
  const event = await prisma.subscriptionEvent.upsert({
    where: { txHash: body.txHash.toLowerCase() },
    update: {},
    create: {
      account: body.account.toLowerCase(),
      planId: body.planId,
      paid: body.paid,
      expiresAt: body.expiresAt,
      txHash: body.txHash.toLowerCase(),
    },
  });
  return c.json(event);
});

app.post("/index/buyback", async (c) => {
  const body = await c.req.json<{
    payer: string;
    ethIn: string;
    tokensOut: string;
    venue: string;
    txHash: string;
  }>();
  const fill = await prisma.buybackFill.upsert({
    where: { txHash: body.txHash.toLowerCase() },
    update: {},
    create: {
      payer: body.payer.toLowerCase(),
      ethIn: body.ethIn,
      tokensOut: body.tokensOut,
      venue: body.venue.toLowerCase(),
      txHash: body.txHash.toLowerCase(),
    },
  });
  return c.json(fill);
});

app.get("/stats", async (c) => {
  const [sites, trades, subs, buybacks] = await Promise.all([
    prisma.site.count(),
    prisma.trade.count(),
    prisma.subscriptionEvent.count(),
    prisma.buybackFill.count(),
  ]);
  return c.json({ sites, trades, subscriptions: subs, buybacks });
});

async function seed() {
  await prisma.site.upsert({
    where: { slug: "moss" },
    update: {},
    create: {
      slug: "moss",
      token: "0x0000000000000000000000000000000000000001",
      curve: "0x0000000000000000000000000000000000000002",
      creator: "0x0000000000000000000000000000000000000003",
      name: "Moss",
      symbol: "MOSS",
      description: "A demo forever curve. Trade goes live once factory addresses are set.",
    },
  });
}

seed()
  .then(() => {
    serve({ fetch: app.fetch, port }, () => {
      console.log(`quiver api on :${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
