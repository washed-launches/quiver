"use client";

import { subscriptionAbi } from "@quiver/sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { addresses, isDeployed } from "@/lib/addresses";
import { fetchCreatorSites, saveSite, type SiteRecord, verifyDomain } from "@/lib/api";
import { WalletButton } from "@/components/wallet-button";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [host, setHost] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [message, setMessage] = useState("");

  const { data: expires } = useReadContract({
    address: addresses.subscription,
    abi: subscriptionAbi,
    functionName: "expiresAt",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && isDeployed(addresses.subscription) },
  });

  useEffect(() => {
    if (!address) return;
    fetchCreatorSites(address).then(setSites);
  }, [address]);

  async function onVerify() {
    if (!selected || !host) return;
    const result = await verifyDomain(selected, host);
    setMessage(result.dns?.ok ? "CNAME verified." : `Not pointing yet. Target ${result.dns?.target ?? "sites.quiver.app"}`);
    if (address) setSites(await fetchCreatorSites(address));
  }

  async function onSave(site: SiteRecord) {
    await saveSite(site);
    setMessage("Branding saved.");
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 pixel-panel p-8 mt-10">
        <h1 className="font-pixel text-2xl text-forest">Your site</h1>
        <p className="mt-3">Connect to manage branding and custom domains.</p>
        <div className="mt-4">
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-pixel text-3xl text-forest">Dashboard</h1>
      <div className="pixel-panel mt-6 p-5">
        <p className="font-pixel text-[10px] text-moss">Subscription</p>
        <p className="mt-2">
          {expires && expires > 0n
            ? `Active until ${new Date(Number(expires) * 1000).toLocaleString()}`
            : "No on-chain subscription detected in this environment."}
        </p>
        <Link href="/launch" className="pixel-btn-sun mt-4 inline-block">
          Extend / launch
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {sites.length === 0 && (
          <p className="pixel-panel p-5">No sites yet. Launch one in three clicks.</p>
        )}
        {sites.map((site) => (
          <article key={site.slug} className="pixel-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-sm">
                {site.name} <span className="text-mist">/{site.slug}</span>
              </h2>
              <Link href={`/s/${site.slug}`} className="underline">
                Open
              </Link>
            </div>
            <textarea
              defaultValue={site.description}
              onBlur={(e) => onSave({ ...site, description: e.target.value })}
              rows={3}
            />
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                placeholder="trade.yoursite.com"
                defaultValue={site.hostname}
                onChange={(e) => {
                  setSelected(site.slug);
                  setHost(e.target.value);
                }}
              />
              <button className="pixel-btn" onClick={onVerify}>
                Verify CNAME
              </button>
            </div>
            <p className="text-sm text-mist">
              Point a CNAME to <code>sites.quiver.app</code>. Status:{" "}
              {site.hostnameVerified ? "verified" : "waiting"}
            </p>
          </article>
        ))}
      </div>
      {message && <p className="mt-4 text-moss">{message}</p>}
    </div>
  );
}
