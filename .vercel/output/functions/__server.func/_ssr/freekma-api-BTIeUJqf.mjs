import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as aiProvider } from "./ai-provider-2njZqQPi.mjs";
import { c as object, i as boolean, s as number } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/freekma-api-BTIeUJqf.js
var mapRequestSchema = object({
	lat: number().min(-90).max(90),
	lng: number().min(-180).max(180),
	radiusM: number().int().min(50).max(5e3),
	includeDemographics: boolean().optional(),
	includeHazard: boolean().optional()
});
var getMapIntelligence_createServerFn_handler = createServerRpc({
	id: "beb49bcbe91120e04a3c278c046c7b83ceeded54f29a5dc2da6e0745069cf2f4",
	name: "getMapIntelligence",
	filename: "src/lib/server/freekma-api.ts"
}, (opts) => getMapIntelligence.__executeServer(opts));
var getMapIntelligence = createServerFn({ method: "POST" }).validator((input) => mapRequestSchema.parse(input.data)).handler(getMapIntelligence_createServerFn_handler, async ({ data }) => {
	return {
		ok: true,
		data: {
			source: "unavailable",
			providerStatus: (await aiProvider.health("public")).available ? "available" : "unavailable",
			evidence: "No authoritative map-layer dataset is attached.",
			coverageNote: `No demographic, hazard, or investment scores were generated for this ${data.radiusM} m radius. AI availability does not make those facts available.`,
			checks: [
				{
					label: "Demographics",
					status: "unavailable",
					detail: "Use the neighborhood dossier's cited Census profile when available; this map layer has no tract dataset."
				},
				{
					label: "Parcel hazards",
					status: "unavailable",
					detail: "Connect FEMA, insurer, or parcel-specific hazard evidence before scoring risk."
				},
				{
					label: "Investment score",
					status: "unavailable",
					detail: "A deal score is blocked until verified sales, rent, tax, zoning, and hazard evidence are attached."
				}
			]
		}
	};
});
//#endregion
export { getMapIntelligence_createServerFn_handler };
