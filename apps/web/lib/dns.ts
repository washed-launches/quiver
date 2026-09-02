import { resolveCname, resolve4 } from "node:dns/promises";

const EDGE = process.env.QUIVER_EDGE_HOST ?? process.env.NEXT_PUBLIC_SITE_HOST ?? "quiver.diy";

export async function verifyCname(hostname: string): Promise<{ ok: boolean; records: string[]; target: string }> {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  try {
    const records = await resolveCname(host);
    const normalized = records.map((r) => r.toLowerCase().replace(/\.$/, ""));
    const ok = normalized.some((r) => r === EDGE || r.endsWith(`.${EDGE}`));
    return { ok, records: normalized, target: EDGE };
  } catch {
    try {
      const a = await resolve4(host);
      return { ok: false, records: a, target: EDGE };
    } catch {
      return { ok: false, records: [], target: EDGE };
    }
  }
}
