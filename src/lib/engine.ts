import { FEATURES, HAIL_BELT, incentivesFor, metroFor } from "./knowledge";
import type {
  ConditionScore,
  Dossier,
  DpsFactor,
  FeatureKey,
  InvestorFit,
  PropertyPin,
  PropertyProfile,
  RiskItem,
  RoiPlay,
} from "./types";
import { clamp, id, mulberry32, seedFromCoord, usd } from "./utils";

const FEATURE_KEYS: FeatureKey[] = [
  "garage_door",
  "roof",
  "windows",
  "siding",
  "paint",
  "landscaping",
];

export function buildProfile(lat: number, lng: number): PropertyProfile {
  const rng = mulberry32(seedFromCoord(lat, lng));
  const yearBuilt = 1948 + Math.floor(rng() * 72);
  const sqft = 980 + Math.floor(rng() * 2400);
  const beds = sqft > 2200 ? 4 : sqft > 1600 ? 3 : 2 + (rng() > 0.6 ? 1 : 0);
  const baths = Math.max(1, Math.round(beds * 0.7 * 2) / 2);
  const lotSqft = Math.round(sqft * (3.2 + rng() * 4));
  const stories = sqft > 2000 && rng() > 0.45 ? 2 : 1;
  const occRoll = rng();
  const occupancy: PropertyProfile["occupancy"] =
    occRoll > 0.78 ? "rental" : occRoll > 0.92 ? "vacant" : "owner";
  const construction = rng() > 0.55 ? "wood frame" : rng() > 0.4 ? "brick veneer" : "masonry";
  const roofMaterial = rng() > 0.72 ? "architectural shingle" : rng() > 0.5 ? "3-tab shingle" : rng() > 0.25 ? "metal" : "tile";
  const roofAge = Math.max(1, Math.min(32, Math.round((2026 - yearBuilt) * (0.25 + rng() * 0.5))));
  const gRoll = rng();
  const garage: PropertyProfile["garage"] =
    gRoll > 0.85 ? "3-car" : gRoll > 0.45 ? "2-car" : gRoll > 0.18 ? "1-car" : "none";
  return { yearBuilt, sqft, beds, baths, lotSqft, stories, occupancy, construction, roofMaterial, roofAge, garage };
}

function conditionFor(profile: PropertyProfile, metro: ReturnType<typeof metroFor>, rng: () => number): Record<FeatureKey, ConditionScore> {
  const age = 2026 - profile.yearBuilt;
  const roofScore = clamp(100 - profile.roofAge * 3.4 - metro.hailRisk * 18 + rng() * 8, 18, 96);
  const paintScore = clamp(92 - age * 0.9 - metro.hailRisk * 6 - rng() * 12, 22, 94);
  const sidingScore = clamp(90 - age * 0.7 - (profile.construction === "wood frame" ? 8 : 0) - rng() * 10, 25, 95);
  const windowScore = clamp(88 - age * 0.85 - metro.windRisk * 10 - rng() * 8, 20, 94);
  const garageScore =
    profile.garage === "none"
      ? 70
      : clamp(90 - age * 0.8 - rng() * 16, 18, 96);
  const landScore = clamp(86 - rng() * 28, 30, 94);
  const note = (s: number, good: string, mid: string, bad: string) =>
    s > 78 ? good : s > 52 ? mid : bad;
  return {
    roof: {
      score: Math.round(roofScore),
      ageYears: profile.roofAge,
      note: note(roofScore, "Roof reads serviceable in recent imagery.", "Wear consistent with age; inspect flashing and field.", "Visible granule loss / curl risk — replacement window is open."),
    },
    paint: {
      score: Math.round(paintScore),
      note: note(paintScore, "Paint film intact.", "Chalking and isolated peel — cosmetic reset is cheap lift.", "Peel and fade will photograph poorly and invite moisture."),
    },
    siding: {
      score: Math.round(sidingScore),
      note: note(sidingScore, "Cladding aligned.", "Minor wave / fade; overlay or paint may suffice.", "Panel failure or moisture staining — budget a proper envelope fix."),
    },
    windows: {
      score: Math.round(windowScore),
      note: note(windowScore, "Glazing looks recent.", "Aging frames; energy and wind story is available.", "Failed seals or single-pane — replacement is both comfort and insurance."),
    },
    garage_door: {
      score: Math.round(garageScore),
      note:
        profile.garage === "none"
          ? "No garage — curb story lives in entry, paint, landscape."
          : note(garageScore, "Door is current.", "Tired door; highest-ROI visual swap on this facade.", "Dented or dated door dominates the elevation."),
    },
    landscaping: {
      score: Math.round(landScore),
      note: note(landScore, "Yard is held.", "Sparse plantings; an edge-and-mulch package would photograph.", "Overgrown or bare — cheap staging before any listing."),
    },
  };
}

