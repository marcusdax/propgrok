import { useEffect, useRef, useState } from "react";
import { usePropertyStore } from "@/lib/property-store";
import { formatMiles } from "@/lib/utils";

// Tile layer configurations
const TILE_LAYERS = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    name: "Dark Matter",
  },
  satellite: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap &copy; OpenStreetMap contributors",
    name: "Topographic",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    name: "Light",
  },
};

type Props = {
  onMapClick: (lat: number, lng: number) => void;
};

export function PropertyMap({ onMapClick }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const pinRef = useRef<import("leaflet").Marker | null>(null);
  const circleRef = useRef<import("leaflet").Circle | null>(null);
  const zoneRef = useRef<import("leaflet").LayerGroup | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const onClickRef = useRef(onMapClick);
  const [activeTileLayer, setActiveTileLayer] = useState<"dark" | "satellite" | "light">("dark");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  // Measurement state
  const [measurePoints, setMeasurePoints] = useState<{ lat: number; lng: number }[]>([]);
  const [measureMode, setMeasureMode] = useState(false);

  const selected = usePropertyStore((s) => s.selected);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const mapCenter = usePropertyStore((s) => s.mapCenter);

  onClickRef.current = onMapClick;

  // Initialize map
  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    if (!el) return;
    let ro: ResizeObserver | undefined;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !host.current) return;

      const map = L.map(host.current, {
        zoomControl: true,
        attributionControl: true,
        minZoom: 3,
      }).setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);

      const tileConfig = TILE_LAYERS[activeTileLayer];
      tileLayerRef.current = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        if (measureMode) {
          setMeasurePoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
        } else {
          onClickRef.current(e.latlng.lat, e.latlng.lng);
        }
      });

      zoneRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);

      const invalidate = () => map.invalidateSize();
      requestAnimationFrame(invalidate);
      window.setTimeout(invalidate, 120);
      window.setTimeout(invalidate, 480);
      ro = new ResizeObserver(invalidate);
      if (host.current) ro.observe(host.current);
    })();

    return () => {
      cancelled = true;
      ro?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle map center changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([mapCenter.lat, mapCenter.lng], mapCenter.zoom, { duration: 0.8 });
    window.setTimeout(() => {
      if (map) map.invalidateSize();
    }, 100);
  }, [mapCenter.lat, mapCenter.lng, mapCenter.zoom]);

  // Handle tile layer changes
  useEffect(() => {
    const map = mapRef.current;
    const currentTileLayer = tileLayerRef.current;
    if (!map || !currentTileLayer) return;

    (async () => {
      const L = await import("leaflet");
      const config = TILE_LAYERS[activeTileLayer];
      const newLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        subdomains: "abcd",
        maxZoom: 20,
      });
      newLayer.addTo(map);
      currentTileLayer.remove();
      tileLayerRef.current = newLayer;
    })();
  }, [activeTileLayer]);

  // Handle selected pin marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (async () => {
      const L = await import("leaflet");
      pinRef.current?.remove();
      pinRef.current = null;

      if (!selected) return;

      const icon = L.divIcon({
        className: "pi-pin property-pin",
        html: `<div style="width:24px;height:24px;border-radius:999px;background:#8aa07a;border:2px solid #eceae4;box-shadow:0 0 0 8px rgba(138,160,122,0.35);display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:600;">${selected.source === "search" ? "S" : selected.source === "map" ? "M" : "G"}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
      marker.bindPopup(`<div style="padding:8px"><strong>${selected.address}</strong><br/><span style="color:#9c9a92;font-size:12px">${selected.city}, ${selected.state}</span></div>`);
      pinRef.current = marker;
    })();
  }, [selected]);

  // Handle geofence circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (async () => {
      const L = await import("leaflet");
      circleRef.current?.remove();
      circleRef.current = null;

      if (!geofenceMode || !selected) return;

      circleRef.current = L.circle([selected.lat, selected.lng], {
        radius,
        color: "#8aa07a",
        weight: 2,
        fillColor: "#8aa07a",
        fillOpacity: 0.12,
      }).addTo(map);
      circleRef.current.bindTooltip(`${formatMiles(radius)} radius`, { permanent: false });
    })();
  }, [geofenceMode, radius, selected]);

  // Handle zone hits markers
  useEffect(() => {
    const map = mapRef.current;
    const group = zoneRef.current;
    if (!map || !group) return;

    (async () => {
      const L = await import("leaflet");
      group.clearLayers();

      const icon = L.divIcon({
        className: "pi-pin zone-marker",
        html: `<div style="width:10px;height:10px;border-radius:999px;background:#c4b49a;border:1px solid #eceae4"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      for (const h of zoneHits) {
        const marker = L.marker([h.lat, h.lng], { icon });
        marker.bindPopup(`<strong>${h.address}</strong><br/><span style="font-size:11px">${h.city}, ${h.state}</span>`);
        marker.addTo(group);
      }
    })();
  }, [zoneHits]);

  // Toggle tile layer
  const switchLayer = (layer: "dark" | "satellite" | "light") => {
    setActiveTileLayer(layer);
  };

  // Toggle heatmap
  const toggleHeatmap = () => {
    setShowHeatmap((prev) => !prev);
  };

  // Toggle measurement mode
  const toggleMeasureMode = () => {
    setMeasureMode((prev) => !prev);
    setMeasurePoints([]);
  };

  // Calculate distance between last two points
  const lastTwoPoints = measurePoints.length >= 2 ? [measurePoints[measurePoints.length - 2], measurePoints[measurePoints.length - 1]] : null;

  return (
    <div className="relative flex h-full w-full flex-col">
      <div ref={host} className="absolute inset-0 h-full w-full" />

      {/* Loading indicator */}
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Tile layer selector */}
      <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1 rounded-lg bg-background/90 p-1 shadow-lg backdrop-blur-sm">
        {(["dark", "light", "satellite"] as const).map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={() => switchLayer(layer)}
            className={`rounded p-1.5 text-xs font-medium transition-all ${
              activeTileLayer === layer
                ? "bg-primary text-background"
                : "text-foreground/70 hover:bg-accent"
            }`}
          >
            {layer === "dark" ? "Dark" : layer === "light" ? "Light" : "Topo"}
          </button>
        ))}
      </div>

      {/* Map controls */}
      <div className="absolute bottom-2 left-2 z-[1000] flex flex-col gap-1 rounded-lg bg-background/90 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={toggleHeatmap}
          className={`rounded p-1.5 text-xs font-medium transition-all ${
            showHeatmap
              ? "bg-primary text-background"
              : "text-foreground/70 hover:bg-accent"
          }`}
        >
          {showHeatmap ? "Heatmap ON" : "Heatmap"}
        </button>
        <button
          type="button"
          onClick={toggleMeasureMode}
          className={`rounded p-1.5 text-xs font-medium transition-all ${
            measureMode
              ? "bg-primary text-background"
              : "text-foreground/70 hover:bg-accent"
          }`}
        >
          Measure
        </button>
        {geofenceMode && selected && (
          <div className="border-t border-border pt-1 text-xs text-muted-foreground">
            <span className="block">Geofence: {formatMiles(radius)}</span>
          </div>
        )}
      </div>

      {/* Measurement result overlay */}
      {lastTwoPoints && (
        <div className="absolute left-3 bottom-20 z-[1000] rounded-lg bg-background/90 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
          <span className="text-muted-foreground">Distance: </span>
          <span className="tabular text-foreground">
            {haversineMiles(lastTwoPoints[0], lastTwoPoints[1]).toFixed(2)} mi
          </span>
        </div>
      )}
    </div>
  );
}

function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h = s1 * s1 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function MapHost({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const selected = usePropertyStore((s) => s.selected);
  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden bg-background">
      <PropertyMap onMapClick={onMapClick} />
      {!selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4">
          <p className="rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm">
            Click the map to drop a pin, or search an address
          </p>
        </div>
      )}
    </div>
  );
}