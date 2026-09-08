import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMapIntelligence } from "@/lib/server/freekma-api";
import { usePropertyStore } from "@/lib/property-store";

export function DemographicHeatmap() {
  const selected = usePropertyStore((state) => state.selected);
  const { mutate, data, isPending } = useMutation({
    mutationFn: () => {
      if (!selected) return Promise.resolve(null);
      return getMapIntelligence({
        data: { data: { lat: selected.lat, lng: selected.lng, radiusM: 1_200, includeDemographics: true, includeHazard: true } },
      });
    },
  });

  if (!selected) {
    return (
      <Card>
        <CardHeader><CardTitle>Evidence map</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Select a parcel to review available map evidence.</p></CardContent>
      </Card>
    );
  }

  const intel = data?.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Evidence map</span>
          {intel && <Badge variant={intel.providerStatus === "available" ? "outline" : "muted"}>AI {intel.providerStatus}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This surface reports evidence coverage. It does not manufacture a heatmap, risk score, or demographic estimate.
        </p>
        <Button type="button" size="sm" onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Checking coverage..." : "Check evidence coverage"}
        </Button>
        {intel && (
          <div className="space-y-3">
            {intel.checks.map((check) => (
              <div key={check.label} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm">{check.label}</p>
                  <Badge variant={check.status === "available" ? "ok" : "warn"}>{check.status}</Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{check.detail}</p>
              </div>
            ))}
            <Separator />
            <p className="text-xs text-muted-foreground">{intel.evidence}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{intel.coverageNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
