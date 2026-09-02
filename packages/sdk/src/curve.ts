export function quoteBuy(
  phantomQuote: bigint,
  realQuote: bigint,
  tokenReserve: bigint,
  quoteIn: bigint,
): bigint {
  if (quoteIn === 0n || tokenReserve === 0n) return 0n;
  const virtualQuote = phantomQuote + realQuote;
  return (tokenReserve * quoteIn) / (virtualQuote + quoteIn);
}

export function quoteSell(
  phantomQuote: bigint,
  realQuote: bigint,
  tokenReserve: bigint,
  tokensIn: bigint,
): bigint {
  if (tokensIn === 0n || tokenReserve === 0n) return 0n;
  const virtualQuote = phantomQuote + realQuote;
  return (virtualQuote * tokensIn) / (tokenReserve + tokensIn);
}

export function spotPrice(phantomQuote: bigint, realQuote: bigint, tokenReserve: bigint): bigint {
  if (tokenReserve === 0n) return 0n;
  return ((phantomQuote + realQuote) * 10n ** 18n) / tokenReserve;
}

export function normalizeSlug(slug: string): string {
  const next = slug.trim().toLowerCase();
  if (!/^[a-z0-9]([a-z0-9-]{1,30}[a-z0-9])$/.test(next)) {
    throw new Error("Invalid slug");
  }
  return next;
}
