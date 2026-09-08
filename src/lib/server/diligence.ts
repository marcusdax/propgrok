import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { aiProvider } from "@/lib/server/ai-provider";
import type { DiligenceClaim, DiligenceRun, Dossier, NeighborhoodIntel, RiskItem, SourceRecord } from "@/lib/types";
import { id } from "@/lib/utils";
import { evidenceGate } from "@/lib/diligence-policy";

const severity = z.enum(["low", "moderate", "high", "critical"]);
const modelMemoSchema = z.object({
  memo: z.string().min(80).max(1_400),
  risks: z.array(z.object({ label: z.string().max(120), severity, detail: z.string().max(400) })).max(5),
  requests: z.array(z.string().max(240)).max(8),
});

function source(id: string, label: string, kind: SourceRecord["kind"], status: SourceRecord["status"], detail: string): SourceRecord {
  return { id, label, kind, accessedAt: new Date().toISOString(), status, detail };
}

function buildEvidence(dossier: Dossier, neighborhood: NeighborhoodIntel | null) {
  const sources: SourceRecord[] = [
    source("location", "OpenStreetMap location and amenity context", "public", "available", "Parcel location and mapped amenities are available."),
    source("deterministic", "PropGrok deterministic underwriting model", "deterministic_model", "available", "Value range and renovation plays are modeled screening inputs, not appraisal or comp evidence."),
    source("sales", "Verified comparable sales", "public", "unavailable", "No licensed or assessor-backed comparable-sale feed is connected."),
    source("rent", "Verified rent and vacancy evidence", "public", "unavailable", "No rent-comp or vacancy feed is connected."),
    source("tax", "Assessor tax and ownership record", "public", "unavailable", "No parcel assessor connector is attached."),
    source("zoning", "Municipal zoning and permit record", "public", "unavailable", "No municipal zoning parser is attached."),
    source("hazard", "Parcel-level hazard and insurance evidence", "public", "unavailable", "No parcel-level FEMA, insurance, or claims feed is connected."),
  ];
  if (neighborhood?.census) {
    sources.push(source("census", `${neighborhood.census.source} ${neighborhood.census.vintage}`, "public", "available", `ZIP-level profile for ${neighborhood.census.geography}.`));
  }

  const claims: DiligenceClaim[] = [
    {
      id: "location",
      label: "Location and amenity context",
      value: `${dossier.pin.city}, ${dossier.pin.state}`,
      status: "verified",
      sourceIds: ["location"],
      confidence: 0.8,
      detail: "Location is geocoded; mapped amenity context is directional only.",
    },
    {
      id: "value",
      label: "Modeled value range",
      value: `$${dossier.valuation.low.toLocaleString()}-$${dossier.valuation.high.toLocaleString()}`,
      status: "inferred",
      sourceIds: ["deterministic"],
      confidence: dossier.valuation.confidence,
      detail: "Screening output. It cannot substitute for verified comps, condition, tax, or title review.",
    },
    {
      id: "renovation",
      label: "Top renovation play",
      value: dossier.plays[0]?.label ?? "Unavailable",
      status: "inferred",
      sourceIds: ["deterministic"],
      confidence: 0.55,
      detail: "Prioritized from a deterministic local-cost model; obtain contractor bids before use in an offer.",
    },
    {
      id: "demographics",
      label: "Demographic context",
      value: neighborhood?.census?.medianIncome != null ? `$${neighborhood.census.medianIncome.toLocaleString()} median household income` : "No verified profile attached",
      status: neighborhood?.census ? "verified" : "missing",
      sourceIds: neighborhood?.census ? ["census"] : [],
      confidence: neighborhood?.census ? 0.72 : null,
      detail: neighborhood?.census ? "ZIP-level ACS context, not a parcel-specific tenant or buyer measure." : "Connect Census data or validate the location ZIP.",
    },
    ...["sales", "rent", "tax", "zoning", "hazard"].map((key) => ({
      id: key,
      label: sources.find((item) => item.id === key)?.label ?? key,
      value: "Missing",
      status: "missing" as const,
      sourceIds: [key],
      confidence: null,
      detail: sources.find((item) => item.id === key)?.detail ?? "Evidence is missing.",
    })),
  ];
  return { sources, claims };
}

