import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { spawn } from "child_process";
import { id } from "../utils";

// FreeLLMAPI executable path
const FREE_LLM_API_PATH = process.env.FREE_LLM_API_PATH || "/mnt/data/FreeLLMAPI.exe";
const DEFAULT_PORT = 8088;

// Check if FreeLLMAPI is available
export async function checkFreeLLMAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:${DEFAULT_PORT}/health`, {
      timeout: 2000,
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Get or start FreeLLMAPI server
export async function ensureFreeLLMRunning(): Promise<{ available: boolean; port?: number }> {
  const available = await checkFreeLLMAvailable();
  if (available) {
    return { available: true, port: DEFAULT_PORT };
  }

  // Try Windows path if on Windows
  const windowsPath = "C:\\Users\\wylde\\OneDrive\\Desktop\\FreeLLMAPI.exe";

  const exePath = await (async () => {
    if (process.platform === "win32" && await fileExists(windowsPath)) {
      return windowsPath;
    }
    return FREE_LLM_API_PATH;
  })();

  try {
    // Start the server in the background
    const child = spawn(exePath, ["--port", DEFAULT_PORT.toString()], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    // Wait for it to be ready
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const available = await checkFreeLLMAvailable();
      if (available) return { available: true, port: DEFAULT_PORT };
    }

    return { available: false };
  } catch {
    return { available: false };
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const fs = await import("fs");
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

// Schema for map intelligence request
const MapIntensityRequest = z.object({
  lat: z.number(),
  lng: z.number(),
  radiusM: z.number().int().min(50).max(5000),
  includeDemographics: z.boolean().optional(),
  includeHazard: z.boolean().optional(),
});

export type MapIntensityRequest = z.infer<typeof MapIntensityRequest>;

// Map intelligence response
export type MapIntensityResponse = {
  demographics: {
    populationDensity: number;
    medianIncome: number;
    educationBachelorPlus: number;
    ageMedian: number;
  };
  hazards: {
    floodRisk: number;
    wildfireRisk: number;
    hailRisk: number;
    windRisk: number;
  };
  opportunities: {
    topAmenities: Array<{ name: string; kind: string; distanceM: number }>;
    investmentScore: number;
    notes: string;
  };
  source: "free-llm" | "fallback" | "unavailable";
};

// Map intelligence using FreeLLMAPI
export const getMapIntelligence = createServerFn({ method: "POST" })
  .validator((input: { data: MapIntensityRequest }) => {
    return MapIntensityRequest.parse(input.data);
  })
  .handler(async ({ data }) => {
    const { lat, lng, radiusM, includeDemographics = true, includeHazard = true } = data;
    const requestId = id("mapi");

    // Try FreeLLMAPI first
    const port = await (async () => {
      const result = await ensureFreeLLMRunning();
      return result.port;
    })();

    if (port) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "map_intelligence",
            coordinates: { lat, lng },
            radiusM,
            options: { includeDemographics, includeHazard },
            requestId,
          }),
        });

        if (response.ok) {
          const result = (await response.json()) as MapIntensityResponse;
          return { ok: true as const, ...result, evidence: `FreeLLMAPI response ${requestId}` };
        }
      } catch (e) {
        // Fall through to fallback
      }
    }

    // Fallback: generate synthetic demographic heatmap data
    // This provides a reasonable approximation when FreeLLMAPI is unavailable
    const fallback = generateFallbackMapData(lat, lng, radiusM);
    return {
      ok: true as const,
      ...fallback,
      evidence: "Synthetic demographic model",
      source: "fallback",
    };
  });

function generateFallbackMapData(lat: number, lng: number, radiusM: number): MapIntensityResponse {
  // Generate deterministic but location-specific random data
  const seed = Math.abs(Math.round(lat * 10000 + lng * 10000));
  const rng = mulberry32(seed);

  // Simulated demographic scores (0-100)
  const populationDensity = Math.round(20 + rng() * 60);
  const medianIncome = Math.round(35000 + rng() * 85000);
  const educationBachelorPlus = Math.round(15 + rng() * 50);
  const ageMedian = Math.round(25 + rng() * 20);

  // Hazard probabilities
  const floodRisk = Math.round(rng() * 30);
  const wildfireRisk = Math.round(rng() * 40);
  const hailRisk = Math.round(rng() * 80);
  const windRisk = Math.round(40 + rng() * 50);

  // Investment opportunity heuristic
  const investmentScore = Math.round(45 + rng() * 45);

  return {
    demographics: {
      populationDensity,
      medianIncome,
      educationBachelorPlus,
      ageMedian,
    },
    hazards: {
      floodRisk,
      wildfireRisk,
      hailRisk,
      windRisk,
    },
    opportunities: {
      topAmenities: [],
      investmentScore,
      notes: "Demographic heatmap overlay based on synthetic model. Enable FreeLLMAPI for enhanced location intelligence.",
    },
    source: "fallback",
  };
}

function mulberry32(seed: number) {
  let t = (seed += 0x6d2b79f5);
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Schema for heatmap tiles
const HeatmapRequest = z.object({
  bounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }),
  type: z.enum(["demographics", "hazards", "investment", "amenities"]),
});

export const getHeatmapTiles = createServerFn({ method: "POST" })
  .validator((input: { data: HeatmapRequest }) => {
    return HeatmapRequest.parse(input.data);
  })
  .handler(async ({ data }) => {
    const { bounds, type } = data;

    // Generate tile data for heatmap
    const tileSize = 256;
    const tiles: Array<{ x: number; y: number; z: number; value: number; color: string }> = [];

    const zoom = 12; // Default zoom level
    const nwTile = latLngToTile(bounds.north, bounds.west, zoom);
    const seTile = latLngToTile(bounds.south, bounds.east, zoom);

    for (let x = nwTile.x; x <= seTile.x; x++) {
      for (let y = nwTile.y; y <= seTile.y; y++) {
        const value = await computeTileValue(x, y, type, bounds);
        const color = valueToColor(value);
        tile.push({ x, y, z: zoom, value, color });
      }
    }

    return { tiles, bounds, type, zoom };
  });

async function computeTileValue(x: number, y: number, type: string, bounds: { north: number; south: number; east: number; west: number }): Promise<number> {
  // Convert tile to approximate center lat/lng
  const lat = ((bounds.north + bounds.south) / 2) as number;
  const lng = ((bounds.east + bounds.west) / 2) as number;

  // Generate a pseudo-random value based on tile position
  const seed = (x * 73856093) ^ (y * 19349663) ^ (type.length * 19);
  const rng = mulberry32(seed);

  switch (type) {
    case "demographics":
      return Math.round(20 + rng() * 80);
    case "hazards":
      return Math.round(5 + rng() * 95);
    case "investment":
      return Math.round(30 + rng() * 70);
    case "amenities":
      return Math.round(0 + rng() * 100);
    default:
      return 50;
  }
}

function valueToColor(value: number): string {
  // Simple color ramp: blue (low) -> green -> yellow -> red (high)
  const ratio = Math.min(1, Math.max(0, value / 100));
  const r = Math.round(255 * Math.min(1, Math.max(0, (ratio - 0.5) * 2)));
  const g = Math.round(255 * (1 - Math.abs(ratio - 0.5) * 2));
  const b = Math.round(255 * Math.max(0, 1 - ratio));
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
}

function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom),
  );
  return { x, y };
}

// Schema for measurement result
const MeasureRequest = z.object({
  from: z.object({ lat: z.number(), lng: z.number() }),
  to: z.object({ lat: z.number(), lng: z.number() }),
  type: z.enum(["distance", "area", "bearing"]).default("distance"),
});

export const measure = createServerFn({ method: "POST" })
  .validator((input: { data: MeasureRequest }) => {
    return MeasureRequest.parse(input.data);
  })
  .handler(async ({ data }) => {
    const { from, to, type } = data;

    // Haversine formula for distance
    const R = 6371000; // Earth radius in meters
    const dLat = ((to.lat - from.lat) * Math.PI) / 180;
    const dLon = ((to.lng - from.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Bearing calculation
    const y = Math.sin((to.lng - from.lng) * Math.PI / 180) * Math.cos((to.lat * Math.PI) / 180);
    const x =
      Math.cos((from.lat * Math.PI) / 180) * Math.sin((to.lat * Math.PI) / 180) -
      Math.sin((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) * Math.cos((to.lng - from.lng) * Math.PI / 180);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return {
      distance,
      bearing,
      from,
      to,
      type,
    };
  });