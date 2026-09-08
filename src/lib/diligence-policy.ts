import type { DiligenceClaim } from "@/lib/types";

const criticalClaimIds = new Set(["sales", "rent", "tax", "zoning", "hazard"]);

export function evidenceGate(claims: DiligenceClaim[]) {
  const blockers = claims.filter((claim) => criticalClaimIds.has(claim.id) && claim.status !== "verified");
  return {
    blocked: blockers.length > 0,
    blockers,
    recommendation: blockers.length > 0 ? "Blocked pending critical diligence" : "Ready for human underwriting review",
  };
}
