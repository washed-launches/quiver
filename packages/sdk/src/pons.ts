import { PONS_APP, PONS_FACTORY } from "./chains";

export type PonsPhase = "curve" | "graduated" | "unknown";

export function ponsTradeUrl(token?: string): string {
  if (!token || token === "0x0000000000000000000000000000000000000000") {
    return PONS_APP;
  }
  return `${PONS_APP}/token/${token}`;
}

export function resolvePonsVenue(phase: number, exists: boolean): PonsPhase {
  if (!exists) return "unknown";
  if (phase === 0) return "curve";
  return "graduated";
}

export { PONS_FACTORY };
