"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain } from "@/lib/wagmi";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  if (!isConnected) {
    return (
      <button
        className="pixel-btn-sun"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
      >
        {isPending ? "Opening..." : "Connect"}
      </button>
    );
  }

  if (chainId !== robinhoodChain.id) {
    return (
      <button className="pixel-btn-sun" onClick={() => switchChain({ chainId: robinhoodChain.id })}>
        Switch to Robinhood
      </button>
    );
  }

  return (
    <button className="pixel-btn" onClick={() => disconnect()}>
      {address?.slice(0, 6)}…{address?.slice(-4)}
    </button>
  );
}
