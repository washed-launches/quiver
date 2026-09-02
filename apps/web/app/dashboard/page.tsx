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
    setMessage("Saved.");
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-[560px] px-5 py-20">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 font-display text-4xl text-forest">Your site</h1>
        <p className="mt-4 text-lg text-ink/70">Connect the wallet that launched the site.</p>
        <div className="mt-6">
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-16">
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-3 font-display text-4xl text-forest">Your sites</h1>

      <section className="mt-10 border-t border-rule pt-8">
        <p className="label">Subscription</p>
        <p className="mt-1 text-ink/80">
          {expires && expires > 0n
            ? `Active until ${new Date(Number(expires) * 1000).toLocaleString()}`
            : "No subscription on this wallet yet."}
        </p>
        <Link href="/launch" className="btn-primary mt-5 inline-flex">
          Extend / launch
        </Link>
      </section>

      <div className="mt-12 space-y-8">
        {sites.length === 0 && (
          <p className="border-t border-rule pt-8 text-ink/60">No sites yet.</p>
        )}
        {sites.map((site) => (
          <article key={site.slug} className="border-t border-rule pt-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl text-forest">
                {site.name}{" "}
                <span className="font-ui text-sm tracking-wide text-mist">/{site.slug}</span>
              </h2>
              <Link href={`/s/${site.slug}`} className="font-ui text-[12px] text-moss hover:underline">
                Open
              </Link>
            </div>
            <textarea
              className="mt-4"
              defaultValue={site.description}
              onBlur={(e) => onSave({ ...site, description: e.target.value })}
              rows={3}
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                placeholder="trade.yoursite.com"
                defaultValue={site.hostname}
                onChange={(e) => {
                  setSelected(site.slug);
                  setHost(e.target.value);
                }}
              />
              <button className="btn-secondary" onClick={onVerify}>
                Verify CNAME
              </button>
            </div>
            <p className="mt-3 font-ui text-[12px] text-mist">
              CNAME → sites.quiver.app · {site.hostnameVerified ? "verified" : "waiting"}
            </p>
          </article>
        ))}
      </div>
      {message && <p className="mt-6 text-sm text-moss">{message}</p>}
    </div>
  );
}
