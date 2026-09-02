"use client";

import { factoryAbi, normalizeSlug, subscriptionAbi } from "@quiver/sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { decodeEventLog, parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { addresses, isDeployed } from "@/lib/addresses";
import { saveSite } from "@/lib/api";
import { WalletButton } from "@/components/wallet-button";
import { wagmiConfig } from "@/lib/wagmi";

const PLAN_PRICE = [parseEther("0.05"), parseEther("0.45")] as const;

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
      setError("Contracts are not deployed in this environment yet. You can still preview the flow.");
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
        router.push(`/s/${clean}`);
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
      router.push(`/s/${clean}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="font-pixel text-[10px] text-moss">Three clicks</p>
      <h1 className="mt-2 font-pixel text-3xl text-forest">Launch your site</h1>
      <div className="mt-6 flex gap-2 font-pixel text-[10px]">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`px-3 py-1 pixel-border ${step === n ? "bg-sun" : "bg-parchment"}`}
          >
            {n === 1 ? "Subscribe" : n === 2 ? "Name it" : "Deploy"}
          </span>
        ))}
      </div>

      {!isConnected && (
        <div className="pixel-panel mt-8 p-6">
          <p className="font-body">Connect a wallet on Robinhood Chain to begin.</p>
          <div className="mt-4">
            <WalletButton />
          </div>
        </div>
      )}

      {isConnected && step === 1 && (
        <div className="pixel-panel mt-8 p-6">
          <h2 className="font-pixel text-sm">1. Pay for the tooling</h2>
          <p className="mt-3">ETH goes to the buyback. Nothing is taken from later trades.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { id: 0, label: "Monthly", price: "0.05 ETH", detail: "30 days" },
              { id: 1, label: "Yearly", price: "0.45 ETH", detail: "365 days" },
            ].map((plan) => (
              <button
                key={plan.id}
                onClick={() => setPlanId(plan.id)}
                className={`p-4 text-left pixel-border ${planId === plan.id ? "bg-sun" : "bg-parchment"}`}
              >
                <div className="font-pixel text-xs">{plan.label}</div>
                <div className="mt-2 font-body text-xl">{plan.price}</div>
                <div className="text-sm text-mist">{plan.detail}</div>
              </button>
            ))}
          </div>
          {active && <p className="mt-4 text-moss">You already have a live subscription.</p>}
          <button className="pixel-btn-sun mt-6" onClick={active ? () => setStep(2) : subscribe} disabled={isPending}>
            {active ? "Continue" : isPending ? "Confirm in wallet" : "Subscribe"}
          </button>
        </div>
      )}

      {isConnected && step === 2 && (
        <div className="pixel-panel mt-8 space-y-4 p-6">
          <h2 className="font-pixel text-sm">2. Name the token</h2>
          <label className="block">
            <span className="font-pixel text-[10px]">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="Moss" />
          </label>
          <label className="block">
            <span className="font-pixel text-[10px]">Ticker</span>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={12} placeholder="MOSS" />
          </label>
          <label className="block">
            <span className="font-pixel text-[10px]">Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={32} placeholder="moss" />
          </label>
          <label className="block">
            <span className="font-pixel text-[10px]">About</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </label>
          <button className="pixel-btn-sun" onClick={() => setStep(3)} disabled={!name || !symbol || !slug}>
            Next
          </button>
        </div>
      )}

      {isConnected && step === 3 && (
        <div className="pixel-panel mt-8 p-6">
          <h2 className="font-pixel text-sm">3. Deploy the curve</h2>
          <p className="mt-3">
            {name} ({symbol.toUpperCase()}) goes live at /s/{slug.toLowerCase()}. Protocol fee stays 0.
          </p>
          <button className="pixel-btn-sun mt-6" onClick={deploy} disabled={isPending}>
            {isPending ? "Deploying..." : "Deploy"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-bark">{error}</p>}
    </div>
  );
}
