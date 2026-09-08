import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { aiProvider } from "@/lib/server/ai-provider";

const mapRequestSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusM: z.number().int().min(50).max(5_000),
  includeDemographics: z.boolean().optional(),
  includeHazard: z.boolean().optional(),
});

export type MapIntelligenceResponse = {
  source: "unavailable";
  providerStatus: "available" | "unavailable";
  evidence: string;
  coverageNote: string;
  checks: Array<{ label: string; status: "available" | "unavailable"; detail: string }>;
};

export const getMapIntelligence = createServerFn({ method: "POST" })
  .validator((input: { data: z.infer<typeof mapRequestSchema> }) => mapRequestSchema.parse(input.data))
  .handler(async ({ data }): Promise<{ ok: true; data: MapIntelligenceResponse }> => {
    const health = await aiProvider.health("public");
    return {
      ok: true,
      data: {
        source: "unavailable",
        providerStatus: health.available ? "available" : "unavailable",
        evidence: "No authoritative map-layer dataset is attached.",
        coverageNote: `No demographic, hazard, or investment scores were generated for this ${data.radiusM} m radius. AI availability does not make those facts available.`,
        checks: [
          {
            label: "Demographics",
            status: "unavailable",
            detail: "Use the neighborhood dossier's cited Census profile when available; this map layer has no tract dataset.",
          },
          {
            label: "Parcel hazards",
            status: "unavailable",
            detail: "Connect FEMA, insurer, or parcel-specific hazard evidence before scoring risk.",
          },
          {
            label: "Investment score",
            status: "unavailable",
            detail: "A deal score is blocked until verified sales, rent, tax, zoning, and hazard evidence are attached.",
          },
        ],
      },
    };
  });
