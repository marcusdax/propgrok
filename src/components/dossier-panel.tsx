import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_PINS } from "@/lib/property-store";
import type { Dossier, NeighborhoodIntel, PropertyPin } from "@/lib/types";
import { compactUsd, pct, usd } from "@/lib/utils";

function dpsVariant(tier: string) {
  if (tier === "CRITICAL" || tier === "HIGH") return "danger" as const;
  if (tier === "MODERATE") return "warn" as const;
  return "ok" as const;
}

function severityVariant(s: string) {
  if (s === "critical" || s === "high") return "danger" as const;
  if (s === "moderate") return "warn" as const;
  return "ok" as const;
}

export function DossierPanel({
  dossier,
  loading,
  neighborhood,
  onSample,
}: {
  dossier: Dossier | null;
  loading: boolean;
  neighborhood: NeighborhoodIntel | null;
  onSample?: (pin: PropertyPin) => void;
}) {
  if (loading && !dossier) return <DossierSkeleton />;
  if (!dossier) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 p-2">
        <p className="font-display text-2xl tracking-tight">Scout a parcel</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Search an address, drop a pin, or load a Hail Belt sample. The dossier models value, condition, storm probability, and the cheapest renovation that photographs.
        </p>
        <div className="grid w-full gap-2">
          {SAMPLE_PINS.map((s) => (
            <Button
              key={s.pin.id}
              type="button"
              variant="outline"
              className="h-auto justify-start px-3 py-3 text-left"
              onClick={() => onSample?.(s.pin)}
            >
              <span>
                <span className="block text-sm text-foreground">{s.label}</span>
                <span className="block text-xs font-normal normal-case tracking-normal text-muted-foreground">
                  {s.blurb}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const { valuation, profile, dps, plays, condition } = dossier;
  const condEntries = Object.entries(condition);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={dpsVariant(dps.tier)}>DPS {dps.score} · {dps.tier}</Badge>
          {dossier.enriched ? <Badge variant="ok">Grok overlay</Badge> : <Badge variant="muted">Local model</Badge>}
          {profile.occupancy !== "owner" && <Badge variant="outline">{profile.occupancy}</Badge>}
        </div>
        <h2 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">{dossier.pin.address}</h2>
        <p className="text-sm text-muted-foreground">
          {[dossier.pin.neighborhood, dossier.pin.city, dossier.pin.state, dossier.pin.postcode]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">{dossier.thesis}</p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Modeled value" value={compactUsd(valuation.estimate)} hint={`${compactUsd(valuation.low)}–${compactUsd(valuation.high)}`} />
        <Stat label="Confidence" value={pct(valuation.confidence * 100)} hint={valuation.method.split("—")[0]} />
        <Stat label="Year / area" value={`${profile.yearBuilt}`} hint={`${profile.sqft.toLocaleString()} sf · ${profile.beds} bd`} />
        <Stat label="Top play ROI" value={pct(plays[0]?.roiPct ?? 0)} hint={plays[0]?.label} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {condEntries.map(([k, v]) => (
            <div key={k} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize text-muted-foreground">{k.replace("_", " ")}</span>
                <span className="tabular text-foreground">{v.score}{v.ageYears != null ? ` · ${v.ageYears}y` : ""}</span>
              </div>
              <Progress value={v.score} />
              <p className="text-xs text-muted-foreground">{v.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Renovation ROI matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plays} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "ROI"]}
                />
                <Bar dataKey="roiPct" fill="#8aa07a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Play</th>
                  <th className="pb-2 font-medium">Mid cost</th>
                  <th className="pb-2 font-medium">ROI</th>
                  <th className="pb-2 font-medium">Value add</th>
                </tr>
              </thead>
              <tbody>
                {plays.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span>{p.rank}.</span>
                        <span>{p.label}</span>
                        <Badge variant={p.demand === "hot" ? "ok" : p.demand === "steady" ? "outline" : "muted"}>
                          {p.demand}
                        </Badge>
                      </div>
                    </td>
                    <td className="tabular py-2">{usd(p.costMid)}</td>
                    <td className="tabular py-2">{p.roiPct.toFixed(1)}%</td>
                    <td className="tabular py-2">{usd(p.valueAdd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Costs scaled by {dossier.metro.name} construction index {dossier.metro.costIndex.toFixed(2)}. ROI priors from NAR Cost vs. Value, residualized by condition.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storm intelligence · Recon DPS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{dps.action}</p>
          {dps.factors.map((f) => (
            <div key={f.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {f.name} · {f.weight}%
                </span>
                <span className="tabular">{f.points}</span>
              </div>
              <Progress value={f.points} />
              <p className="text-xs text-muted-foreground">{f.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metro path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dossier.appreciation} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#9c9a92", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => compactUsd(Number(v))}
                />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [usd(Number(v)), "Modeled"]}
                />
                <Line type="monotone" dataKey="value" stroke="#8aa07a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {dossier.metro.name} · {dossier.metro.yoyAppreciation.toFixed(1)}% modeled CAGR · rent yield {dossier.metro.rentYield.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investor fit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dossier.investorFit.map((f) => (
              <div key={f.strategy}>
                <div className="flex justify-between text-sm">
                  <span>{f.strategy}</span>
                  <span className="tabular text-primary">{f.score}</span>
                </div>
                <Progress value={f.score} className="mt-1" />
                <p className="mt-1 text-xs text-muted-foreground">{f.why}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {dossier.demographics.map((d) => (
              <div key={d.label}>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.label}</p>
                <p className="tabular text-sm">{d.value}</p>
                <p className="text-xs text-muted-foreground">{d.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.risks.map((r) => (
            <div key={r.label} className="flex gap-3">
              <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge>
              <div>
                <p className="text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incentives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.incentives.map((i) => (
            <div key={i.name}>
              <div className="flex items-center gap-2">
                <p className="text-sm">{i.name}</p>
                <Badge variant="outline">{i.kind}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{i.valueNote}</p>
              <p className="text-xs text-muted-foreground">{i.eligibility}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Underwriting narrative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>{dossier.narrative}</p>
          <p className="text-muted-foreground">{dossier.occupancyNote}</p>
          {neighborhood && (
            <>
              <Separator />
              <p>{neighborhood.summary}</p>
              <p className="text-muted-foreground">{neighborhood.trend}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence chain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            {dossier.evidence.evidenceId} · overall confidence {pct(dossier.evidence.confidence.overall * 100)}
          </p>
          {dossier.evidence.sources.map((s) => (
            <p key={s.sourceId + s.sourceType}>
              {s.sourceType} · {s.sourceId} · {s.timestamp.slice(0, 16).replace("T", " ")}
            </p>
          ))}
          {dossier.evidence.assertions.map((a) => (
            <p key={a.type}>
              {a.type}: {a.value} — {a.explanation}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl tabular tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DossierSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function NeighborhoodPanel({ intel, loading }: { intel: NeighborhoodIntel | null; loading: boolean }) {
  if (loading && !intel) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (!intel) {
    return <p className="text-sm text-muted-foreground">Select a parcel to load neighborhood intelligence.</p>;
  }
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Neighborhood</h2>
          <p className="text-sm text-muted-foreground">{intel.pin.neighborhood || intel.pin.city}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Walk proxy</p>
          <p className="font-display text-3xl tabular">{intel.walkScore}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{intel.summary}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {intel.clusters.map((c) => (
          <div key={c.kind} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.kind.replace("_", " ")}</p>
            <p className="tabular text-lg">{c.count}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-3 pt-4 text-sm">
          <p>{intel.schoolsNote}</p>
          <p className="text-muted-foreground">{intel.laborNote}</p>
          <p className="text-muted-foreground">{intel.zoningNote}</p>
          <p>{intel.trend}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mapped amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {intel.amenities.slice(0, 18).map((a) => (
              <li key={a.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {a.name} <span className="text-muted-foreground">· {a.kind}</span>
                </span>
                <span className="shrink-0 tabular text-muted-foreground">
                  {(a.distanceM / 1609.344).toFixed(2)} mi
                </span>
              </li>
            ))}
            {intel.amenities.length === 0 && (
              <li className="text-muted-foreground">No POIs returned for this radius.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
