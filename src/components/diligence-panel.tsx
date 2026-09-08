import { AlertTriangle, CheckCircle2, FileSearch, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiligenceRun } from "@/lib/types";

function statusVariant(status: DiligenceRun["status"]) {
  return status === "ready_for_human_review" ? "ok" : status === "blocked" ? "danger" : "warn";
}

export function DiligencePanel({ run, loading }: { run: DiligenceRun | null; loading: boolean }) {
  if (loading && !run) {
    return <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-48" /><Skeleton className="h-36" /></div>;
  }
  if (!run) return <p className="text-sm text-muted-foreground">Select a parcel to build an evidence-gated diligence memo.</p>;

  const missing = run.claims.filter((claim) => claim.status === "missing");
  return (
    <div className="flex flex-col gap-4 pb-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(run.status)}>{run.status.replaceAll("_", " ")}</Badge>
          {run.modelRun ? <Badge variant="outline">{run.modelRun.provider} / {run.modelRun.profile}</Badge> : <Badge variant="muted">evidence-only</Badge>}
        </div>
        <h2 className="font-display text-2xl tracking-tight">Acquisition diligence</h2>
        <p className="text-sm leading-relaxed text-foreground/90">{run.recommendation}</p>
        {run.providerNotice && <p className="text-xs text-muted-foreground">{run.providerNotice}</p>}
      </header>

      <Card className="border-primary/25 bg-primary/5">
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileSearch className="size-4" /> Investment memo</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed">{run.memo}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="size-4" /> Evidence gate</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {run.claims.map((claim) => (
            <div key={claim.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm">{claim.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{claim.value}</p>
                </div>
                <Badge variant={claim.status === "verified" ? "ok" : claim.status === "missing" ? "danger" : "warn"}>{claim.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{claim.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4" /> Risk register</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {run.risks.map((risk) => (
            <div key={`${risk.label}-${risk.detail}`}>
              <div className="flex items-center gap-2"><Badge variant={risk.severity === "critical" || risk.severity === "high" ? "danger" : risk.severity === "moderate" ? "warn" : "ok"}>{risk.severity}</Badge><p className="text-sm">{risk.label}</p></div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{risk.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="size-4" /> Lowest-cost next checks</CardTitle></CardHeader>
        <CardContent><ol className="space-y-2 text-sm text-muted-foreground">{run.requests.map((request) => <li key={request}>{request}</li>)}</ol></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Source ledger</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          {run.sources.map((source) => <p key={source.id}><span className="text-foreground">{source.label}</span> - {source.status}. {source.detail}</p>)}
          {missing.length > 0 && <p className="pt-2 text-warn">{missing.length} critical evidence items still block human review.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
