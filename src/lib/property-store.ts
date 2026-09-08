import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SAMPLES } from "./knowledge";
import type {
  Amenity,
  Dossier,
  DiligenceRun,
  NeighborhoodIntel,
  OnePager,
  PanelTab,
  PropertyPin,
  RenderJob,
  SampleProperty,
} from "./types";

export const SAMPLE_PINS: SampleProperty[] = SAMPLES.map((s) => ({
  label: s.label,
  blurb: s.blurb,
  pin: {
    id: `sample_${s.lat}`,
    label: `${s.address}, ${s.city}, ${s.state}`,
    address: s.address,
    city: s.city,
    state: s.state,
    postcode: s.postcode,
    lat: s.lat,
    lng: s.lng,
    neighborhood: s.neighborhood,
    source: "sample",
  },
}));

type Status = "idle" | "loading" | "ready" | "error";

type MapLayer = "demographics" | "hazards" | "investment" | null;

type State = {
  selected: PropertyPin | null;
  geofenceMode: boolean;
  geofenceRadiusM: number;
  zoneHits: PropertyPin[];
  dossier: Dossier | null;
  dossierStatus: Status;
  dossierError: string | null;
  diligence: DiligenceRun | null;
  diligenceStatus: Status;
  neighborhood: NeighborhoodIntel | null;
  neighborhoodStatus: Status;
  amenities: Amenity[];
  panelTab: PanelTab;
  render: RenderJob | null;
  campaign: OnePager[];
  campaignStatus: Status;
  history: PropertyPin[];
  mapCenter: { lat: number; lng: number; zoom: number };
  activeMapLayer: MapLayer;
  freeLLMStatus: "idle" | "checking" | "available" | "unavailable";
  mapIntelData: Record<string, unknown> | null;
  measurePoints: { lat: number; lng: number }[];
  measureMode: boolean;
};

type Actions = {
  selectPin: (pin: PropertyPin) => void;
  clearSelection: () => void;
  setGeofenceMode: (on: boolean) => void;
  setGeofenceRadius: (m: number) => void;
  setZoneHits: (hits: PropertyPin[]) => void;
  setDossier: (d: Dossier | null, status?: Status, error?: string | null) => void;
  setDiligence: (run: DiligenceRun | null, status?: Status) => void;
  setNeighborhood: (n: NeighborhoodIntel | null, status?: Status) => void;
  setAmenities: (a: Amenity[]) => void;
  setPanelTab: (t: PanelTab) => void;
  setRender: (r: RenderJob | null) => void;
  patchRender: (p: Partial<RenderJob>) => void;
  setCampaign: (c: OnePager[], status?: Status) => void;
  setMapCenter: (c: { lat: number; lng: number; zoom: number }) => void;
  setActiveMapLayer: (layer: MapLayer) => void;
  setFreeLLMStatus: (status: "idle" | "checking" | "available" | "unavailable") => void;
  setMapIntelData: (data: Record<string, unknown> | null) => void;
  setMeasurePoints: (points: { lat: number; lng: number }[]) => void;
  setMeasureMode: (mode: boolean) => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const usePropertyStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      selected: null,
      geofenceMode: false,
      geofenceRadiusM: 800,
      zoneHits: [],
      dossier: null,
      dossierStatus: "idle",
      dossierError: null,
      diligence: null,
      diligenceStatus: "idle",
      neighborhood: null,
      neighborhoodStatus: "idle",
      amenities: [],
      panelTab: "dossier",
      render: null,
      campaign: [],
      campaignStatus: "idle",
      history: [],
      mapCenter: { lat: 32.7555, lng: -97.3308, zoom: 11 },
      activeMapLayer: null,
      freeLLMStatus: "idle",
      mapIntelData: null,
      measurePoints: [],
      measureMode: false,

      selectPin: (pin) => {
        const history = [pin, ...get().history.filter((h) => h.id !== pin.id)].slice(0, 12);
        set({
          selected: pin,
          history,
          mapCenter: { lat: pin.lat, lng: pin.lng, zoom: 16 },
          dossier: null,
          dossierStatus: "idle",
          dossierError: null,
          diligence: null,
          diligenceStatus: "idle",
          neighborhood: null,
          neighborhoodStatus: "idle",
          amenities: [],
          campaign: [],
          panelTab: "dossier",
        });
      },
      clearSelection: () =>
        set({
          selected: null,
          dossier: null,
          dossierStatus: "idle",
          diligence: null,
          diligenceStatus: "idle",
          neighborhood: null,
          zoneHits: [],
          render: null,
        }),
      setGeofenceMode: (on) => set({ geofenceMode: on }),
      setGeofenceRadius: (m) => set({ geofenceRadiusM: m }),
      setZoneHits: (hits) => set({ zoneHits: hits }),
      setDossier: (d, status = d ? "ready" : "idle", error = null) =>
        set({ dossier: d, dossierStatus: status, dossierError: error }),
      setDiligence: (run, status = run ? "ready" : "idle") => set({ diligence: run, diligenceStatus: status }),
      setNeighborhood: (n, status = n ? "ready" : "idle") =>
        set({ neighborhood: n, neighborhoodStatus: status }),
      setAmenities: (a) => set({ amenities: a }),
      setPanelTab: (t) => set({ panelTab: t }),
      setRender: (r) => set({ render: r }),
      patchRender: (p) => {
        const cur = get().render;
        if (!cur) return;
        set({ render: { ...cur, ...p } });
      },
      setCampaign: (c, status = "ready") => set({ campaign: c, campaignStatus: status }),
      setMapCenter: (c) => set({ mapCenter: c }),
      setActiveMapLayer: (layer) => set({ activeMapLayer: layer }),
      setFreeLLMStatus: (status) => set({ freeLLMStatus: status }),
      setMapIntelData: (data) => set({ mapIntelData: data }),
      setMeasurePoints: (points) => set({ measurePoints: points }),
      setMeasureMode: (mode) => set({ measureMode: mode, measurePoints: mode ? [] : get().measurePoints }),
    }),
    {
      name: "propertyinsight-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (s) => ({
        history: s.history,
        geofenceRadiusM: s.geofenceRadiusM,
        mapCenter: s.mapCenter,
      }),
    },
  ),
);