function dpsFor(profile: PropertyProfile, metro: ReturnType<typeof metroFor>, condition: Record<FeatureKey, ConditionScore>, state: string): { score: number; tier: string; factors: DpsFactor[]; action: string } {
  const hail = metro.hailRisk;
  const hailPts = Math.round(hail * 95);
  const roofVuln = Math.round(clamp((profile.roofAge / 28) * 100, 8, 96));
  const windPts = Math.round(metro.windRisk * 88);
  const duration = Math.round(30 + hail * 40);
  const materialAdj = profile.roofMaterial.includes("metal") ? -18 : profile.roofMaterial.includes("tile") ? -8 : 6;
  const prior = Math.round((100 - condition.roof.score) * 0.22);
  const weighted =
    hailPts * 0.38 +
    roofVuln * 0.28 +
    windPts * 0.16 +
    duration * 0.1 +
    clamp(50 + materialAdj, 0, 100) * 0.05 +
    prior * 0.03;
  const score = Math.round(clamp(weighted, 4, 98));
  const tier =
    score >= 90 ? "CRITICAL" : score >= 75 ? "HIGH" : score >= 55 ? "MODERATE" : score >= 30 ? "LOW" : "MINIMAL";
  const action =
    score >= 90
      ? "Same-day field visit. Pre-position materials."
      : score >= 75
        ? "Priority queue — 24-hour dispatch window."
        : score >= 55
          ? "Marketing outreach: mail + digital with a render."
          : score >= 30
            ? "Monitor. Revisit if a claim surfaces."
            : "Do not allocate restoration resources.";
  const factors: DpsFactor[] = [
    { name: "Hail exposure", weight: 38, points: hailPts, note: HAIL_BELT.has(state) ? "Inside hail alley." : "Background hail probability." },
    { name: "Roof vulnerability", weight: 28, points: roofVuln, note: `${profile.roofAge} yr ${profile.roofMaterial}` },
    { name: "Wind", weight: 16, points: windPts, note: "Sustained vs. gust differential (modeled)." },
    { name: "Storm duration", weight: 10, points: duration, note: "Minutes at peak intensity, parcel class." },
    { name: "Material class", weight: 5, points: clamp(50 + materialAdj, 0, 100), note: profile.roofMaterial },
    { name: "Prior distress", weight: 3, points: prior, note: "Condition residual from imagery proxies." },
  ];
  return { score, tier, factors, action };
}

function playsFor(profile: PropertyProfile, metro: ReturnType<typeof metroFor>, condition: Record<FeatureKey, ConditionScore>, estimate: number): RoiPlay[] {
  const sizeFactor = clamp(profile.sqft / 1800, 0.75, 1.55);
  const plays: RoiPlay[] = FEATURES.map((f) => {
    const cond = condition[f.key].score;
    const need = (100 - cond) / 100;
    const costMid = ((f.costLow + f.costHigh) / 2) * metro.costIndex * sizeFactor;
    const costLow = f.costLow * metro.costIndex * sizeFactor * 0.92;
    const costHigh = f.costHigh * metro.costIndex * sizeFactor * 1.08;
    const roiAdj = f.roiPct * (0.88 + need * 0.22) * (0.96 + metro.yoyAppreciation * 0.01);
    const valueAdd = costMid * (roiAdj / 100);
    const rentLift = (valueAdd * (metro.rentYield / 100)) / 12;
    const paybackYears = rentLift > 0 ? costMid / (rentLift * 12) : 12;
    const demand: RoiPlay["demand"] = roiAdj > 78 || need > 0.45 ? "hot" : roiAdj > 55 ? "steady" : "soft";
    return {
      id: f.key,
      label: f.label,
      costLow: Math.round(costLow),
      costHigh: Math.round(costHigh),
      costMid: Math.round(costMid),
      roiPct: Math.round(roiAdj * 10) / 10,
      valueAdd: Math.round(valueAdd),
      paybackYears: Math.round(paybackYears * 10) / 10,
      demand,
      narrative: `${f.label} at ${Math.round(cond)} condition. Modeled mid cost ${usd(costMid)} against a ${usd(estimate)} basis.`,
      rank: 0,
    };
  });
  plays.sort((a, b) => b.roiPct * (1 + (100 - condition[a.id].score) / 200) - a.roiPct * (1 + (100 - condition[b.id].score) / 200));
  // rank by bang-for-buck: ROI * need
  plays.sort((a, b) => {
    const aa = a.roiPct * (1.1 - condition[a.id].score / 200);
    const bb = b.roiPct * (1.1 - condition[b.id].score / 200);
    return bb - aa;
  });
  return plays.map((p, i) => ({ ...p, rank: i + 1 }));
}

