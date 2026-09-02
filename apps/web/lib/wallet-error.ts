export function friendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const msg = raw.toLowerCase();
  if (msg.includes("user rejected") || msg.includes("user denied") || msg.includes("rejected the request")) {
    return "Cancelled in the wallet.";
  }
  if (msg.includes("insufficient funds") || msg.includes("exceeds the balance") || msg.includes("insufficient balance")) {
    return "Not enough ETH on Robinhood Chain. Monthly is 0.05 ETH plus a little gas.";
  }
  if (msg.includes("wrongprice")) return "Wrong amount. Monthly is 0.05 ETH, yearly is 0.45 ETH.";
  if (msg.includes("notsubscribed")) return "Subscribe first, then deploy the page.";
  if (msg.includes("slugtaken")) return "That slug is taken.";
  if (msg.includes("invalidslug") || msg.includes("invalidname")) return "Use a shorter name or a simpler slug (letters, numbers, dashes).";
  if (msg.includes("connector") && (msg.includes("not found") || msg.includes("provider"))) {
    return "No browser wallet found. Install Rabby or MetaMask, then refresh.";
  }
  if (raw.length > 160 || /0x[0-9a-f]{64}/i.test(raw)) {
    return "Transaction failed. Check the wallet prompt and try again.";
  }
  return raw;
}
