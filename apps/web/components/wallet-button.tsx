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
      <button className="btn-primary" onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
        {isPending ? "Opening…" : "Connect"}
      </button>
    );
  }

  if (chainId !== robinhoodChain.id) {
    return (
      <button className="btn-primary" onClick={() => switchChain({ chainId: robinhoodChain.id })}>
        Switch network
      </button>
    );
  }

  return (
    <button className="btn-secondary" onClick={() => disconnect()}>
      {address?.slice(0, 6)}…{address?.slice(-4)}
    </button>
  );
}
