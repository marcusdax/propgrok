import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlterStudio } from "@/components/alter-studio";
import { CampaignPanel } from "@/components/campaign-panel";
import { BrandMark, CommandSearch, GeofenceToggle } from "@/components/command-search";
import { DossierPanel, NeighborhoodPanel } from "@/components/dossier-panel";
import { DemographicHeatmap } from "@/components/demographic-heatmap";
import { DiligencePanel } from "@/components/diligence-panel";
import { MapHost } from "@/components/property-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildDossier } from "@/lib/engine";
import { usePropertyStore } from "@/lib/property-store";
import { analyzeNeighborhood, analyzeProperty } from "@/lib/server/analyze";
import { createDiligenceRun } from "@/lib/server/diligence";
import { fetchAmenities, reverseGeocode } from "@/lib/server/geo";
import type { GeocodeHit, PanelTab, PropertyPin } from "@/lib/types";
import { formatMiles } from "@/lib/utils";

const STAGES = [
  "Geocoding parcel",
  "Overlaying amenities",
  "Scoring condition",
  "Modeling ROI",
  "Writing evidence",
];

export function ScoutWorkspace() {
  const selected = usePropertyStore((s) => s.selected);
  const selectPin = usePropertyStore((s) => s.selectPin);
  const dossier = usePropertyStore((s) => s.dossier);
  const dossierStatus = usePropertyStore((s) => s.dossierStatus);
  const setDossier = usePropertyStore((s) => s.setDossier);
  const diligence = usePropertyStore((s) => s.diligence);
  const diligenceStatus = usePropertyStore((s) => s.diligenceStatus);
  const setDiligence = usePropertyStore((s) => s.setDiligence);
  const neighborhood = usePropertyStore((s) => s.neighborhood);
  const neighborhoodStatus = usePropertyStore((s) => s.neighborhoodStatus);
  const setNeighborhood = usePropertyStore((s) => s.setNeighborhood);
  const setAmenities = usePropertyStore((s) => s.setAmenities);
  const panelTab = usePropertyStore((s) => s.panelTab);
  const setPanelTab = usePropertyStore((s) => s.setPanelTab);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
  const history = usePropertyStore((s) => s.history);

  const [stage, setStage] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const runIntel = async (pin: PropertyPin) => {
    setDossier(buildDossier(pin), "loading");
    setDiligence(null, "loading");
    setNeighborhood(null, "loading");
    setStage(0);
    try {
      setStage(1);
      const am = await fetchAmenities({ data: { lat: pin.lat, lng: pin.lng, radiusM: 1200 } });
      const amenities = am.ok ? am.amenities : [];
      setAmenities(amenities);
      setStage(2);
      const [prop, hood] = await Promise.all([
        analyzeProperty({ data: { pin, amenities } }),
        analyzeNeighborhood({ data: { pin, amenities } }),
      ]);
      setStage(4);
      if (prop.ok) setDossier(prop.dossier, "ready");
      else setDossier(buildDossier(pin), "ready");
      if (hood.ok) setNeighborhood(hood.intel, "ready");
      else setNeighborhood(null, "idle");
      const finalDossier = prop.ok ? prop.dossier : buildDossier(pin);
      const finalNeighborhood = hood.ok ? hood.intel : null;
      const diligence = await createDiligenceRun({ data: { dossier: finalDossier, neighborhood: finalNeighborhood } });
      if (diligence.ok) setDiligence(diligence.run, "ready");
      else setDiligence(null, "error");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error(msg);
      setDossier(buildDossier(pin), "ready", msg);
      setDiligence(null, "error");
      setNeighborhood(null, "idle");
    }
  };

  const onHit = (hit: GeocodeHit) => {
    const pin: PropertyPin = { ...hit, source: hit.id.startsWith("sample_") ? "sample" : "search" };
    selectPin(pin);
    void runIntel(pin);
  };

  const onMapClick = async (lat: number, lng: number) => {
    try {
      const res = await reverseGeocode({ data: { lat, lng } });
      const hit = res.ok
        ? res.hit
        : {
            id: `pin_${lat}`,
            label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            address: "Dropped pin",
            city: "",
            state: "",
            postcode: "",
            lat,
            lng,
          };
      const pin: PropertyPin = { ...hit, lat, lng, source: "map" };
      selectPin(pin);
      void runIntel(pin);
    } catch {
      toast.error("Reverse geocode failed");
    }
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background text-foreground">
      <header className="z-20 flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <CommandSearch onSelect={onHit} />
        </div>
        <div className="flex items-center gap-2">
          <GeofenceToggle />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="relative h-[42vh] min-h-[240px] w-full shrink-0 lg:h-auto lg:w-[46%]">
          {mapReady ? <MapHost onMapClick={onMapClick} /> : <div className="h-full bg-muted" />}
          {geofenceMode && selected && (
            <div className="absolute left-3 right-3 top-3 rounded-lg border border-border bg-background/85 p-3 backdrop-blur-sm lg:right-auto lg:w-72">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Geofence</span>
                <span className="tabular">{formatMiles(radius)}</span>
              </div>
              <Slider min={200} max={2400} step={50} value={[radius]} onValueChange={(v) => setRadius(v[0] ?? 800)} />
            </div>
          )}
          {dossierStatus === "loading" && (
            <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-background/85 px-3 py-2 text-xs backdrop-blur-sm">
              <p className="text-primary">{STAGES[Math.min(stage, STAGES.length - 1)]}</p>
            </div>
          )}
        </section>

        <aside className="flex min-h-0 flex-1 flex-col border-t border-border lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
            <Tabs value={panelTab} onValueChange={(v) => setPanelTab(v as PanelTab)} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="dossier">Dossier</TabsTrigger>
                <TabsTrigger value="diligence">Diligence</TabsTrigger>
                <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                <TabsTrigger value="alter">Alter</TabsTrigger>
                <TabsTrigger value="campaign">Campaign</TabsTrigger>
              </TabsList>
            </Tabs>
            {dossier && (
              <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                {dossier.metro.name}
              </Badge>
            )}
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4">
              {panelTab === "dossier" && (
                <DossierPanel
                  dossier={dossier}
                  loading={dossierStatus === "loading"}
                  neighborhood={neighborhood}
                  onSample={onHit}
                />
              )}
              {panelTab === "diligence" && <DiligencePanel run={diligence} loading={diligenceStatus === "loading"} />}
              {panelTab === "neighborhood" && (
                <NeighborhoodPanel intel={neighborhood} loading={neighborhoodStatus === "loading"} />
              )}
              {panelTab === "heatmap" && <DemographicHeatmap />}
              {panelTab === "alter" && <AlterStudio />}
              {panelTab === "campaign" && <CampaignPanel />}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {history.length > 0 && (
        <footer className="hidden shrink-0 items-center gap-2 overflow-x-auto border-t border-border px-4 py-2 md:flex">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Recent</span>
          {history.slice(0, 6).map((h) => (
            <Button
              key={h.id}
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 shrink-0"
              onClick={() => {
                selectPin(h);
                void runIntel(h);
              }}
            >
              {h.address}
            </Button>
          ))}
        </footer>
      )}
    </div>
  );
}
