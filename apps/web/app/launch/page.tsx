"use client";

import { factoryAbi, normalizeSlug, subscriptionAbi } from "@quiver/sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { decodeEventLog, parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { addresses, isDeployed } from "@/lib/addresses";
import { saveSite } from "@/lib/api";
import { publicUrl, reservedSlugs } from "@/lib/site";
import { WalletButton } from "@/components/wallet-button";
import { wagmiConfig } from "@/lib/wagmi";

const PLAN_PRICE = [parseEther("0.05"), parseEther("0.45")] as const;
const STEPS = ["Subscribe", "Name it", "Deploy"] as const;

export default function LaunchPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState(0);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const { data: active, refetch } = useReadContract({
    address: addresses.subscription,
    abi: subscriptionAbi,
    functionName: "isActive",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && isDeployed(addresses.subscription) },
  });

  async function subscribe() {
    setError("");
    if (!isDeployed(addresses.subscription)) {
      setError("Preview only — the factory isn’t on-chain yet. You can still walk through making a page.");
      setStep(2);
      return;
    }
    try {
      const hash = await writeContractAsync({
        address: addresses.subscription,
        abi: subscriptionAbi,
        functionName: "subscribe",
        args: [BigInt(planId)],
        value: PLAN_PRICE[planId],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await refetch();
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscribe failed");
    }
  }

  async function deploy() {
    setError("");
    try {
      const clean = normalizeSlug(slug);
      if (reservedSlugs.has(clean)) {
        setError("That name is reserved. Pick something else.");
        return;
      }
      if (!isDeployed(addresses.factory) || !address) {
        await saveSite({
          slug: clean,
          token: "0x0000000000000000000000000000000000000001",
          curve: "0x0000000000000000000000000000000000000002",
          creator: address ?? "0x0000000000000000000000000000000000000003",
          name,
          symbol: symbol.toUpperCase(),
          description,
        });
        router.push(`/${clean}`);
        return;
      }
      const hash = await writeContractAsync({
        address: addresses.factory,
        abi: factoryAbi,
        functionName: "create",
        args: [name, symbol.toUpperCase(), clean],
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      let token = addresses.factory;
      let curve = addresses.factory;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({ abi: factoryAbi, data: log.data, topics: log.topics });
          if (decoded.eventName === "Created") {
            token = decoded.args.token;
            curve = decoded.args.curve;
          }
        } catch {
          // ignore unrelated logs
        }
      }
      await saveSite({
        slug: clean,
        token,
        curve,
        creator: address,
        name,
        symbol: symbol.toUpperCase(),
        description,
      });
      router.push(`/${clean}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    }
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-5 sm:py-16">
      <p className="eyebrow">About five minutes</p>
      <h1 className="mt-3 font-display text-[32px] leading-tight text-forest sm:text-4xl">Put a curve on a page</h1>
      <ol className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-rule pb-4">
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <li
              key={label}
              className={`font-ui text-[12px] tracking-[0.08em] ${n === step ? "text-forest" : "text-mist"}`}
            >
              <span className="text-sun">{String(n).padStart(2, "0")}</span> {label}
            </li>
          );
        })}
      </ol>

      {!isConnected && (
        <div className="mt-10">
          <p className="font-body text-lg text-ink/80">Need a wallet on Robinhood Chain first.</p>
          <div className="mt-5">
            <WalletButton />
          </div>
        </div>
      )}

      {isConnected && step === 1 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-forest">Pick a plan</h2>
          <p className="mt-2 text-ink/70">This is the only thing you pay us. Trades don’t get a fee on top.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { id: 0, label: "Monthly", price: "0.05 ETH", detail: "30 days" },
              { id: 1, label: "Yearly", price: "0.45 ETH", detail: "365 days" },
            ].map((plan) => (
              <button
                key={plan.id}
                onClick={() => setPlanId(plan.id)}
                className={`frame p-5 text-left ${planId === plan.id ? "border-forest bg-cream" : ""}`}
              >
                <div className="font-ui text-[11px] uppercase tracking-[0.14em] text-mist">{plan.label}</div>
                <div className="mt-2 font-display text-2xl text-forest">{plan.price}</div>
                <div className="mt-1 text-sm text-mist">{plan.detail}</div>
              </button>
            ))}
          </div>
          {active && <p className="mt-4 text-sm text-moss">Subscription already active.</p>}
          <button className="btn-primary mt-8 w-full sm:w-auto" onClick={active ? () => setStep(2) : subscribe} disabled={isPending}>
            {active ? "Continue" : isPending ? "Confirm in wallet" : "Subscribe"}
          </button>
        </div>
      )}

      {isConnected && step === 2 && (
        <div className="mt-10 space-y-5">
          <h2 className="font-display text-2xl text-forest">Name and slug</h2>
          <label className="block">
            <span className="label">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="Moss" />
          </label>
          <label className="block">
            <span className="label">Ticker</span>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={12} placeholder="MOSS" />
          </label>
          <label className="block">
            <span className="label">Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={32} placeholder="moss" />
          </label>
          <label className="block">
            <span className="label">About</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </label>
          <button className="btn-primary w-full sm:w-auto" onClick={() => setStep(3)} disabled={!name || !symbol || !slug}>
            Next
          </button>
        </div>
      )}

      {isConnected && step === 3 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-forest">Go live</h2>
          <p className="mt-3 text-lg text-ink/75">
            {name} (${symbol.toUpperCase()}) will show up at {publicUrl(slug)}. Right now that’s a preview
            page — not a live market. Make your own if you want one. Don’t treat other people’s slugs as
            real.
          </p>
          <button className="btn-primary mt-8 w-full sm:w-auto" onClick={deploy} disabled={isPending}>
            {isPending ? "Deploying…" : "Deploy"}
          </button>
        </div>
      )}

      {error && <p className="mt-6 text-sm text-bark">{error}</p>}
    </div>
  );
}