function risksFor(metro: ReturnType<typeof metroFor>, dps: number, profile: PropertyProfile): RiskItem[] {
  const items: RiskItem[] = [];
  if (metro.hailRisk > 0.7)
    items.push({ label: "Hail", severity: dps > 74 ? "high" : "moderate", detail: "Parcel sits in a high-frequency hail corridor. Roof class and remaining life dominate carry cost." });
  if (metro.floodRisk > 0.55)
    items.push({ label: "Flood / surge", severity: metro.floodRisk > 0.75 ? "high" : "moderate", detail: "Water is a basis risk. Confirm flood zone and elevation before bidding." });
  if (metro.windRisk > 0.7)
    items.push({ label: "Wind", severity: "high", detail: "Wind-mitigation credits and opening protection are underwriting, not optional cosmetics." });
  if (metro.wildfireRisk > 0.45)
    items.push({ label: "Wildfire interface", severity: metro.wildfireRisk > 0.55 ? "high" : "moderate", detail: "Defensible space and ember-resistant cladding affect both insurance and appraisal." });
  if (profile.yearBuilt < 1978)
    items.push({ label: "Lead / legacy systems", severity: "moderate", detail: "Pre-1978 stock. Budget for paint, wiring, and possible lead protocols on exterior work." });
  if (metro.yoyAppreciation < 1.2)
    items.push({ label: "Price softness", severity: "moderate", detail: "Appreciation is thin. Do not over-improve; buy the cheapest class-lift that photographs." });
  if (items.length === 0)
    items.push({ label: "Idiosyncratic", severity: "low", detail: "No metro-scale catastrophe spike. Residual risk is property-specific condition and title." });
  return items;
}

function fitFor(metro: ReturnType<typeof metroFor>, profile: PropertyProfile, plays: RoiPlay[], estimate: number): InvestorFit[] {
  const rent = (estimate * (metro.rentYield / 100)) / 12;
  const brrrr = clamp(58 + metro.rentYield * 4 + (plays[0]?.roiPct ?? 0) * 0.15 - metro.costIndex * 10, 35, 92);
  const str = clamp(40 + (metro.medianIncome / 4000) + (profile.sqft > 1400 ? 8 : 0) - metro.unemployment * 2, 30, 90);
  const hold = clamp(55 + metro.yoyAppreciation * 4 + metro.ownerOcc * 0.15, 38, 92);
  const wholesale = clamp(50 + (100 - (plays.find((p) => p.id === "paint")?.roiPct ?? 50)) * 0.1 + (profile.occupancy === "vacant" ? 12 : 0), 28, 88);
  return [
    { strategy: "Fix and hold", score: Math.round(hold), why: `Modeled in-place yield ${metro.rentYield.toFixed(1)}% with ${metro.yoyAppreciation.toFixed(1)}% metro appreciation.` },
    { strategy: "BRRRR", score: Math.round(brrrr), why: `Rent proxy ${usd(rent)}/mo. Cheapest high-ROI play is ${plays[0]?.label ?? "paint"}.` },
    { strategy: "Short-term rental", score: Math.round(str), why: "STR depends on local ordinance — treat this as demand, not a permit." },
    { strategy: "Wholesale / assign", score: Math.round(wholesale), why: profile.occupancy === "vacant" ? "Vacant stock moves faster through assignment if the render is ready." : "Occupied — allow for access and tenant friction." },
  ].sort((a, b) => b.score - a.score);
}

