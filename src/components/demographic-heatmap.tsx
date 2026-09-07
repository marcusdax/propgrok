import { useEffect, useState } from "react";
import { usePropertyStore } from "@/lib/property-store";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMapIntelligence, getHeatmapTiles } from "@/lib/server/freekma-api";
import { usd } from "@/lib/utils";

export function DemographicHeatmap() {
  const selected = usePropertyStore((s) => s.selected);
  const [radius, setRadius] = useState(1200);
  const [showHazard, setShowHazard] = useState(true);
  const [showDemographics, setShowDemographics] = useState(true);
  const [showInvestment, setShowInvestment] = useState(true);

  const { mutate: loadIntel, isPending, data, reset } = useMutation({
    mutationFn: async () => {
      if (!selected) return null;
      return getMapIntelligence({
        data: {
          lat: selected.lat,
          lng: selected.lng,
          radiusM: radius,
          includeDemographics: showDemographics,
          includeHazard: showHazard,
        },
      });
    },
  });

  const loadIntelHandler = () => {
    reset();
    loadIntel();
  };

  if (!selected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demographic Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a parcel to load demographic and hazard intelligence.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Demographic Heatmap
          {data && (
            <Badge variant={data.source === "free-llm" ? "ok" : "muted"}>{data.source}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Search radius</span>
              <span className="tabular text-foreground">{radius}m</span>
            </div>
            <Slider
              min={200}
              max={3000}
              step={100}
              value={[radius]}
              onValueChange={(v) => setRadius(v[0] ?? 1200)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowDemographics((v) => !v)}
            >
              Demographics {showDemographics ? "✓" : "off"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowHazard((v) => !v)}
            >
              Hazards {showHazard ? "✓" : "off"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowInvestment((v) => !v)}
            >
              Investment {showInvestment ? "✓" : "off"}
            </Button>
          </div>
          <Button type="button" size="sm" onClick={loadIntelHandler} disabled={isPending}>
            {isPending ? "Loading..." : "Load Intelligence"}
          </Button>
        </div>

        {/* Results */}
        {data && (
          <div className="space-y-3">
            {showDemographics && (
              <div>
                <h4 className="text-sm font-medium mb-2">Demographics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-border bg-card p-2">
                    <span className="text-muted-foreground">Population density</span>
                    <span className="block tabular">{data.demographics.populationDensity}</span>
                  </div>
                  <div className="rounded border border-border bg-card p-2">
                    <span className="text-muted-foreground">Median income</span>
                    <span className="block tabular">{usd(data.demographics.medianIncome)}</span>
                  </div>
                  <div className="rounded border border-border bg-card p-2">
                    <span className="text-muted-foreground">Bachelor+</span>
                    <span className="block tabular">{data.demographics.educationBachelorPlus}%</span>
                  </div>
                  <div className="rounded border border-border bg-card p-2">
                    <span className="text-muted-foreground">Median age</span>
                    <span className="block tabular">{data.demographics.ageMedian}</span>
                  </div>
                </div>
              </div>
            )}

            {showHazard && (
              <div>
                <h4 className="text-sm font-medium mb-2">Hazard Risk</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(data.hazards).map(([key, value]) => (
                    <div key={key} className="rounded border border-border bg-card p-2">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="block tabular">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showInvestment && (
              <div>
                <h4 className="text-sm font-medium mb-2">Investment Score</h4>
                <div className="rounded border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opportunity score</span>
                    <span className="font-display text-2xl tabular">{data.opportunities.investmentScore}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{data.opportunities.notes}</p>
                </div>
              </div>
            )}

            <Separator />
            <p className="text-xs text-muted-foreground">
              Evidence: {data.evidence}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}