function baselineRun(dossier: Dossier, neighborhood: NeighborhoodIntel | null): DiligenceRun {
  const { sources, claims } = buildEvidence(dossier, neighborhood);
  const missing = claims.filter((claim) => claim.status === "missing");
  const gate = evidenceGate(claims);
  const requests = [
    "Pull three to five closed comparable sales adjusted for condition, size, and date.",
    "Verify current taxes, exemptions, ownership, liens, and title exceptions from assessor and title sources.",
    "Obtain rent comps, vacancy evidence, and an insurance quote before setting an acquisition ceiling.",
    "Confirm zoning, permitted use, ADU/STR restrictions, and required permits with the municipality.",
    "Order parcel-level flood, wind, hail, wildfire, and insurability review.",
  ];
  const risks: RiskItem[] = [
    ...dossier.risks.slice(0, 3),
    ...missing.slice(0, 3).map((claim) => ({ label: claim.label, severity: "high" as const, detail: claim.detail })),
  ];
  return {
    id: id("diligence"),
    createdAt: new Date().toISOString(),
    status: gate.blocked ? "blocked" : "ready_for_human_review",
    recommendation: gate.recommendation,
    memo: `${dossier.pin.address} is a preliminary screening candidate, not an offer-ready acquisition. The deterministic model identifies ${dossier.plays[0]?.label.toLowerCase() ?? "a cosmetic reset"} as the lowest-cost modeled value-add, but the modeled value range and ROI have not been validated by sales, tax, rent, zoning, or parcel-level hazard evidence. Advance only after the requested evidence is collected and reviewed by the investor.`,
    risks,
    requests,
    claims,
    sources,
  };
}

export const createDiligenceRun = createServerFn({ method: "POST" })
  .validator((input: { dossier: Dossier; neighborhood: NeighborhoodIntel | null; mode?: "public" | "sensitive" }) => ({
    dossier: z.custom<Dossier>().parse(input.dossier),
    neighborhood: z.custom<NeighborhoodIntel | null>().parse(input.neighborhood),
    mode: z.enum(["public", "sensitive"]).default("public").parse(input.mode),
  }))
  .handler(async ({ data }) => {
    const run = baselineRun(data.dossier, data.neighborhood);
    const factualClaims = run.claims
      .filter((claim) => claim.status === "verified" || claim.status === "inferred")
      .map((claim) => `${claim.label}: ${claim.value} (${claim.status}; ${claim.detail})`)
      .join("\n");
    const ai = await aiProvider.runStructured({
      mode: data.mode,
      profile: "smart",
      system:
        "You are an acquisition-diligence analyst. Use only the supplied evidence. Do not invent facts, comps, prices, permits, hazard conditions, or claims. Return concise JSON. Every recommendation must preserve the stated uncertainty.",
      prompt: `Property: ${data.dossier.pin.address}, ${data.dossier.pin.city}, ${data.dossier.pin.state}\n\nEvidence:\n${factualClaims}\n\nCritical gaps:\n${run.claims
        .filter((claim) => claim.status === "missing")
        .map((claim) => `- ${claim.label}: ${claim.detail}`)
        .join("\n")}`,
      schema: modelMemoSchema,
    });
    if (!ai.ok) {
      return { ok: true as const, run: { ...run, status: "degraded" as const, providerNotice: ai.reason } };
    }
    return {
      ok: true as const,
      run: {
        ...run,
        memo: ai.value.memo,
        risks: [...run.risks, ...ai.value.risks].slice(0, 8),
        requests: [...new Set([...ai.value.requests, ...run.requests])].slice(0, 8),
        modelRun: ai.provenance,
      },
    };
  });