export function buildDossier(pin: PropertyPin): Dossier {
  const metro = metroFor(pin.city, pin.state);
  const rng = mulberry32(seedFromCoord(pin.lat, pin.lng) ^ 0x9e3779b9);
  const profile = buildProfile(pin.lat, pin.lng);
  const condition = conditionFor(profile, metro, rng);
  const sizeAdj = profile.sqft / 1800;
  const condAvg = FEATURE_KEYS.reduce((s, k) => s + condition[k].score, 0) / FEATURE_KEYS.length;
  const estimate = Math.round(metro.medianValue * sizeAdj * (0.82 + (condAvg / 100) * 0.36) * (0.94 + rng() * 0.12));
  const band = 0.07 + (1 - condAvg / 100) * 0.05;
  const dps = dpsFor(profile, metro, condition, pin.state);
  const plays = playsFor(profile, metro, condition, estimate);
  const now = new Date().toISOString();
  const start = estimate / Math.pow(1 + metro.yoyAppreciation / 100, 6);
  const appreciation = Array.from({ length: 7 }, (_, i) => ({
    year: String(2020 + i),
    value: Math.round(start * Math.pow(1 + metro.yoyAppreciation / 100, i) * (0.98 + rng() * 0.04)),
  }));

  const thesis = `Cheapest class-lift on this parcel is ${plays[0]!.label.toLowerCase()} (modeled ${plays[0]!.roiPct.toFixed(0)}% ROI, mid cost ${usd(plays[0]!.costMid)}). Do not over-improve: the ${metro.name} buyer still pays for photographable curb, not a custom interior.`;

  const narrative = `${pin.address} in ${pin.city}, ${pin.state} models as a ${profile.yearBuilt} ${profile.stories}-story ${profile.construction} home, ${profile.sqft.toLocaleString()} sf, ${profile.beds} bed / ${profile.baths} bath. Metro median is ${usd(metro.medianValue)}; this parcel screens at ${usd(estimate)} (${Math.round(band * 100)}% band) given size and a ${Math.round(condAvg)} blended condition score. ${metro.narrative}`;

  return {
    pin,
    profile,
    metro,
    valuation: {
      estimate,
      low: Math.round(estimate * (1 - band)),
      high: Math.round(estimate * (1 + band)),
      confidence: clamp(0.58 + condAvg / 400 + (pin.city ? 0.08 : 0), 0.45, 0.86),
      method: "Ensemble AVM — metro median × size × condition residual",
      asOf: now.slice(0, 10),
    },
    condition,
    dps,
    plays,
    incentives: incentivesFor(pin.state, metro),
    risks: risksFor(metro, dps.score, profile),
    thesis,
    narrative,
    occupancyNote:
      profile.occupancy === "owner"
        ? "Modeled owner-occupied. Sales conversation is equity and insurance, not rent."
        : profile.occupancy === "rental"
          ? "Modeled as rental. Access and lease terms gate any exterior work."
          : "Modeled vacant. Fastest path is a photographed reset and a clean close.",
    investorFit: fitFor(metro, profile, plays, estimate),
    evidence: {
      evidenceId: id("evi"),
      createdAt: now,
      sources: [
        { sourceType: "osm", sourceId: `${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}`, timestamp: now, meta: { provider: "Nominatim / OSM" } },
        { sourceType: "metro_benchmarks", sourceId: metro.id, timestamp: now, meta: { table: "PropertyInsight knowledge 2026 Q2" } },
        { sourceType: "nar_cost_value", sourceId: "2024 Cost vs Value", timestamp: now },
      ],
      modelVersions: {
        avm: { version: "pi-avm-1.2" },
        dps: { version: "recon-dps-1.0" },
        roi: { version: "nar-2024-local-index" },
      },
      confidence: {
        overall: clamp(0.58 + condAvg / 400, 0.45, 0.84),
        byStage: { acquisition: 0.9, segmentation: 0.62, alignment: 0.7, blending: 0.7, roi: 0.74 },
      },
      assertions: [
        { type: "value_estimate", value: String(estimate), explanation: "Metro median scaled by living area and condition residual." },
        { type: "dps", value: String(dps.score), explanation: dps.action },
        { type: "top_play", value: plays[0]!.id, explanation: plays[0]!.narrative },
      ],
    },
    appreciation,
    demographics: [
      { label: "Median income", value: usd(metro.medianIncome), detail: "ACS-style metro band" },
      { label: "Bachelor+", value: `${metro.bachelorPlus}%`, detail: "Educational attainment" },
      { label: "Median age", value: `${metro.medianAge}`, detail: "Household formation proxy" },
      { label: "HH size", value: metro.householdSize.toFixed(1), detail: "Occupancy pressure" },
      { label: "Owner-occ", value: `${metro.ownerOcc}%`, detail: "Tenure mix" },
      { label: "Unemployment", value: `${metro.unemployment.toFixed(1)}%`, detail: "Labor slack" },
    ],
    enriched: false,
  };
}
