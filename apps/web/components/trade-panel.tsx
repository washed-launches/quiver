"use client";

import { curveAbi, erc20Abi } from "@quiver/sdk";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import type { SiteRecord } from "@/lib/api";
import { friendlyError } from "@/lib/wallet-error";
import { contractsLive } from "@/lib/site";
import { WalletButton } from "./wallet-button";
import { wagmiConfig } from "@/lib/wagmi";

export function TradePanel({ site }: { site: SiteRecord }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState("");
  const curve = site.curve as `0x${string}`;
  const token = site.token as `0x${string}`;

  const { data: quote } = useReadContract({
    address: curve,
    abi: curveAbi,
    functionName: side === "buy" ? "quoteBuy" : "quoteSell",
    args: amount && Number(amount) > 0 ? [parseEther(amount)] : undefined,
    query: { enabled: curve.startsWith("0x") && curve.length === 42 && Number(amount) > 0 },
  });

  const { data: fee } = useReadContract({
    address: curve,
    abi: curveAbi,
    functionName: "PROTOCOL_FEE_BPS",
    query: { enabled: curve.startsWith("0x") && curve.length === 42 },
  });

  async function trade() {
    if (!address) return;
    setStatus("");
    try {
      const value = parseEther(amount);
      let hash: `0x${string}`;
      if (side === "buy") {
        hash = await writeContractAsync({
          address: curve,
          abi: curveAbi,
          functionName: "buy",
          args: [0n, address],
          value,
        });
      } else {
        await writeContractAsync({
          address: token,
          abi: erc20Abi,
          functionName: "approve",
          args: [curve, value],
        });
        hash = await writeContractAsync({
          address: curve,
          abi: curveAbi,
          functionName: "sell",
          args: [value, 0n, address],
        });
      }
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await fetch("/api/index/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: site.slug,
          side,
          actor: address,
          quote: side === "buy" ? value.toString() : (quote ?? 0n).toString(),
          tokens: side === "buy" ? (quote ?? 0n).toString() : value.toString(),
          txHash: hash,
        }),
      });
      setStatus("Filled.");
    } catch (err) {
      setStatus(friendlyError(err));
    }
  }

  return (
    <section className="frame p-6">
      <div className="flex gap-2">
        <button className={`${side === "buy" ? "btn-primary" : "btn-secondary"} flex-1`} onClick={() => setSide("buy")}>
          Buy
        </button>
        <button className={`${side === "sell" ? "btn-primary" : "btn-secondary"} flex-1`} onClick={() => setSide("sell")}>
          Sell
        </button>
      </div>
      {!contractsLive() && (
        <p className="mb-4 text-sm leading-6 text-bark">
          Preview. This button won’t hit a real curve. Make your own site if you want to trade for real.
        </p>
      )}
      <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.14em] text-mist">
        Protocol fee {fee === undefined ? "0 bps" : `${fee} bps`}
      </p>
      <label className="mt-5 block">
        <span className="label">{side === "buy" ? "ETH in" : "Tokens in"}</span>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <p className="mt-3 text-sm text-mist">
        Est. out {quote !== undefined ? formatEther(quote) : "—"} {side === "buy" ? site.symbol : "ETH"}
      </p>
      {!isConnected ? (
        <div className="mt-6">
          <WalletButton />
        </div>
      ) : (
        <button className="btn-primary mt-6 w-full" onClick={trade} disabled={isPending}>
          {isPending ? "Confirm…" : side === "buy" ? `Buy ${site.symbol}` : `Sell ${site.symbol}`}
        </button>
      )}
      {status && <p className="mt-3 text-sm">{status}</p>}
    </section>
  );
}
