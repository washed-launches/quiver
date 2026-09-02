"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain } from "@/lib/wagmi";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [hint, setHint] = useState("");

  if (!isConnected) {
    return (
      <div>
        <button
          className="btn-primary whitespace-nowrap"
          onClick={() => {
            const connector = connectors[0];
            if (!connector) {
              setHint("No browser wallet found. Install Rabby or MetaMask, then refresh.");
              return;
            }
            setHint("");
            connect({ connector });
          }}
          disabled={isPending}
        >
          {isPending ? "Opening…" : "Connect"}
        </button>
        {(hint || error) && (
          <p className="mt-2 max-w-xs font-ui text-[12px] leading-5 text-bark">
            {hint ||
              (error?.message.toLowerCase().includes("connector")
                ? "No browser wallet found. Install Rabby or MetaMask, then refresh."
                : "Wallet did not open. Check that an extension is installed and unlocked.")}
          </p>
        )}
      </div>
    );
  }

  if (chainId !== robinhoodChain.id) {
    return (
      <button className="btn-primary whitespace-nowrap px-3" onClick={() => switchChain({ chainId: robinhoodChain.id })}>
        Switch network
      </button>
    );
  }

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <button
      type="button"
      className="btn-secondary whitespace-nowrap px-3"
      onClick={() => disconnect()}
      title="Disconnect wallet"
      aria-label={`Disconnect wallet ${short}`}
    >
      Disconnect {short}
    </button>
  );
}
