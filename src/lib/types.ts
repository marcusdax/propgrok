export type FeatureKey =
  | "garage_door"
  | "roof"
  | "windows"
  | "siding"
  | "paint"
  | "landscaping";

export type PanelTab = "dossier" | "neighborhood" | "alter" | "campaign" | "heatmap";

export type GeocodeHit = {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  county?: string;
};

export type PropertyPin = GeocodeHit & {
  source: "search" | "map" | "geofence" | "sample";
};

export type Amenity = {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lng: number;
  distanceM: number;
};

export type ConditionScore = {
  score: number;
  note: string;
  ageYears?: number;
};

export type DpsFactor = {
  name: string;
  weight: number;
  points: number;
  note: string;
};

export type RoiPlay = {
  id: FeatureKey;
  label: string;
  costLow: number;
  costHigh: number;
  costMid: number;
  roiPct: number;
  valueAdd: number;
  paybackYears: number;
  demand: "hot" | "steady" | "soft";
  narrative: string;
  rank: number;
};

export type Incentive = {
  name: string;
  kind: "federal" | "state" | "local" | "utility";
  valueNote: string;
  eligibility: string;
};

export type RiskItem = {
  label: string;
  severity: "low" | "moderate" | "high" | "critical";
  detail: string;
};

export type InvestorFit = {
  strategy: string;
  score: number;
  why: string;
};

export type EvidenceSource = {
  sourceType: string;
  sourceId: string;
  timestamp: string;
  meta?: Record<string, string>;
};

export type EvidenceDocument = {
  evidenceId: string;
  createdAt: string;
  sources: EvidenceSource[];
  modelVersions: Record<string, { version: string }>;
  confidence: { overall: number; byStage: Record<string, number> };
  assertions: { type: string; value: string; explanation: string }[];
};

export type MetroProfile = {
  id: string;
  name: string;
  state: string;
  medianValue: number;
  yoyAppreciation: number;
  rentYield: number;
  costIndex: number;
  hailRisk: number;
  windRisk: number;
  floodRisk: number;
  wildfireRisk: number;
  unemployment: number;
  medianIncome: number;
  bachelorPlus: number;
  medianAge: number;
  householdSize: number;
  ownerOcc: number;
  narrative: string;
};

export type PropertyProfile = {
  yearBuilt: number;
  sqft: number;
  beds: number;
  baths: number;
  lotSqft: number;
  stories: number;
  occupancy: "owner" | "rental" | "vacant";
  construction: string;
  roofMaterial: string;
  roofAge: number;
  garage: "none" | "1-car" | "2-car" | "3-car";
};

export type Dossier = {
  pin: PropertyPin;
  profile: PropertyProfile;
  metro: MetroProfile;
  valuation: {
    estimate: number;
    low: number;
    high: number;
    confidence: number;
    method: string;
    asOf: string;
  };
  condition: Record<FeatureKey, ConditionScore>;
  dps: { score: number; tier: string; factors: DpsFactor[]; action: string };
  plays: RoiPlay[];
  incentives: Incentive[];
  risks: RiskItem[];
  thesis: string;
  narrative: string;
  occupancyNote: string;
  investorFit: InvestorFit[];
  evidence: EvidenceDocument;
  appreciation: { year: string; value: number }[];
  demographics: {
    label: string;
    value: string;
    detail: string;
  }[];
  enriched: boolean;
};

export type NeighborhoodIntel = {
  pin: PropertyPin;
  summary: string;
  walkScore: number;
  amenities: Amenity[];
  clusters: { kind: string; count: number }[];
  schoolHighlights: { name: string; kind: string; distanceM: number }[];
  amenityHighlights: Amenity[];
  census: {
    geography: string;
    vintage: string;
    source: string;
    population: number | null;
    medianIncome: number | null;
    medianAge: number | null;
    bachelorPlusPct: number | null;
    ownerOccupancyPct: number | null;
    householdSize: number | null;
  } | null;
  demographicHighlights: { label: string; value: string; detail: string }[];
  marketSignals: { label: string; value: string; detail: string }[];
  rentSignals: {
    type:
      | "rent_estimate"
      | "sale_estimate"
      | "vacancy_estimate"
      | "days_on_market"
      | "price_per_sqft";
    label: string;
    value: string;
    detail: string;
  }[];
  investmentSignals: { label: string; value: string; detail: string }[];
  dataGaps: string[];
  investorRead: string;
  schoolsNote: string;
  laborNote: string;
  zoningNote: string;
  trend: string;
  enriched: boolean;
};

export type RenderJob = {
  feature: FeatureKey;
  style: string;
  prompt: string;
  beforeDataUrl: string;
  afterDataUrl: string | null;
  headline: string;
  body: string;
  roiStatement: string;
  status: "idle" | "running" | "done" | "error";
  error?: string;
};

export type OnePager = {
  id: string;
  address: string;
  headline: string;
  summary: string;
  cta: string;
  dps?: number;
  estimate?: number;
};

export type SampleProperty = {
  label: string;
  blurb: string;
  pin: PropertyPin;
};
